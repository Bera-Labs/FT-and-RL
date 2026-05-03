'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  question: string;
  answer: string;
}

export default function ConceptCheck({ question, answer }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="my-6 rounded-xl border border-violet-200 bg-violet-50 dark:bg-violet-950/20 dark:border-violet-800 overflow-hidden">
      <div className="flex items-start gap-3 px-5 py-4">
        <HelpCircle className="text-violet-500 shrink-0 mt-0.5" size={18} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-violet-900 dark:text-violet-200 mb-3">
            {question}
          </p>
          <button
            onClick={() => setRevealed((r) => !r)}
            className="flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
          >
            {revealed ? 'Hide answer' : 'Show answer'}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${revealed ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <p className="mt-3 text-sm text-violet-900 dark:text-violet-100 leading-relaxed border-t border-violet-200 dark:border-violet-700 pt-3">
                  {answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
