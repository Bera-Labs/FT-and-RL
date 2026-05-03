import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import ProgressBar from '@/components/chapter/ProgressBar';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Fine-Tuning & RL — Interactive Tutorial',
  description: 'A 30-chapter beginner guide to fine-tuning and reinforcement learning.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('font-sans', inter.variable)}>
      <body className="antialiased min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-80 transition-opacity">
              FT &amp; RL
            </Link>
            <ProgressBar />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
