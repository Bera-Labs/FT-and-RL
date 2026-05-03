'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function render() {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'base',
        themeVariables: {
          primaryColor: '#6366f1',
          primaryTextColor: '#1e293b',
          primaryBorderColor: '#4f46e5',
          lineColor: '#94a3b8',
          secondaryColor: '#f8fafc',
          tertiaryColor: '#ede9fe',
          background: '#ffffff',
          mainBkg: '#f8fafc',
          nodeBorder: '#cbd5e1',
          clusterBkg: '#f8fafc',
          clusterBorder: '#e2e8f0',
          titleColor: '#1e293b',
          edgeLabelBackground: '#f8fafc',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '15px',
        },
        flowchart: {
          curve: 'basis',
          padding: 20,
          htmlLabels: true,
        },
      });
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      try {
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(rendered);
      } catch {
        if (!cancelled) setSvg('<p style="color:#ef4444;font-size:12px;text-align:center">Diagram error</p>');
      }
    }
    render();
    return () => { cancelled = true; };
  }, [chart]);

  return (
    <div
      ref={ref}
      className={`flex justify-center items-center min-h-[80px] w-full [&_svg]:max-w-full [&_svg]:w-full [&_svg]:h-auto [&_.label]:font-sans ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
