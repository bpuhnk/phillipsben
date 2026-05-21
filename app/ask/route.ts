// POST /ask — the career assistant endpoint.
//
// Takes a short conversation, assembles a bounded prompt from the build-time
// knowledge pack (Phase 01) + the assistant config, and streams a grounded
// answer back as SSE. The site owns the entire prompt; the provider just runs
// the model (see lib/assistant/providers.ts).
//
// Guardrails:
//   - Any client-supplied `system` role is ignored — we always prepend our own.
//   - History is truncated to the configured turn cap.
//   - Per-IP in-memory sliding-window rate limit (single instance behind the tunnel).
//   - Low temperature; no global-knowledge fallback (enforced by the system prompt).
//   - On total backend failure: a friendly message pointing at /contact — never a
//     stack trace, never an invented answer.
//
// SSE event protocol (all `data: <json>`):
//   { "type": "meta",  "provider": "haiku" }   once, first
//   { "type": "delta", "text": "..." }          repeated
//   { "type": "error", "message": "..." }       degraded path (friendly copy)
//   { "type": "done" }                          terminal
//
// See plans/personal-assistant/02-ask-route.md.

import { z } from 'zod';
import { getSiteData } from '@/lib/site-content';
import { assistantSchema } from '@/lib/site-schemas';
import { KNOWLEDGE_PACK } from '@/lib/assistant/knowledge-pack.generated';
import {
  getAnswerStream,
  AssistantUnavailableError,
  type ChatMessage,
} from '@/lib/assistant/providers';
import { logAsk } from '@/lib/assistant/log';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TEMPERATURE = 0.2;
const MAX_TOKENS = 800;
const MAX_QUESTION_CHARS = 2000;

// In-memory sliding-window rate limit. Single instance → a module-level map is
// fine; it resets on redeploy, which is acceptable for this surface.
const RATE_LIMIT = 12; // requests
const RATE_WINDOW_MS = 60_000; // per minute
const hits = new Map<string, number[]>();

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.string(),
        content: z.string(),
      }),
    )
    .min(1),
});

function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get('cf-connecting-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function sse(obj: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(obj)}\n\n`);
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: true, message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: Request): Promise<Response> {
  const assistant = await getSiteData('assistant', assistantSchema);

  // Rate limit first — cheap, and protects the model.
  if (rateLimited(clientIp(req))) {
    return jsonError(
      "You're asking faster than I can think — give it a moment, or book a quick call from the contact page.",
      429,
    );
  }

  // Parse + validate.
  let parsed;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch {
    return jsonError('Malformed request.', 400);
  }

  // Drop any client-supplied system/other roles; keep only user/assistant turns.
  const history: ChatMessage[] = parsed.messages
    .filter((m): m is ChatMessage => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_QUESTION_CHARS) }));

  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return jsonError('Ask a question to get started.', 400);
  }

  // Truncate to the configured turn cap (a turn ≈ a user/assistant exchange),
  // always keeping the newest messages and the trailing question.
  const capped = history.slice(-assistant.turnCap * 2);
  const question = capped[capped.length - 1].content;

  const system = `${assistant.systemPrompt}\n\n# CONTEXT\n\n${KNOWLEDGE_PACK}`;

  // Secure the first token (and the answering provider) BEFORE we open the
  // streaming response, so a total backend failure becomes a clean friendly
  // message instead of a half-open stream.
  let provider: 'local' | 'haiku';
  let stream: AsyncIterable<string>;
  try {
    const result = await getAnswerStream({
      system,
      messages: capped,
      temperature: TEMPERATURE,
      maxTokens: MAX_TOKENS,
      signal: req.signal,
    });
    provider = result.provider;
    stream = result.stream;
  } catch (err) {
    if (err instanceof AssistantUnavailableError) {
      void logAsk({ question, provider: 'none' });
      // 200 + SSE so the client renders the friendly copy inline like any answer.
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(
            sse({
              type: 'error',
              message:
                "I can't reach my brain right now. Try again in a moment — or book a quick call from the contact page and Ben can answer directly.",
            }),
          );
          controller.enqueue(sse({ type: 'done' }));
          controller.close();
        },
      });
      return sseResponse(body);
    }
    throw err; // unexpected — let the platform 500 it (still no body leak to client)
  }

  void logAsk({ question, provider });

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(sse({ type: 'meta', provider }));
      try {
        for await (const delta of stream) {
          controller.enqueue(sse({ type: 'delta', text: delta }));
        }
      } catch {
        // Mid-stream failure (after we'd already committed): degrade gracefully.
        controller.enqueue(
          sse({
            type: 'error',
            message:
              ' …sorry, that got cut off. Try again, or reach Ben via the contact page.',
          }),
        );
      } finally {
        controller.enqueue(sse({ type: 'done' }));
        controller.close();
      }
    },
  });

  return sseResponse(body);
}

function sseResponse(body: ReadableStream<Uint8Array>): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
