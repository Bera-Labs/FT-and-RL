'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';

type Scenario = 'reset' | 'goodRaw' | 'goodAdv' | 'bad';

const SCENARIOS: Record<Scenario, { probs: number[]; label: string; color: string }> = {
  reset: {
    probs: [0.30, 0.50, 0.20],
    label: 'Initial policy',
    color: '#6366f1',
  },
  goodRaw: {
    probs: [0.22, 0.28, 0.50],
    label: 'After "Right" got G = +8 (no baseline) — large noisy update',
    color: '#22c55e',
  },
  goodAdv: {
    probs: [0.26, 0.44, 0.30],
    label: 'After "Right" got advantage A = +3 (with baseline V = 5) — targeted update',
    color: '#6366f1',
  },
  bad: {
    probs: [0.36, 0.56, 0.08],
    label: 'After "Right" got advantage A = −4 (with baseline V = 5) — decreased',
    color: '#ef4444',
  },
};

const ACTIONS = ['Left', 'Forward', 'Right'];

export default function PolicyUpdateViz() {
  const [scenario, setScenario] = useState<Scenario>('reset');

  const { probs, label, color } = SCENARIOS[scenario];

  const data = ACTIONS.map((name, i) => ({
    name,
    prob: probs[i],
    pct: `${(probs[i] * 100).toFixed(0)}%`,
  }));

  const updatedAction = 2; // "Right" = index 2

  return (
    <div className="my-6 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="px-5 pt-4 pb-3 border-b border-border">
        <p className="font-semibold text-sm">REINFORCE policy update — how action probabilities shift</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Compare raw return G vs. advantage A = G − V. With a baseline, the update is smaller and more precise.
        </p>
      </div>

      {/* buttons */}
      <div className="flex flex-wrap gap-2 px-5 pt-3 pb-2">
        <button
          onClick={() => setScenario('reset')}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
            scenario === 'reset'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border text-muted-foreground hover:border-primary/40'
          }`}
        >
          Reset
        </button>
        <button
          onClick={() => setScenario('goodRaw')}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
            scenario === 'goodRaw'
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-border text-muted-foreground hover:border-primary/40'
          }`}
        >
          Right → G = +8 (no baseline)
        </button>
        <button
          onClick={() => setScenario('goodAdv')}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
            scenario === 'goodAdv'
              ? 'bg-indigo-500 border-indigo-500 text-white'
              : 'border-border text-muted-foreground hover:border-primary/40'
          }`}
        >
          Right → A = +3 (V = 5)
        </button>
        <button
          onClick={() => setScenario('bad')}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
            scenario === 'bad'
              ? 'bg-red-500 border-red-500 text-white'
              : 'border-border text-muted-foreground hover:border-primary/40'
          }`}
        >
          Right → A = −4 (V = 5)
        </button>
      </div>

      {/* chart */}
      <div className="px-2 pb-2">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 16, right: 20, bottom: 4, left: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} />
            <YAxis domain={[0, 0.7]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 10 }} width={38} />
            <Tooltip
              formatter={(v) => [`${(typeof v === 'number' ? (v * 100).toFixed(0) : v)}%`, 'Probability']}
              contentStyle={{ fontSize: 11 }}
            />
            <ReferenceLine y={SCENARIOS.reset.probs[updatedAction]} strokeDasharray="4 3" stroke="#94a3b8" strokeOpacity={0.5} />
            <Bar dataKey="prob" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={400}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    i === updatedAction
                      ? color
                      : scenario === 'reset'
                      ? '#6366f1'
                      : '#94a3b8'
                  }
                  fillOpacity={i === updatedAction ? 0.9 : 0.45}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* label */}
      <div className="px-5 pb-4 pt-1">
        <p className="text-xs" style={{ color }}>
          {label}
        </p>
        {(scenario === 'goodRaw' || scenario === 'goodAdv') && (
          <p className="text-xs text-muted-foreground mt-1">
            {scenario === 'goodRaw'
              ? 'Raw G = +8 causes a large probability swing: Right jumps from 20% → 50%. But this large shift may be due to luck elsewhere in the episode, not the quality of the "Right" action itself.'
              : 'Advantage A = G − V = 8 − 5 = +3 causes a smaller, more reliable update: Right rises from 20% → 30%. The baseline V = 5 subtracts "what we normally expect" — only the truly good news moves the policy.'}
          </p>
        )}
      </div>
    </div>
  );
}
