'use client';

import { useState } from 'react';

const VW = 480, VH = 200;
const R_MAX = 2.5;
const EPS = 0.2;

function toSVGx(r: number) {
  return 48 + (r / R_MAX) * (VW - 68);
}

function clipR(r: number) {
  return Math.max(1 - EPS, Math.min(r, 1 + EPS));
}

function ppo(r: number, A: number) {
  return Math.min(r * A, clipR(r) * A);
}

export default function PPOClipViz() {
  const [pos, setPos] = useState(true);
  const [r, setR] = useState(1.5);

  const A = pos ? 1 : -1;
  const yLo = pos ? -0.2 : -2.7;
  const yHi = pos ? 2.7 : 0.2;

  function sy(y: number) {
    return 18 + ((yHi - y) / (yHi - yLo)) * (VH - 36);
  }

  const zeroSY = sy(0);

  const pts0: string[] = [];
  const pts1: string[] = [];
  for (let i = 0; i <= 300; i++) {
    const ri = (i / 300) * R_MAX;
    pts0.push(`${toSVGx(ri).toFixed(1)},${sy(ri * A).toFixed(1)}`);
    pts1.push(`${toSVGx(ri).toFixed(1)},${sy(ppo(ri, A)).toFixed(1)}`);
  }

  const curPPO = ppo(r, A);
  const curRaw = r * A;
  // Clip is active when the ppo curve is flat (gradient = 0)
  const isClipped = Math.abs(curPPO - curRaw) > 0.005;

  // Amber clip zone: for A>0, r>1.2 is clipped; for A<0, r<0.8 is clipped
  const czX1 = pos ? toSVGx(1 + EPS) : toSVGx(0);
  const czX2 = pos ? toSVGx(R_MAX) : toSVGx(1 - EPS);

  return (
    <div className="my-6 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="px-5 pt-4 pb-3 border-b border-border">
        <p className="font-semibold text-sm">PPO clipped objective — interactive</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Drag the slider. In the <span className="text-amber-500 font-medium">amber zone</span> the PPO curve is flat — gradient = 0, no update.
        </p>
      </div>

      <div className="flex gap-2 px-5 pt-3">
        {([true, false] as const).map((p) => (
          <button
            key={String(p)}
            onClick={() => { setPos(p); setR(p ? 1.5 : 0.4); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              pos === p
                ? p
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-red-500 border-red-500 text-white'
                : 'border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            {p ? 'A = +1 (good action)' : 'A = −1 (bad action)'}
          </button>
        ))}
      </div>

      <div className="px-3 pt-2">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full">
          {/* clip zone */}
          <rect x={czX1} y={18} width={czX2 - czX1} height={VH - 36} fill="#f59e0b" fillOpacity={0.1} />

          {/* zero axis */}
          <line x1={48} y1={zeroSY} x2={VW - 20} y2={zeroSY} stroke="currentColor" strokeOpacity={0.18} />

          {/* clip boundary dashes */}
          {[1 - EPS, 1 + EPS].map((bound) => (
            <g key={bound}>
              <line
                x1={toSVGx(bound)} y1={18} x2={toSVGx(bound)} y2={VH - 18}
                stroke="#f59e0b" strokeOpacity={0.65} strokeDasharray="4 3" strokeWidth={1.5}
              />
              <text x={toSVGx(bound)} y={14} textAnchor="middle" fontSize={9} fill="#f59e0b">
                {bound.toFixed(1)}
              </text>
            </g>
          ))}

          {/* r=1 reference */}
          <line x1={toSVGx(1)} y1={18} x2={toSVGx(1)} y2={VH - 18}
            stroke="currentColor" strokeOpacity={0.1} strokeDasharray="2 7" />
          <text x={toSVGx(1)} y={VH - 4} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.3}>
            r=1
          </text>

          {/* unclipped dashed */}
          <path d={`M ${pts0.join(' L ')}`} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="6 4" />

          {/* PPO solid */}
          <path d={`M ${pts1.join(' L ')}`} fill="none" stroke="#6366f1" strokeWidth={2.5} />

          {/* current r line + dots */}
          <line x1={toSVGx(r)} y1={18} x2={toSVGx(r)} y2={VH - 18}
            stroke="#6366f1" strokeOpacity={0.2} strokeWidth={1} />
          <circle cx={toSVGx(r)} cy={sy(curRaw)} r={4.5} fill="#94a3b8" />
          <circle cx={toSVGx(r)} cy={sy(curPPO)} r={6} fill="#6366f1" stroke="white" strokeWidth={2} />

          {/* legend */}
          <line x1={VW - 116} y1={28} x2={VW - 96} y2={28} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="6 4" />
          <text x={VW - 92} y={32} fontSize={9} fill="#94a3b8">unconstrained</text>
          <line x1={VW - 116} y1={42} x2={VW - 96} y2={42} stroke="#6366f1" strokeWidth={2.5} />
          <text x={VW - 92} y={46} fontSize={9} fill="#6366f1">PPO (clipped)</text>

          {/* clip zone label */}
          <text x={(czX1 + czX2) / 2} y={VH - 5} textAnchor="middle" fontSize={9} fill="#f59e0b" fillOpacity={0.85}>
            clip zone — gradient = 0
          </text>
        </svg>
      </div>

      <div className="px-5 pb-4 pt-0">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-xs text-muted-foreground w-16 shrink-0">r = {r.toFixed(2)}</span>
          <input
            type="range" min={0.05} max={2.45} step={0.01} value={r}
            onChange={(e) => setR(parseFloat(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
        </div>
        <p className="text-xs" style={{ color: isClipped ? '#f59e0b' : '#6366f1' }}>
          {isClipped
            ? `Clip active — gradient is zero here. The policy is prevented from updating further (PPO = ${curPPO.toFixed(2)}, unconstrained would push to ${curRaw.toFixed(2)}).`
            : `r=${r.toFixed(2)} is within [0.8, 1.2] — no clipping. Both objectives give ${curPPO.toFixed(2)}.`}
        </p>
      </div>
    </div>
  );
}
