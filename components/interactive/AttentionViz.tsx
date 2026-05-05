'use client';

import { useState } from 'react';

const TOKENS = ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired'];

// Attention weights: ATTENTION[from][to], rows sum to ~1.0
const ATTENTION = [
  [0.35, 0.25, 0.12, 0.08, 0.06, 0.04, 0.03, 0.03, 0.02, 0.01, 0.01], // The
  [0.14, 0.22, 0.12, 0.15, 0.04, 0.07, 0.05, 0.11, 0.05, 0.03, 0.02], // animal
  [0.06, 0.28, 0.16, 0.30, 0.06, 0.06, 0.04, 0.02, 0.01, 0.01, 0.00], // didn't
  [0.04, 0.35, 0.12, 0.12, 0.06, 0.20, 0.04, 0.03, 0.02, 0.01, 0.01], // cross
  [0.18, 0.07, 0.05, 0.06, 0.14, 0.36, 0.06, 0.04, 0.02, 0.01, 0.01], // the
  [0.04, 0.10, 0.20, 0.35, 0.14, 0.08, 0.04, 0.02, 0.02, 0.01, 0.00], // street
  [0.06, 0.14, 0.10, 0.14, 0.06, 0.12, 0.08, 0.14, 0.08, 0.04, 0.04], // because
  [0.06, 0.58, 0.07, 0.05, 0.03, 0.05, 0.06, 0.05, 0.03, 0.03, 0.05], // it → animal (coreference)
  [0.04, 0.10, 0.05, 0.05, 0.03, 0.04, 0.08, 0.20, 0.12, 0.12, 0.17], // was
  [0.03, 0.06, 0.04, 0.04, 0.02, 0.04, 0.06, 0.14, 0.16, 0.16, 0.25], // too
  [0.04, 0.18, 0.06, 0.05, 0.03, 0.05, 0.08, 0.17, 0.12, 0.10, 0.12], // tired
];

const N = TOKENS.length;
const VW = 660;
const TOK_Y = 20; // token center y
const TOK_ROW_H = 38;
const ARC_H = 100;
const VH = TOK_ROW_H + ARC_H;

function tokX(i: number) {
  return 26 + i * (VW - 52) / (N - 1);
}

function arcPath(from: number, to: number): string {
  const x1 = tokX(from);
  const x2 = tokX(to);
  const dist = Math.abs(to - from);
  const depth = TOK_ROW_H + 8 + dist * (ARC_H - 18) / (N - 1);
  const midX = (x1 + x2) / 2;
  return `M ${x1.toFixed(1)} ${TOK_ROW_H} Q ${midX.toFixed(1)} ${depth.toFixed(1)} ${x2.toFixed(1)} ${TOK_ROW_H}`;
}

function tokWidth(tok: string) {
  return tok.length * 6.2 + 14;
}

export default function AttentionViz() {
  const [selected, setSelected] = useState(7); // default: "it"

  const weights = ATTENTION[selected];
  const maxW = Math.max(...weights.filter((_, i) => i !== selected));

  // find top non-self token
  const topIdx = weights
    .map((w, i) => ({ w, i }))
    .filter(({ i }) => i !== selected)
    .sort((a, b) => b.w - a.w)[0];

  return (
    <div className="my-6 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="px-5 pt-4 pb-3 border-b border-border">
        <p className="font-semibold text-sm">Self-attention — click any word</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Arc thickness and color show attention weight. Try <span className="font-medium text-indigo-500">&ldquo;it&rdquo;</span> to see the coreference link to &ldquo;animal&rdquo;.
        </p>
      </div>

      <div className="px-3 pt-3 pb-1 overflow-x-auto">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full min-w-[340px]">
          {/* arcs */}
          {weights.map((w, j) => {
            if (j === selected || w < 0.04) return null;
            const ratio = w / maxW;
            const opacity = 0.12 + ratio * 0.72;
            const sw = 0.8 + ratio * 5.2;
            const color = ratio > 0.55 ? '#6366f1' : ratio > 0.25 ? '#8b5cf6' : '#94a3b8';
            return (
              <path
                key={j}
                d={arcPath(selected, j)}
                fill="none"
                stroke={color}
                strokeWidth={sw}
                strokeOpacity={opacity}
              />
            );
          })}

          {/* weight labels for significant connections */}
          {weights.map((w, j) => {
            if (j === selected || w < 0.09) return null;
            const x1 = tokX(selected);
            const x2 = tokX(j);
            const dist = Math.abs(j - selected);
            const labelY = TOK_ROW_H + 8 + dist * (ARC_H - 18) / (N - 1);
            return (
              <text
                key={j}
                x={(x1 + x2) / 2}
                y={labelY - 3}
                textAnchor="middle"
                fontSize={8}
                fill="#6366f1"
                fillOpacity={0.65}
              >
                {(w * 100).toFixed(0)}%
              </text>
            );
          })}

          {/* token chips */}
          {TOKENS.map((tok, i) => {
            const cx = tokX(i);
            const isSelected = i === selected;
            const w = weights[i];
            const isBright = w >= 0.09 && !isSelected;
            const tw = tokWidth(tok);
            return (
              <g key={i} style={{ cursor: 'pointer' }} onClick={() => setSelected(i)}>
                <rect
                  x={cx - tw / 2} y={TOK_Y - 11}
                  width={tw} height={22} rx={4}
                  fill={isSelected ? '#6366f1' : isBright ? '#ede9fe' : 'transparent'}
                  stroke={isSelected ? '#4f46e5' : isBright ? '#8b5cf6' : '#94a3b8'}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeOpacity={isSelected ? 1 : isBright ? 0.8 : 0.35}
                />
                <text
                  x={cx} y={TOK_Y + 4.5}
                  textAnchor="middle" fontSize={10.5}
                  fill={isSelected ? 'white' : isBright ? '#4c1d95' : 'currentColor'}
                  fontWeight={isSelected || isBright ? 600 : 400}
                >
                  {tok}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="px-5 pb-4 pt-1">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">&ldquo;{TOKENS[selected]}&rdquo;</span> attends most strongly to{' '}
          <span className="font-semibold text-indigo-500">&ldquo;{TOKENS[topIdx.i]}&rdquo;</span>{' '}
          ({(topIdx.w * 100).toFixed(0)}% weight).
          {selected === 7 && (
            <span className="text-indigo-500"> This is coreference resolution — the model has learned &ldquo;it&rdquo; refers to the animal, not the street.</span>
          )}
        </p>
      </div>
    </div>
  );
}
