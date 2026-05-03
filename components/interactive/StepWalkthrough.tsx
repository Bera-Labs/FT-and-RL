'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MermaidDiagram from './MermaidDiagram';

export interface Step {
  title: string;
  body: string;
  whyItMatters?: string;
  diagram?: string;
}

interface Props {
  steps: Step[];
}

export default function StepWalkthrough({ steps }: Props) {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const total = steps.length;

  return (
    <div className="my-8 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* progress dots */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-border">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to step ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-200 ${
              i === current
                ? 'w-6 bg-primary'
                : i < current
                ? 'w-2.5 bg-primary/40'
                : 'w-2.5 bg-border'
            }`}
          />
        ))}
        <span className="ml-auto text-xs text-muted-foreground font-medium">
          Step {current + 1} of {total}
        </span>
      </div>

      {/* content */}
      <div className="flex flex-col">
        {/* text + nav */}
        <div className="flex flex-col gap-4 p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.18 }}
            >
              <h3 className="font-semibold text-base mb-3 text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/80">{step.body}</p>
              {step.whyItMatters && (
                <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-3 py-2">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-0.5">Why it matters</p>
                  <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">{step.whyItMatters}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-border transition-colors disabled:opacity-30 hover:bg-accent"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <button
              onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
              disabled={current === total - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground transition-colors disabled:opacity-30 hover:opacity-90"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* diagram — full width, generous height */}
        <div className="border-t border-border bg-muted/30 flex items-center justify-center px-6 py-8 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`diagram-${current}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {step.diagram ? (
                <MermaidDiagram chart={step.diagram} className="text-base" />
              ) : (
                <p className="text-muted-foreground text-sm text-center">No diagram for this step</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
