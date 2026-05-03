'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { markComplete } from '@/lib/progress';

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface Props {
  chapterId: number;
  questions: QuizQuestion[];
}

export default function Quiz({ chapterId, questions }: Props) {
  const [selected, setSelected] = useState<(number | null)[]>(questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = selected.every((s) => s !== null);
  const score = submitted
    ? selected.filter((s, i) => s === questions[i].correct).length
    : 0;
  const passed = score === questions.length;

  function handleSubmit() {
    setSubmitted(true);
    if (passed) markComplete(chapterId);
  }

  function handleReset() {
    setSelected(questions.map(() => null));
    setSubmitted(false);
  }

  return (
    <div className="my-8 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/40">
        <h3 className="font-semibold text-sm">Chapter Quiz</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Answer all questions to mark this chapter complete.</p>
      </div>

      <div className="divide-y divide-border">
        {questions.map((q, qi) => (
          <div key={qi} className="px-5 py-5">
            <p className="text-sm font-medium mb-3">
              {qi + 1}. {q.q}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = selected[qi] === oi;
                const isCorrect = oi === q.correct;
                let optClass =
                  'flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors';

                if (!submitted) {
                  optClass += isSelected
                    ? ' border-primary bg-primary/5'
                    : ' border-border hover:border-primary/50 hover:bg-accent';
                } else {
                  if (isCorrect) optClass += ' border-green-400 bg-green-50 dark:bg-green-950/30';
                  else if (isSelected && !isCorrect) optClass += ' border-red-400 bg-red-50 dark:bg-red-950/30';
                  else optClass += ' border-border opacity-60';
                }

                return (
                  <button
                    key={oi}
                    onClick={() => {
                      if (submitted) return;
                      setSelected((s) => s.map((v, i) => (i === qi ? oi : v)));
                    }}
                    className={optClass + ' w-full text-left'}
                  >
                    {submitted && isCorrect && <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />}
                    {submitted && isSelected && !isCorrect && <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />}
                    {(!submitted || (!isCorrect && !isSelected)) && (
                      <span
                        className={`mt-0.5 shrink-0 h-4 w-4 rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}`}
                      />
                    )}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <p className="mt-3 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 leading-relaxed">
                {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-4">
        {submitted ? (
          <>
            <div className={`flex items-center gap-2 text-sm font-medium ${passed ? 'text-green-600' : 'text-red-500'}`}>
              {passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {score} / {questions.length} correct — {passed ? 'Chapter complete! 🎉' : 'Try again'}
            </div>
            {!passed && (
              <button
                onClick={handleReset}
                className="text-sm px-4 py-1.5 rounded-lg border border-border hover:bg-accent"
              >
                Retry
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="ml-auto px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
}
