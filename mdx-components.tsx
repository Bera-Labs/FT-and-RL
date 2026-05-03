import type { MDXComponents } from 'mdx/types';
import AnalogyCard from '@/components/interactive/AnalogyCard';
import StepWalkthrough from '@/components/interactive/StepWalkthrough';
import MermaidDiagram from '@/components/interactive/MermaidDiagram';
import ConceptCheck from '@/components/interactive/ConceptCheck';
import ParameterSlider from '@/components/interactive/ParameterSlider';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Typography
    h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />,
    h2: (props) => <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground" {...props} />,
    h3: (props) => <h3 className="text-lg font-semibold mt-6 mb-2 text-foreground" {...props} />,
    p: (props) => <p className="my-4 leading-7 text-foreground/80" {...props} />,
    ul: (props) => <ul className="my-4 ml-6 space-y-1.5 list-disc text-foreground/80" {...props} />,
    ol: (props) => <ol className="my-4 ml-6 space-y-1.5 list-decimal text-foreground/80" {...props} />,
    li: (props) => <li className="leading-7" {...props} />,
    blockquote: (props) => (
      <blockquote className="my-6 pl-4 border-l-4 border-primary/40 italic text-muted-foreground" {...props} />
    ),
    strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
    code: (props) => (
      <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-foreground" {...props} />
    ),
    hr: () => <hr className="my-8 border-border" />,

    // Interactive components (used in MDX files directly)
    AnalogyCard,
    StepWalkthrough,
    MermaidDiagram,
    ConceptCheck,
    ParameterSlider,

    ...components,
  };
}
