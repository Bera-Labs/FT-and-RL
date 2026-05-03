'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// Named presets — add new ones here as chapters need them
export type SliderPreset =
  | 'learning-rate'
  | 'batch-size'
  | 'epochs'
  | 'dropout'
  | 'lora-rank';

interface PresetConfig {
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  yLabel: string;
  xLabel: string;
  insight: (v: number) => string;
  generateData: (v: number) => { x: number; y: number }[];
}

const PRESETS: Record<SliderPreset, PresetConfig> = {
  'learning-rate': {
    label: 'Learning Rate',
    description: 'Drag to see how the learning rate affects loss convergence over 50 training steps.',
    min: 0.001, max: 0.5, step: 0.001, defaultValue: 0.05,
    yLabel: 'Loss', xLabel: 'Step',
    insight: (v) => {
      if (v < 0.01) return `lr = ${v.toFixed(3)} — Very slow. Takes many steps to converge.`;
      if (v < 0.08) return `lr = ${v.toFixed(3)} — Good range. Smooth, stable convergence.`;
      if (v < 0.2) return `lr = ${v.toFixed(3)} — Aggressive. Faster but noisier.`;
      return `lr = ${v.toFixed(3)} — Too large! Loss bounces or diverges.`;
    },
    generateData: (lr) => {
      const pts: { x: number; y: number }[] = [];
      let loss = 1.0;
      for (let i = 0; i <= 50; i++) {
        pts.push({ x: i, y: parseFloat(Math.max(0, loss).toFixed(4)) });
        if (lr > 0.3) {
          loss = loss * (1 + (Math.random() - 0.4) * lr * 3);
          loss = Math.max(0.05, Math.min(loss, 2.5));
        } else {
          const noise = (Math.random() - 0.5) * 0.03;
          loss = loss * (1 - lr * 0.8) + noise;
          loss = Math.max(0.04, loss);
        }
      }
      return pts;
    },
  },
  'batch-size': {
    label: 'Batch Size',
    description: 'Larger batches are more stable but less data-efficient per update.',
    min: 4, max: 256, step: 4, defaultValue: 32,
    yLabel: 'Loss variance', xLabel: 'Update',
    insight: (v) => {
      if (v <= 8) return `Batch=${v} — Very small. Noisy gradients, can escape local minima but slow.`;
      if (v <= 64) return `Batch=${v} — Good range for most tasks.`;
      return `Batch=${v} — Large batch. Stable updates, but may converge to sharp minima.`;
    },
    generateData: (bs) => {
      const pts: { x: number; y: number }[] = [];
      let loss = 1.0;
      const noise = 0.5 / Math.sqrt(bs);
      for (let i = 0; i <= 40; i++) {
        pts.push({ x: i, y: parseFloat(Math.max(0, loss).toFixed(4)) });
        loss = loss * 0.93 + (Math.random() - 0.5) * noise;
        loss = Math.max(0.05, loss);
      }
      return pts;
    },
  },
  'epochs': {
    label: 'Training Epochs',
    description: 'More epochs = more training. But too many and the model starts memorizing.',
    min: 1, max: 30, step: 1, defaultValue: 5,
    yLabel: 'Loss', xLabel: 'Epoch',
    insight: (v) => {
      if (v <= 3) return `${v} epoch(s) — Likely undertrained. Model hasn't seen enough data.`;
      if (v <= 10) return `${v} epochs — Good for most fine-tuning tasks.`;
      if (v <= 20) return `${v} epochs — May start overfitting on small datasets.`;
      return `${v} epochs — Risk of overfitting. Watch validation loss closely.`;
    },
    generateData: (epochs) => {
      const pts: { x: number; y: number }[] = [];
      for (let i = 1; i <= 30; i++) {
        const trainLoss = 0.9 * Math.exp(-0.2 * i) + 0.08;
        const overfitKick = i > epochs ? (i - epochs) * 0.015 : 0;
        pts.push({ x: i, y: parseFloat(Math.max(0.05, trainLoss + overfitKick).toFixed(4)) });
      }
      return pts;
    },
  },
  'dropout': {
    label: 'Dropout Rate',
    description: 'Dropout randomly zeroes neurons during training to prevent overfitting.',
    min: 0, max: 0.8, step: 0.01, defaultValue: 0.1,
    yLabel: 'Val. loss', xLabel: 'Epoch',
    insight: (v) => {
      if (v === 0) return `Dropout=0 — No regularization. High risk of overfitting.`;
      if (v <= 0.2) return `Dropout=${v.toFixed(2)} — Light regularization. Good starting point.`;
      if (v <= 0.5) return `Dropout=${v.toFixed(2)} — Strong regularization.`;
      return `Dropout=${v.toFixed(2)} — Very high. Model may underfit.`;
    },
    generateData: (dropout) => {
      const pts: { x: number; y: number }[] = [];
      for (let i = 1; i <= 30; i++) {
        const base = 0.85 * Math.exp(-0.15 * i) + 0.1;
        const overfit = dropout < 0.1 ? Math.max(0, (i - 10) * 0.02) : 0;
        const underfit = dropout > 0.5 ? (dropout - 0.4) * 0.3 : 0;
        pts.push({ x: i, y: parseFloat(Math.max(0.05, base + overfit + underfit).toFixed(4)) });
      }
      return pts;
    },
  },
  'lora-rank': {
    label: 'LoRA Rank (r)',
    description: 'Higher rank = more trainable parameters in LoRA. More expressive but slower.',
    min: 1, max: 64, step: 1, defaultValue: 8,
    yLabel: 'Task loss', xLabel: 'Step',
    insight: (v) => {
      if (v <= 4) return `r=${v} — Very few parameters. Fast but limited capacity.`;
      if (v <= 16) return `r=${v} — Standard range. Good for most fine-tuning tasks.`;
      if (v <= 32) return `r=${v} — High capacity. Approaching full fine-tune territory.`;
      return `r=${v} — Near full fine-tune. May not need LoRA at this rank.`;
    },
    generateData: (rank) => {
      const pts: { x: number; y: number }[] = [];
      let loss = 1.0;
      const speed = 0.05 + (rank / 64) * 0.15;
      for (let i = 0; i <= 50; i++) {
        pts.push({ x: i, y: parseFloat(Math.max(0, loss).toFixed(4)) });
        const noise = (Math.random() - 0.5) * 0.02;
        loss = loss * (1 - speed) + noise;
        loss = Math.max(0.05 - (rank / 64) * 0.03, loss);
      }
      return pts;
    },
  },
};

interface Props {
  preset: SliderPreset;
}

export default function ParameterSlider({ preset }: Props) {
  const config = PRESETS[preset];
  const [value, setValue] = useState(config.defaultValue);
  const data = useMemo(() => config.generateData(value), [value, config]);

  return (
    <div className="my-8 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <h3 className="font-semibold text-sm">{config.label}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
      </div>

      <div className="px-5 pt-4 pb-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{config.min}</span>
          <span className="font-semibold text-foreground text-sm">{value}</span>
          <span>{config.max}</span>
        </div>
        <Slider
          min={config.min}
          max={config.max}
          step={config.step}
          value={[value]}
          onValueChange={(vals) => { const v = Array.isArray(vals) ? vals[0] : vals; if (typeof v === 'number') setValue(v); }}
          className="mb-4"
        />
        <p className="text-xs text-muted-foreground italic mb-3">{config.insight(value)}</p>
      </div>

      <div className="px-2 pb-5">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 4, right: 16, bottom: 16, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="x"
              label={{ value: config.xLabel, position: 'insideBottom', offset: -8, fontSize: 11 }}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              label={{ value: config.yLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }}
              tick={{ fontSize: 10 }}
              width={40}
            />
            <Tooltip
              formatter={(v) => [typeof v === 'number' ? v.toFixed(3) : String(v), config.yLabel]}
              labelFormatter={(l) => `${config.xLabel} ${l}`}
              contentStyle={{ fontSize: 11 }}
            />
            <Line type="monotone" dataKey="y" dot={false} strokeWidth={2} stroke="#6366f1" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
