import Link from 'next/link';

/** Header for inner pages: breadcrumb, display heading and a lede, on lair green. */
export function PageHead({ crumb, title, lede, children }: { crumb: string; title: string; lede: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="page-head">
      <nav aria-label="Breadcrumb">
        <ol className="crumbs">
          <li><Link href="/">The Consulate</Link></li>
          <li aria-current="page">{crumb}</li>
        </ol>
      </nav>
      <h1 className="display">{title}</h1>
      <p className="lede">{lede}</p>
      {children}
    </header>
  );
}
