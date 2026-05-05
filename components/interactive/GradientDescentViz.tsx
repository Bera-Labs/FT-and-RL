'use client';

import { useState, useEffect, useMemo } from 'react';

const VW = 460, VH = 196;
const X_RANGE = 3.3; // visible ±x
const Y_MAX = 11.2;  // visible y ceiling

function toSVGx(x: number) {
  return 32 + ((x + X_RANGE) / (2 * X_RANGE)) * (VW - 64);
}
function toSVGy(y: number) {
  return VH - 16 - (Math.min(y, Y_MAX) / Y_MAX) * (VH - 36);
}

const CURVE_PATH = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 160; i++) {
    const x = -X_RANGE + (i / 160) * 2 * X_RANGE;
    pts.push(`${toSVGx(x).toFixed(1)},${toSVGy(x * x).toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
})();

const MODES = [
  {
    id: 'high',
    label: 'lr = 1.1  —  too high',
    lr: 1.1,
    color: '#ef4444',
    desc: 'Steps overshoot the minimum and grow. Training diverges.',
  },
  {
    id: 'good',
    label: 'lr = 0.3  —  just right',
    lr: 0.3,
    color: '#22c55e',
    desc: 'Smooth descent — each step meaningfully reduces loss.',
  },
  {
    id: 'low',
    label: 'lr = 0.04  —  too low',
    lr: 0.04,
    color: '#60a5fa',
    desc: 'Converges eventually, but takes many more steps to get there.',
  },
] as const;

function computeTrajectory(lr: number, maxSteps = 70): number[] {
  const xs = [(-X_RANGE + 0.3)]; // start near left edge
  let x = xs[0];
  for (let i = 0; i < maxSteps; i++) {
    const next = x - lr * 2 * x; // gradient of x² is 2x
    xs.push(next);
    x = next;
    if (Math.abs(x) > X_RANGE + 0.6) break; // diverged off screen
    if (Math.abs(x) < 0.003) break;           // converged
  }
  return xs;
}

export default function GradientDescentViz() {
  const [modeIdx, setModeIdx] = useState(1);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const mode = MODES[modeIdx];
  const trajectory = useMemo(() => computeTrajectory(mode.lr), [mode.lr]);
  const curX = trajectory[Math.min(step, trajectory.length - 1)];
  const curY = curX * curX;
  const done = step >= trajectory.length - 1;
  const diverged = Math.abs(curX) > X_RANGE + 0.3;

  function selectMode(i: number) {
    setModeIdx(i);
    setStep(0);
    setRunning(false);
  }

  function reset() {
    setStep(0);
    setRunning(false);
  }

  useEffect(() => {
    if (!running || done) {
      if (done) setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 105);
    return () => clearTimeout(t);
  }, [running, step, done]);

  const ballOnScreen = Math.abs(curX) <= X_RANGE + 0.1 && curY <= Y_MAX;
  const sx = toSVGx(curX);
  const sy = toSVGy(curY);

  return (
    <div className="my-6 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* header */}
      <div className="px-5 pt-4 pb-3 border-b border-border">
        <p className="font-semibold text-sm text-foreground">Gradient descent on y = x²</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          The ball rolls toward the minimum at x = 0. Learning rate controls step size.
        </p>
      </div>

      {/* mode buttons */}
      <div className="flex flex-wrap gap-2 px-5 pt-3 pb-1">
        {MODES.map((m, i) => (
          <button
            key={m.id}
            onClick={() => selectMode(i)}
            style={i === modeIdx ? { background: m.color, borderColor: m.color } : {}}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              i === modeIdx
                ? 'text-white'
                : 'border-border text-muted-foreground bg-transparent hover:border-primary/40'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* SVG canvas */}
      <div className="px-4 pt-1 pb-0">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full">
          {/* baseline */}
          <line
            x1={32} y1={VH - 16} x2={VW - 32} y2={VH - 16}
            stroke="currentColor" strokeOpacity={0.15}
          />
          {/* vertical axis at x=0 */}
          <line
            x1={toSVGx(0)} y1={20} x2={toSVGx(0)} y2={VH - 16}
            stroke="currentColor" strokeOpacity={0.1} strokeDasharray="3 5"
          />
          <text
            x={toSVGx(0)} y={VH - 2}
            textAnchor="middle" fontSize={9.5} fill="currentColor" fillOpacity={0.3}
          >
            minimum (x=0)
          </text>

          {/* trail: ghost positions */}
          {trajectory.slice(0, step).map((tx, i) => {
            const ty = tx * tx;
            if (Math.abs(tx) > X_RANGE + 0.1 || ty > Y_MAX) return null;
            return (
              <circle
                key={i}
                cx={toSVGx(tx)}
                cy={toSVGy(ty)}
                r={4}
                fill={mode.color}
                fillOpacity={0.18 + (i / Math.max(step, 1)) * 0.22}
              />
            );
          })}

          {/* parabola */}
          <path d={CURVE_PATH} fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth={2.5} />

          {/* ball */}
          {ballOnScreen && (
            <circle cx={sx} cy={sy} r={8} fill={mode.color} stroke="white" strokeWidth={2.5} />
          )}

          {/* diverged indicator */}
          {diverged && (
            <text x={VW - 36} y={38} textAnchor="end" fontSize={11} fill={mode.color} fontWeight={700}>
              ↗ diverged
            </text>
          )}

          {/* step counter */}
          <text x={VW - 36} y={22} textAnchor="end" fontSize={10.5} fill={mode.color} fontWeight={600}>
            step {step}
          </text>
        </svg>
      </div>

      {/* controls */}
      <div className="px-5 pb-4 pt-1 flex items-center gap-3">
        <p className="text-xs flex-1 leading-relaxed" style={{ color: mode.color }}>
          {mode.desc}
        </p>
        <button
          onClick={reset}
          className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-accent transition-colors shrink-0"
        >
          Reset
        </button>
        <button
          onClick={() => setRunning(true)}
          disabled={running || done}
          className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg disabled:opacity-30 hover:opacity-90 transition-opacity shrink-0"
        >
          {running ? 'Running…' : done ? (diverged ? 'Diverged' : 'Converged ✓') : 'Play ▶'}
        </button>
      </div>
    </div>
  );
}
