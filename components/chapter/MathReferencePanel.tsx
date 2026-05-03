import type { MathConcept, MathArea } from '@/lib/chapters';
import { Sigma } from 'lucide-react';

const AREA_STYLES: Record<MathArea, { bg: string; text: string; dot: string }> = {
  'Calculus':           { bg: 'bg-blue-50 dark:bg-blue-950/30',   text: 'text-blue-700 dark:text-blue-300',   dot: 'bg-blue-400' },
  'Linear Algebra':     { bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-400' },
  'Probability':        { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-400' },
  'Statistics':         { bg: 'bg-teal-50 dark:bg-teal-950/30',   text: 'text-teal-700 dark:text-teal-300',   dot: 'bg-teal-400' },
  'Information Theory': { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-400' },
  'Optimization':       { bg: 'bg-rose-50 dark:bg-rose-950/30',   text: 'text-rose-700 dark:text-rose-300',   dot: 'bg-rose-400' },
  'Set Theory':         { bg: 'bg-slate-50 dark:bg-slate-800/40', text: 'text-slate-600 dark:text-slate-300',  dot: 'bg-slate-400' },
};

interface Props {
  concepts: MathConcept[];
}

export default function MathReferencePanel({ concepts }: Props) {
  if (!concepts.length) return null;

  return (
    <aside className="sticky top-20 w-56 shrink-0 self-start">
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-muted/40">
          <Sigma size={13} className="text-muted-foreground shrink-0" />
          <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
            Math to study
          </span>
        </div>
        <ul className="divide-y divide-border">
          {concepts.map((c) => {
            const style = AREA_STYLES[c.area];
            return (
              <li key={c.topic} className="px-3 py-2.5 flex flex-col gap-1">
                <div className="flex items-start gap-1.5">
                  <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${style.dot}`} />
                  <span className="text-xs font-medium text-foreground leading-snug">{c.topic}</span>
                </div>
                <span className={`ml-3 text-[11px] leading-snug rounded px-1.5 py-0.5 font-medium ${style.bg} ${style.text}`}>
                  {c.area}
                </span>
                <p className="ml-3 text-[11px] text-muted-foreground leading-relaxed">{c.why}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
