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

// Render inline formatting: **bold** and `code`
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// Detect lines that are standalone math formulas
function isFormulaLine(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  // Update arrow — unambiguous formula indicator
  if (t.includes('←')) return true;
  // Gradient symbols
  if (/∇[_θJL]|∇_θ|∇ log/.test(t)) return true;
  // Sum/expectation in formula context
  if (/E_t\s*\[|^E\[|Σ\s*[A-Za-z_(]|∑/.test(t)) return true;
  // Equation pattern: starts with math identifier + = + operators
  // e.g. "V(s) = max_a [...]", "L_CLIP(θ) = E_t[...]"
  if (
    /^[A-Za-z_θφψαβγδλμπωΘΦΨΠ][A-Za-zθφψαβγδλμπωΘΦΨΠ_0-9^()\s,{}[\]]*\s*=\s*/.test(t) &&
    /[×+\-*/]|max_|min_|argmax|clip\(/.test(t)
  ) return true;
  return false;
}

// Full body renderer: handles bullets, numbered lists, code fences, formulas, prose
function renderBody(body: string): React.ReactNode {
  const lines = body.split('\n');
  const result: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip blank lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Fenced code / pseudocode block
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      result.push(
        <pre
          key={`code-${i}`}
          className="my-3 px-3 py-2.5 bg-muted rounded-lg text-xs font-mono overflow-x-auto border border-border leading-relaxed whitespace-pre"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Bullet list — group consecutive bullet lines
    if (/^[•\-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[•\-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[•\-*]\s*/, ''));
        i++;
      }
      result.push(
        <ul key={`ul-${i}`} className="my-2 space-y-1.5">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2 text-sm text-foreground/80 leading-relaxed">
              <span className="flex-shrink-0 text-primary font-bold mt-0.5">•</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list — group consecutive numbered lines
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s*/, ''));
        i++;
      }
      result.push(
        <ol key={`ol-${i}`} className="my-2 space-y-1.5">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2 text-sm text-foreground/80 leading-relaxed">
              <span className="flex-shrink-0 font-semibold text-primary">{j + 1}.</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Auto-detected formula line
    if (isFormulaLine(line)) {
      result.push(
        <div
          key={`formula-${i}`}
          className="my-2 px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200 leading-relaxed"
        >
          {line}
        </div>
      );
      i++;
      continue;
    }

    // Regular prose line
    result.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-foreground/80 my-1">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <>{result}</>;
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
              <div className="space-y-0">{renderBody(step.body)}</div>
              {step.whyItMatters && (
                <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-3 py-2">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-0.5">Why it matters</p>
                  <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                    {renderInline(step.whyItMatters)}
                  </p>
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
