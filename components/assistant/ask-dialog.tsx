'use client';

// The "Talk to virtual me" chat overlay. Controlled by a parent (the hero band,
// Phase 04) via `open` / `onClose`. Streams answers from POST /ask/ (SSE) and
// keeps the visitor in flow without becoming a SaaS chat widget.
//
// Reuses the m-nav overlay mechanics (portal, scroll-lock, Esc, focus-trap,
// focus restore) but with a focusable set that includes form controls.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { Assistant } from '@/lib/site-schemas';

type Role = 'user' | 'assistant';
interface Msg {
  role: Role;
  content: string;
}

type Status = 'idle' | 'streaming' | 'error' | 'rate-limited';

interface AskDialogProps {
  open: boolean;
  onClose: () => void;
  config: Assistant;
  /** A new nonce auto-sends `q` (lets the band seed each question robustly). */
  submission?: { q: string; nonce: number } | null;
  /** Focus is restored here on close (the band's input/button). */
  triggerRef?: RefObject<HTMLElement | null>;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function AskDialog({
  open,
  onClose,
  config,
  submission,
  triggerRef,
}: AskDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  // Bumped when a stream finishes — re-evaluates the seed effect so a question
  // that arrived mid-stream (queued) dispatches once the current one is done.
  const [streamTick, setStreamTick] = useState(0);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const lastQuestionRef = useRef<string>('');
  const lastNonceRef = useRef(0);
  const inFlightRef = useRef(false);

  const streaming = status === 'streaming';
  const userTurns = messages.filter((m) => m.role === 'user').length;
  const capReached = userTurns >= config.turnCap;

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => onClose(), [onClose]);

  // ── streaming send ───────────────────────────────────────────
  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      // Guard on a ref, not captured `status` (which goes stale in this closure).
      if (!text || inFlightRef.current) return;
      inFlightRef.current = true;

      lastQuestionRef.current = text;
      const history: Msg[] = [...messages, { role: 'user', content: text }];
      // Append an empty assistant turn we stream into.
      setMessages([...history, { role: 'assistant', content: '' }]);
      setInput('');
      setStatus('streaming');

      // Immutable updaters — never mutate existing message objects (impure
      // updaters get double-applied under StrictMode and corrupt the stream).
      const setLastAssistant = (fn: (content: string) => string) =>
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 && m.role === 'assistant'
              ? { ...m, content: fn(m.content) }
              : m,
          ),
        );

      const fail = (msg: string, s: Status = 'error') => {
        setStatus(s);
        setLastAssistant(() => msg);
      };

      try {
        const res = await fetch('/ask/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });

        if (res.status === 429) {
          let msg = "I'm getting a lot of questions right now — give it a moment.";
          try {
            msg = (await res.json()).message ?? msg;
          } catch {}
          fail(msg, 'rate-limited');
          return;
        }
        if (!res.ok || !res.body) {
          fail(
            "I couldn't answer that just now. Try again, or reach Ben via the contact page.",
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let errored = false;

        const appendDelta = (text: string) =>
          setLastAssistant((content) => content + text);

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let sep: number;
          while ((sep = buffer.indexOf('\n\n')) !== -1) {
            const frame = buffer.slice(0, sep).trim();
            buffer = buffer.slice(sep + 2);
            if (!frame.startsWith('data:')) continue;
            let evt: { type?: string; text?: string; message?: string };
            try {
              evt = JSON.parse(frame.slice(5).trim());
            } catch {
              continue;
            }
            if (evt.type === 'delta' && evt.text) appendDelta(evt.text);
            else if (evt.type === 'error') {
              errored = true;
              appendDelta(evt.message ?? evt.text ?? '');
            }
          }
        }
        setStatus(errored ? 'error' : 'idle');
      } catch {
        fail(
          "Something interrupted that answer. Try again, or reach Ben via the contact page.",
        );
      } finally {
        inFlightRef.current = false;
        setStreamTick((t) => t + 1);
      }
    },
    [messages],
  );

  // Send each new seeded submission exactly once (keyed by nonce), so the band
  // can seed a fresh question whether the dialog was already open or not.
  useEffect(() => {
    if (
      open &&
      submission &&
      submission.nonce !== lastNonceRef.current &&
      !inFlightRef.current
    ) {
      lastNonceRef.current = submission.nonce;
      void send(submission.q);
    }
  }, [open, submission, send, streamTick]);

  // Body scroll lock (mirror m-nav).
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Focus-trap + initial focus on the input.
  useEffect(() => {
    if (!open || !overlayRef.current) return;
    const root = overlayRef.current;
    const getFocusable = () =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('inert'),
      );

    (inputRef.current ?? getFocusable()[0])?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    root.addEventListener('keydown', onKey);
    return () => root.removeEventListener('keydown', onKey);
  }, [open]);

  // Restore focus to the trigger after closing (skip initial mount).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
    } else if (wasOpen.current) {
      triggerRef?.current?.focus({ preventScroll: true });
      wasOpen.current = false;
    }
  }, [open, triggerRef]);

  // Auto-scroll to the newest content as it streams.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages]);

  if (!mounted || !open) return null;

  const onInputKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!capReached) void send(input);
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Ask about Ben Phillips"
      className="ask-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="ask-panel">
        <header className="ask-head">
          <div>
            <span className="kicker accent">
              <span className="dot" /> VIRTUAL BEN
            </span>
            <h2 className="ask-title">Ask about my work.</h2>
          </div>
          <button
            type="button"
            className="ask-close"
            aria-label="Close"
            onClick={close}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 4L16 16M16 4L4 16" />
            </svg>
          </button>
        </header>

        <div className="ask-body" ref={bodyRef} aria-live="polite">
          {messages.length === 0 ? (
            <div className="ask-empty">
              <p className="ask-empty-lede">
                I answer from what&rsquo;s published on this site — Ben&rsquo;s
                projects, experience, and how he works.
              </p>
              <div className="ask-chips">
                {config.band.suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="chip"
                    onClick={() => void send(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul className="ask-thread">
              {messages.map((m, i) => {
                const isLast = i === messages.length - 1;
                const showTyping =
                  m.role === 'assistant' && isLast && streaming && !m.content;
                return (
                  <li key={i} className={`ask-msg ${m.role}`}>
                    <span className="ask-who">
                      {m.role === 'user' ? 'You' : 'Virtual Ben'}
                    </span>
                    <div className="ask-text">
                      {showTyping ? <TypingDots /> : renderText(m.content)}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="ask-foot">
          {capReached ? (
            <p className="ask-nudge">
              Let&rsquo;s keep this focused — for anything deeper,{' '}
              <Link href="/contact#book" onClick={close}>
                book a 15-min chat →
              </Link>
            </p>
          ) : (
            <>
              {status === 'error' && (
                <button
                  type="button"
                  className="ask-retry"
                  onClick={() => void send(lastQuestionRef.current)}
                >
                  ↻ Try again
                </button>
              )}
              <div className="ask-input-row">
                <textarea
                  ref={inputRef}
                  className="ask-input"
                  rows={1}
                  placeholder={config.band.placeholder}
                  value={input}
                  disabled={streaming}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onInputKey}
                  aria-label="Your question"
                />
                <button
                  type="button"
                  className="ask-send"
                  aria-label="Send"
                  disabled={streaming || !input.trim()}
                  onClick={() => void send(input)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 8h11M9 4l4 4-4 4" />
                  </svg>
                </button>
              </div>
            </>
          )}
          <p className="meta ask-disclaimer">
            {config.disclaimer}{' '}
            <Link href="/contact#book" onClick={close}>
              Book a 15-min chat →
            </Link>
          </p>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function TypingDots() {
  return (
    <span className="ask-typing" aria-label="Thinking">
      <span /><span /><span />
    </span>
  );
}

// Minimal, safe inline renderer: turns `[label](href)` into links for internal
// or phillipsben.com paths only (so the bot can cite project pages), preserves
// newlines, and renders everything else as plain text. No HTML is interpreted.
function renderText(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = linkRe.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, href] = m;
    const internal =
      href.startsWith('/') || href.startsWith('https://phillipsben.com');
    const path = href.replace('https://phillipsben.com', '') || '/';
    parts.push(
      internal ? (
        <Link key={`l${key++}`} href={path}>
          {label}
        </Link>
      ) : (
        `${label} (${href})`
      ),
    );
    last = linkRe.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
