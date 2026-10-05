'use client';

import { useState } from 'react';
import type { SectionKey } from '@/content/menu';

/** Course filter for the standing menu. Filtering is a data attribute plus CSS, so the dishes stay server-rendered. */
export function MenuFilter({
  sections,
  counts,
  intro,
  children,
}: {
  sections: { key: SectionKey; label: string }[];
  counts: Record<string, number>;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  const [f, setF] = useState<'all' | SectionKey>('all');
  const chips = [{ key: 'all' as const, label: 'All' }, ...sections];
  const current = chips.find((c) => c.key === f)!;
  return (
    <>
      <div className="menu-head">
        {intro}
        <div className="filters" role="group" aria-label="Filter the menu by course">
          {chips.map((c) => (
            <button key={c.key} className="chip" type="button" data-f={c.key} aria-pressed={f === c.key} onClick={() => setF(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <p className="sr" aria-live="polite">{f === 'all' ? '' : `Showing ${counts[f]} ${current.label.toLowerCase()} dishes.`}</p>
      <ul className="dishes" id="menu-list" data-filter={f}>
        {children}
      </ul>
    </>
  );
}
