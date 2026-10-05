'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { site } from '@/content/site';

// On the home page the links are in-page anchors (as in the prototype);
// on inner pages they point at the page that holds each section.
const HOME = [
  { href: '#visa', label: 'Visa menu' },
  { href: '#itinerary', label: 'Itinerary' },
  { href: '#menu', label: 'Full menu' },
  { href: '#bar', label: 'Bar' },
  { href: '#room', label: 'The room' },
  { href: '#visit', label: 'Visit' },
];
const INNER = [
  { href: '/menu#visa', label: 'Visa menu' },
  { href: '/#itinerary', label: 'Itinerary' },
  { href: '/menu#menu', label: 'Full menu' },
  { href: '/menu#bar', label: 'Bar' },
  { href: '/story#room', label: 'The room' },
  { href: '/visit', label: 'Visit' },
];

export function Nav({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);
  const links = home ? HOME : INNER;

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}`} id="nav">
      {home ? (
        <a className="brand" href="#top">The Consulate</a>
      ) : (
        <Link className="brand" href="/">The Consulate</Link>
      )}
      <nav className="nav-links" id="nav-links" aria-label="Sections">
        {links.map((l) =>
          l.href.startsWith('#') ? (
            <a key={l.href} href={l.href} onClick={close}>{l.label}</a>
          ) : (
            <Link key={l.href} href={l.href} onClick={close}>{l.label}</Link>
          ),
        )}
      </nav>
      <button className="nav-toggle" id="nav-toggle" type="button" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((o) => !o)}>
        Sections
      </button>
      <a className="btn" href={site.links.reserve} target="_blank" rel="noopener" data-track="reserve_click">
        Reserve<span className="wide">&nbsp;a table</span>
      </a>
    </header>
  );
}
