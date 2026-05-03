import { CHAPTERS, getChapter, getPrevNext } from '@/lib/chapters';
import { notFound } from 'next/navigation';
import ChapterNav from '@/components/chapter/ChapterNav';
import MathReferencePanel from '@/components/chapter/MathReferencePanel';
import { Badge } from '@/components/ui/badge';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return CHAPTERS.map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const chapter = getChapter(Number(id));
  if (!chapter) return {};
  return {
    title: `Ch ${chapter.id}: ${chapter.title} — FT & RL`,
    description: chapter.description,
  };
}

export default async function ChapterPage({ params }: Props) {
  const { id } = await params;
  const chapterId = Number(id);
  const chapter = getChapter(chapterId);
  if (!chapter) notFound();

  const { prev, next } = getPrevNext(chapterId);

  let Content: React.ComponentType;
  try {
    const mod = await import(`@/content/chapters/${chapter.slug}.mdx`);
    Content = mod.default;
  } catch {
    const ComingSoon = () => (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
        <p className="font-medium">Content coming soon</p>
        <p className="text-sm mt-1">This chapter is being written.</p>
      </div>
    );
    ComingSoon.displayName = 'ComingSoon';
    Content = ComingSoon;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* header */}
      <div className="mb-8 max-w-3xl">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">Part {chapter.part}: {chapter.partTitle}</Badge>
          <span className="text-xs text-muted-foreground">Chapter {chapter.id} of {CHAPTERS.length}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{chapter.title}</h1>
        <p className="text-muted-foreground">{chapter.description}</p>
      </div>

      <hr className="border-border mb-8" />

      {/* two-column: article + math sidebar */}
      <div className="flex gap-8 items-start">
        <article className="flex-1 min-w-0">
          <Content />
          <ChapterNav prev={prev} next={next} />
        </article>

        <MathReferencePanel concepts={chapter.mathConcepts} />
      </div>
    </div>
  );
}
