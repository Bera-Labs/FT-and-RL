'use client';

import { useState, useEffect } from 'react';

// Training trajectory: [rA, rB, loss]
const STEPS = [
  { rA: 1.5, rB: 1.7, loss: 0.60 },
  { rA: 1.5, rB: 2.2, loss: 0.40 },
  { rA: 1.4, rB: 2.9, loss: 0.20 },
  { rA: 1.2, rB: 3.5, loss: 0.095 },
  { rA: 1.0, rB: 4.0, loss: 0.048 },
  { rA: 0.8, rB: 4.4, loss: 0.027 },
];
const MAX_SCORE = 5.0;

function ScoreBar({ value, color, label }: { value: number; color: string; label: string }) {
  const pct = (value / MAX_SCORE) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="font-medium" style={{ color }}>{label}</span>
        <span className="font-semibold text-foreground">{value.toFixed(1)}</span>
      </div>
      <div className="h-5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function RewardModelViz() {
  const [step, setStep] = useState(0);
  const [training, setTraining] = useState(false);

  const { rA, rB, loss } = STEPS[step];
  const margin = rB - rA;
  const done = step >= STEPS.length - 1;

  useEffect(() => {
    if (!training || done) {
      if (done) setTraining(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [training, step, done]);

  function reset() {
    setStep(0);
    setTraining(false);
  }

  return (
    <div className="my-6 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="px-5 pt-4 pb-3 border-b border-border">
        <p className="font-semibold text-sm">Reward model training — watching scores separate</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Click Train to watch the reward model learn: r(B) rises, r(A) falls, loss drops toward zero.
        </p>
      </div>

      {/* response cards */}
      <div className="grid grid-cols-2 gap-4 px-5 pt-4 pb-3">
        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Response A <span className="text-red-400">(less preferred)</span></p>
          <p className="text-xs text-foreground leading-relaxed italic">
            &ldquo;Black holes are objects in space where nothing can escape, not even light.&rdquo;
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Response B <span className="text-emerald-500">(preferred)</span></p>
          <p className="text-xs text-foreground leading-relaxed italic">
            &ldquo;A black hole forms when massive stars collapse — gravity so extreme that even light can&apos;t escape its pull.&rdquo;
          </p>
        </div>
      </div>

      {/* score bars */}
      <div className="px-5 pb-3 flex flex-col gap-3">
        <ScoreBar value={rA} color="#ef4444" label="r(A) — reward score" />
        <ScoreBar value={rB} color="#22c55e" label="r(B) — reward score" />
      </div>

      {/* stats row */}
      <div className="px-5 pb-3 flex gap-6">
        <div>
          <span className="text-xs text-muted-foreground">Margin r(B)−r(A): </span>
          <span className="text-xs font-semibold" style={{ color: margin > 1 ? '#22c55e' : '#94a3b8' }}>
            +{margin.toFixed(1)}
          </span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Loss −log σ(margin): </span>
          <span className="text-xs font-semibold" style={{ color: loss < 0.15 ? '#22c55e' : '#f59e0b' }}>
            {loss.toFixed(3)}
          </span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Step: </span>
          <span className="text-xs font-semibold text-foreground">{step}/{STEPS.length - 1}</span>
        </div>
      </div>

      {/* controls */}
      <div className="px-5 pb-4 flex gap-3 border-t border-border pt-3">
        <button
          onClick={reset}
          className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-accent transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => setTraining(true)}
          disabled={training || done}
          className="px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg disabled:opacity-30 hover:opacity-90 transition-opacity"
        >
          {training ? 'Training…' : done ? 'Converged ✓' : 'Train ▶'}
        </button>
        {done && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 self-center">
            Reward model converged — B is reliably preferred over A.
          </p>
        )}
      </div>
    </div>
  );
}
