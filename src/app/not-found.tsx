import Link from 'next/link';
import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = { title: 'Off the map', robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <header className="page-head" style={{ minHeight: '70vh' }}>
          <p className="crumbs">404</p>
          <h1 className="display">Off the map.</h1>
          <p className="lede">The globe never stopped here. Try the menu, or find your way to 10th Street.</p>
          <div className="cta-row">
            <Link className="btn" href="/">Back to the globe</Link>
            <Link className="btn ghost" href="/menu">The menu</Link>
            <Link className="btn ghost" href="/visit">Visit</Link>
          </div>
        </header>
      </main>
      <Footer />
    </>
  );
}
