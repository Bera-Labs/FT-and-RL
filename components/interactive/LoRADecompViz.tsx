'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const RANKS = [1, 2, 4, 8] as const;
type Rank = (typeof RANKS)[number];

const D_FULL = 4096;
const CELL = 11; // px per cell
const GAP = 2;   // px gap between cells
const ROWS = 8;  // visual rows represent the full d dimension

function matSize(rows: number, cols: number) {
  return {
    w: cols * CELL + (cols - 1) * GAP,
    h: rows * CELL + (rows - 1) * GAP,
  };
}

function paramCount(r: number) {
  return D_FULL * r * 2; // A: d×r, B: r×d
}

function formatParams(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  return `${(n / 1_000).toFixed(0)}k`;
}

export default function LoRADecompViz() {
  const [rank, setRank] = useState<Rank>(4);

  const aSize = matSize(ROWS, rank);      // A: 8 rows × r cols
  const bSize = matSize(rank, ROWS);      // B: r rows × 8 cols
  const wSize = matSize(ROWS, ROWS);      // W: 8×8

  const params = paramCount(rank);
  const fullParams = D_FULL * D_FULL;
  const pct = ((params / fullParams) * 100).toFixed(2);

  return (
    <div className="my-6 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="px-5 pt-4 pb-3 border-b border-border">
        <p className="font-semibold text-sm">LoRA decomposition — W stays frozen, A and B are trained</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Change the rank r to see how few parameters are needed. Each cell represents many real weights.
        </p>
      </div>

      {/* rank buttons */}
      <div className="flex gap-2 px-5 pt-3 pb-1">
        <span className="text-xs text-muted-foreground self-center mr-1">rank r =</span>
        {RANKS.map((rk) => (
          <button
            key={rk}
            onClick={() => setRank(rk)}
            className={`w-10 py-1 rounded-lg text-xs font-semibold border transition-all ${
              rank === rk
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            {rk}
          </button>
        ))}
      </div>

      {/* matrix diagram */}
      <div className="px-5 pt-4 pb-3 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max">

          {/* W (frozen) */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="grid rounded-sm overflow-hidden"
              style={{
                gridTemplateColumns: `repeat(${ROWS}, ${CELL}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
                gap: GAP,
                width: wSize.w,
                height: wSize.h,
              }}
            >
              {Array.from({ length: ROWS * ROWS }, (_, i) => (
                <div key={i} className="bg-slate-300 dark:bg-slate-600 rounded-[1px]" />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">W (frozen 🔒)</span>
            <span className="text-[9px] text-muted-foreground">{D_FULL}×{D_FULL}</span>
          </div>

          <span className="text-base text-muted-foreground font-semibold pb-5">+</span>

          {/* A matrix (d × r) */}
          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              className="grid rounded-sm overflow-hidden"
              animate={{ width: aSize.w, height: aSize.h }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{
                gridTemplateColumns: `repeat(${rank}, ${CELL}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
                gap: GAP,
              }}
            >
              {Array.from({ length: ROWS * rank }, (_, i) => (
                <div key={i} className="bg-emerald-400 dark:bg-emerald-500 rounded-[1px]" />
              ))}
            </motion.div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">A ✏️</span>
            <span className="text-[9px] text-muted-foreground">{D_FULL}×{rank}</span>
          </div>

          <span className="text-sm text-muted-foreground pb-5">×</span>

          {/* B matrix (r × d) */}
          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              className="grid rounded-sm overflow-hidden"
              animate={{ width: bSize.w, height: bSize.h }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{
                gridTemplateColumns: `repeat(${ROWS}, ${CELL}px)`,
                gridTemplateRows: `repeat(${rank}, ${CELL}px)`,
                gap: GAP,
              }}
            >
              {Array.from({ length: rank * ROWS }, (_, i) => (
                <div key={i} className="bg-violet-400 dark:bg-violet-500 rounded-[1px]" />
              ))}
            </motion.div>
            <span className="text-[10px] text-violet-600 dark:text-violet-400 font-medium">B ✏️</span>
            <span className="text-[9px] text-muted-foreground">{rank}×{D_FULL}</span>
          </div>

          <span className="text-base text-muted-foreground pb-5">=</span>

          {/* ΔW result */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="grid rounded-sm overflow-hidden border-2 border-dashed border-indigo-400"
              style={{
                gridTemplateColumns: `repeat(${ROWS}, ${CELL}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
                gap: GAP,
                width: wSize.w,
                height: wSize.h,
              }}
            >
              {Array.from({ length: ROWS * ROWS }, (_, i) => (
                <div key={i} className="bg-indigo-200 dark:bg-indigo-900 rounded-[1px]" />
              ))}
            </div>
            <span className="text-[10px] text-indigo-500 font-medium">ΔW = B×A</span>
            <span className="text-[9px] text-muted-foreground">{D_FULL}×{D_FULL}</span>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="px-5 pb-4 pt-1 border-t border-border flex flex-wrap gap-x-6 gap-y-1">
        <div>
          <span className="text-xs text-muted-foreground">Trainable params: </span>
          <motion.span
            key={params}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            {formatParams(params)}
          </motion.span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">vs full W: </span>
          <span className="text-xs font-semibold text-foreground">{formatParams(fullParams)}</span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Parameter saving: </span>
          <motion.span
            key={pct}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold text-indigo-500"
          >
            {(100 - parseFloat(pct)).toFixed(1)}% fewer
          </motion.span>
        </div>
      </div>
    </div>
  );
}
