'use client';

import { useState } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  title: string;
  body: string;
}

export default function AnalogyCard({ title, body }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="my-6 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <Lightbulb className="text-amber-500 shrink-0" size={20} />
        <span className="font-semibold text-amber-900 dark:text-amber-200 flex-1">{title}</span>
        <ChevronDown
          className={`text-amber-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          size={18}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 text-amber-900 dark:text-amber-100 leading-relaxed">
              {body}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
