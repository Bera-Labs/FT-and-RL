'use client';

import { useEffect, useState } from 'react';
import { getProgress } from '@/lib/progress';

export default function ProgressBar() {
  const [progress, setProgress] = useState({ completed: 0, total: 30 });

  useEffect(() => {
    setProgress(getProgress());
    function sync() { setProgress(getProgress()); }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const pct = Math.round((progress.completed / progress.total) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground font-medium">
        {progress.completed}/{progress.total}
      </span>
    </div>
  );
}
