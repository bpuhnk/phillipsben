'use client';

// The loud "Talk to virtual me" band under the home hero — the in-the-critical-
// path entry to the assistant. Submitting the input or clicking a chip opens the
// dialog with that question already streaming (no blank-box friction).

import { useRef, useState } from 'react';
import AskDialog from '@/components/assistant/ask-dialog';
import type { Assistant } from '@/lib/site-schemas';

export default function AskBand({ config }: { config: Assistant }) {
  const [open, setOpen] = useState(false);
  const [submission, setSubmission] = useState<{ q: string; nonce: number } | null>(null);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    setSubmission((s) => ({ q, nonce: (s?.nonce ?? 0) + 1 }));
    setOpen(true);
    setValue('');
  };

  return (
    <section className="section tight">
      <div className="ask-band">
        <div className="ask-band-copy">
          <span
            className="kicker accent"
            dangerouslySetInnerHTML={{ __html: config.band.kicker }}
          />
          <h2 className="ask-band-headline">{config.band.headline}</h2>
        </div>

        <form
          className="ask-band-form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(value);
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="ask-band-input"
            placeholder={config.band.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Ask a question about Ben"
          />
          <button type="submit" className="ask-band-send">
            Ask
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M2 8h11M9 4l4 4-4 4" />
            </svg>
          </button>
        </form>

        <div className="ask-band-chips">
          {config.band.suggestedQuestions.map((q) => (
            <button key={q} type="button" className="chip" onClick={() => ask(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>

      <AskDialog
        open={open}
        onClose={() => setOpen(false)}
        config={config}
        submission={submission}
        triggerRef={inputRef}
      />
    </section>
  );
}
