import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Chapter } from '@/lib/chapters';

interface Props {
  prev: Chapter | null;
  next: Chapter | null;
}

export default function ChapterNav({ prev, next }: Props) {
  return (
    <div className="flex justify-between gap-4 mt-12 pt-6 border-t border-border">
      {prev ? (
        <Link
          href={`/chapter/${prev.id}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group max-w-[45%]"
        >
          <ChevronLeft size={16} className="shrink-0" />
          <span className="truncate">
            <span className="block text-xs text-muted-foreground/60">Previous</span>
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/chapter/${next.id}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group text-right max-w-[45%] ml-auto"
        >
          <span className="truncate">
            <span className="block text-xs text-muted-foreground/60">Next</span>
            {next.title}
          </span>
          <ChevronRight size={16} className="shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
