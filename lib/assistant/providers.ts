// Pluggable generation providers for the career assistant.
//
// The site assembles the ENTIRE prompt (system + knowledge pack + history); a
// provider's only job is to run inference and stream text back. Two providers:
//
//   - `local`  → Switchboard (the pop-os FastAPI model-swap service on a Tesla
//                P100). OpenAI/Ollama-compatible chat, bearer-token auth, sends
//                a priority hint so site traffic preempts background jobs.
//                See plans/personal-assistant/SWITCHBOARD-HANDOFF.md.
//   - `haiku`  → Anthropic Messages API (claude-haiku-4-5). Used as primary or as
//                the fallback when `local` times out / errors. Prompt-caches the
//                static system+pack block (identical across every turn/visitor).
//
// Selection is via ASSISTANT_PROVIDER. When `local` is selected we race the first
// token against a timeout; on timeout/error we fall back to Haiku if a key exists,
// otherwise the orchestrator throws AssistantUnavailableError and the route shows
// a friendly "book a call" message — never a stack trace, never an invented answer.

import Anthropic from '@anthropic-ai/sdk';

export type ChatRole = 'user' | 'assistant';
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface GenerateParams {
  /** Full system prompt: persona + bounds + knowledge pack. Static across turns. */
  system: string;
  /** Capped conversation history, ending with the user's latest question. */
  messages: ChatMessage[];
  temperature: number;
  maxTokens: number;
  signal: AbortSignal;
}

export type ProviderName = 'local' | 'haiku';

export interface ChatProvider {
  readonly name: ProviderName;
  /** True when the env this provider needs is present. */
  isConfigured(): boolean;
  /** Yields text deltas as they arrive. Throws on transport/model failure. */
  generate(params: GenerateParams): AsyncIterable<string>;
}

const HAIKU_MODEL = 'claude-haiku-4-5-20251001';
const DEFAULT_LOCAL_MODEL = 'gemma-e4b';
// How long we wait for the FIRST token from `local` before falling back to Haiku.
// Once a token has arrived we're committed to the stream (can't fall back cleanly).
const LOCAL_FIRST_TOKEN_TIMEOUT_MS = 8000;

// ── local: Switchboard (OpenAI/Ollama-compatible) ────────────────
export const localProvider: ChatProvider = {
  name: 'local',
  isConfigured: () => Boolean(process.env.SWITCHBOARD_URL),
  async *generate({ system, messages, temperature, maxTokens, signal }) {
    const url = process.env.SWITCHBOARD_URL!;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (process.env.SWITCHBOARD_TOKEN) {
      headers.Authorization = `Bearer ${process.env.SWITCHBOARD_TOKEN}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      signal,
      body: JSON.stringify({
        model: process.env.ASSISTANT_MODEL || DEFAULT_LOCAL_MODEL,
        // Switchboard expects a fully-assembled message list with the system role
        // inline; it passes them through verbatim (no persona/KB of its own).
        messages: [{ role: 'system', content: system }, ...messages],
        priority: 'interactive', // site traffic preempts batch jobs for the GPU
        temperature,
        max_tokens: maxTokens,
        stream: true,
      }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`switchboard responded ${res.status}`);
    }

    yield* parseOpenAiSse(res.body);
  },
};

// ── haiku: Anthropic Messages API ────────────────────────────────
export const haikuProvider: ChatProvider = {
  name: 'haiku',
  isConfigured: () => Boolean(process.env.ANTHROPIC_API_KEY),
  async *generate({ system, messages, temperature, maxTokens, signal }) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const stream = client.messages.stream(
      {
        model: HAIKU_MODEL,
        max_tokens: maxTokens,
        temperature,
        // The system+pack block is identical across every request, so cache it.
        // The pack alone is ~11k tokens — well above Haiku's cache minimum.
        system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
        messages,
      },
      { signal },
    );

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  },
};

// ── orchestration: select, race first token, fall back ───────────
export class AssistantUnavailableError extends Error {
  constructor(message = 'assistant backend unavailable') {
    super(message);
    this.name = 'AssistantUnavailableError';
  }
}

/**
 * Picks the configured provider chain (selected primary, then Haiku as fallback
 * when the primary isn't Haiku), starts streaming, and returns the first chain
 * member that yields a token within its budget. The returned stream re-emits the
 * already-pulled first token followed by the remainder.
 *
 * Throws AssistantUnavailableError when no provider can produce an answer.
 */
export async function getAnswerStream(params: {
  system: string;
  messages: ChatMessage[];
  temperature: number;
  maxTokens: number;
  signal: AbortSignal;
}): Promise<{ provider: ProviderName; stream: AsyncIterable<string> }> {
  const selected: ProviderName = process.env.ASSISTANT_PROVIDER === 'haiku' ? 'haiku' : 'local';
  const primary = selected === 'haiku' ? haikuProvider : localProvider;

  const chain: ChatProvider[] = [primary];
  if (primary.name !== 'haiku') chain.push(haikuProvider);

  for (const provider of chain) {
    if (!provider.isConfigured()) continue;
    // Only the local box gets a first-token deadline; Haiku is the safety net,
    // so we let it take whatever the request signal allows.
    const timeoutMs = provider.name === 'local' ? LOCAL_FIRST_TOKEN_TIMEOUT_MS : 0;
    try {
      const stream = await startWithFirstToken(provider, params, timeoutMs);
      return { provider: provider.name, stream };
    } catch {
      // Try the next provider in the chain.
    }
  }

  throw new AssistantUnavailableError();
}

/**
 * Starts a provider's stream and pulls the first token under an optional
 * deadline, using a per-attempt AbortController so a failed attempt is torn
 * down without killing the request (letting the next provider try). Returns a
 * generator that replays the first token then the rest.
 */
async function startWithFirstToken(
  provider: ChatProvider,
  params: { system: string; messages: ChatMessage[]; temperature: number; maxTokens: number; signal: AbortSignal },
  timeoutMs: number,
): Promise<AsyncIterable<string>> {
  const attempt = new AbortController();
  const onAbort = () => attempt.abort();
  params.signal.addEventListener('abort', onAbort, { once: true });

  const iterator = provider
    .generate({ ...params, signal: attempt.signal })
    [Symbol.asyncIterator]();

  let first: IteratorResult<string>;
  try {
    if (timeoutMs > 0) {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const deadline = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('first-token timeout')), timeoutMs);
      });
      try {
        first = await Promise.race([iterator.next(), deadline]);
      } finally {
        if (timer) clearTimeout(timer);
      }
    } else {
      first = await iterator.next();
    }
  } catch (err) {
    attempt.abort(); // tear down the underlying request before falling back
    params.signal.removeEventListener('abort', onAbort);
    throw err;
  }

  if (first.done) {
    attempt.abort();
    params.signal.removeEventListener('abort', onAbort);
    throw new Error('empty stream');
  }

  return (async function* () {
    yield first.value;
    while (true) {
      const next = await iterator.next();
      if (next.done) return;
      yield next.value;
    }
  })();
}

// Parse an OpenAI/Ollama-style chat-completions SSE body into text deltas.
async function* parseOpenAiSse(body: ReadableStream<Uint8Array>): AsyncIterable<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') return;
        try {
          const json = JSON.parse(data);
          const delta: string | undefined =
            json.choices?.[0]?.delta?.content ?? json.message?.content ?? json.response;
          if (delta) yield delta;
        } catch {
          // skip malformed/keep-alive lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
