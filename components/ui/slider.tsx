'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue, min = 0, max = 100, step = 1, onValueChange, onChange, ...props }, ref) => {
    const controlled = value !== undefined;
    const currentValue = controlled ? value[0] : (defaultValue?.[0] ?? Number(min));

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      onValueChange?.([e.target.valueAsNumber]);
      onChange?.(e);
    }

    return (
      <div className={cn('relative flex w-full touch-none items-center', className)}>
        <div className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{ width: `${((currentValue - Number(min)) / (Number(max) - Number(min))) * 100}%` }}
          />
        </div>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          className="absolute inset-0 w-full cursor-pointer opacity-0 h-full"
          {...props}
        />
        <div
          className="absolute block h-4 w-4 rounded-full border border-primary/50 bg-white shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pointer-events-none"
          style={{ left: `calc(${((currentValue - Number(min)) / (Number(max) - Number(min))) * 100}% - 8px)` }}
        />
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
