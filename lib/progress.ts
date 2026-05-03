'use client';

const KEY = 'ftrl_progress';

function getStore(): Record<number, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function markComplete(id: number): void {
  const store = getStore();
  store[id] = true;
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function isComplete(id: number): boolean {
  return getStore()[id] === true;
}

export function getProgress(): { completed: number; total: number } {
  const store = getStore();
  return {
    completed: Object.values(store).filter(Boolean).length,
    total: 30,
  };
}

export function getCompletedIds(): number[] {
  return Object.entries(getStore())
    .filter(([, v]) => v)
    .map(([k]) => Number(k));
}
