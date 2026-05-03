'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CHAPTERS, PARTS } from '@/lib/chapters';
import { getCompletedIds } from '@/lib/progress';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    setCompleted(getCompletedIds());
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4">33 chapters · Beginner friendly</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Fine-Tuning &amp; Reinforcement Learning
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          An interactive guide that teaches ML concepts through analogies, step-by-step walkthroughs,
          and live visualizations — no prior experience needed.
        </p>
      </div>

      <div className="space-y-12">
        {PARTS.map((part) => {
          const partChapters = CHAPTERS.filter((c) => c.part === part.number);
          const partDone = partChapters.filter((c) => completed.includes(c.id)).length;
          return (
            <section key={part.number}>
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="text-lg font-semibold">
                  Part {part.number}: {part.title}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {partDone}/{partChapters.length} done
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {partChapters.map((chapter) => {
                  const done = completed.includes(chapter.id);
                  return (
                    <Link
                      key={chapter.id}
                      href={`/chapter/${chapter.id}`}
                      className={`group relative rounded-xl border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                        done
                          ? 'border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-800'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Chapter {chapter.id}
                        </span>
                        {done && <CheckCircle2 size={15} className="text-green-500 shrink-0" />}
                      </div>
                      <h3 className="font-semibold text-sm leading-snug mb-1.5 group-hover:text-primary transition-colors">
                        {chapter.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {chapter.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
