import Link from 'next/link';
import type { Faq } from '@/content/faq';

/** Questions and answers, always visible (no accordions) so every answer is readable and quotable. */
export function FaqGrid({ items }: { items: Faq[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <div className="faq-item" key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </div>
  );
}

/** A titled block of questions on security paper, linking to the full list. */
export function FaqList({ title, items }: { title: string; items: Faq[] }) {
  return (
    <section className="paper" aria-labelledby="faq-h">
      <div className="band" />
      <div className="wrap">
        <h2 className="sub" id="faq-h">{title}</h2>
        <FaqGrid items={items} />
        <p className="asof"><Link className="link" href="/faq">All questions</Link></p>
      </div>
      <div className="band" />
    </section>
  );
}
