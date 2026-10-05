import Link from 'next/link';
import { site } from '@/content/site';

const MRZ = 'V<USATHE<CONSULATE<<ATLANTA<<MIDTOWN'.padEnd(116, '<');

export function Footer({ home = false }: { home?: boolean }) {
  return (
    <footer className="foot">
      <div className="foot-grid">
        <div>
          {home ? <a className="brand" href="#top">The Consulate</a> : <Link className="brand" href="/">The Consulate</Link>}
          <p className="dim">Global cuisine and craft cocktails.<br />Midtown Atlanta, since 2016.</p>
        </div>
        <ul>
          <li>{site.address.full}</li>
          <li>{site.hours.text}</li>
          <li><a href={`tel:${site.phone.tel}`} data-track="phone_click">{site.phone.display}</a></li>
        </ul>
        {/* added: crawlable links to the inner pages */}
        <ul aria-label="Pages">
          <li><Link href="/menu">Menu</Link></li>
          <li><Link href="/visit">Hours, parking and directions</Link></li>
          <li><Link href="/story">Our story and the room</Link></li>
          <li><Link href="/private-dining">Private dining</Link></li>
          <li><Link href="/faq">Questions</Link></li>
        </ul>
        <ul>
          <li><a href={site.links.instagram} target="_blank" rel="noopener me">Instagram</a></li>
          <li><a href={site.links.facebook} target="_blank" rel="noopener me">Facebook</a></li>
          <li><a href="https://atlanta.eater.com/maps/best-restaurants-bars-midtown-atlanta" target="_blank" rel="noopener">Eater Atlanta’s Midtown guide</a></li>
          <li><a href={site.links.reserve} target="_blank" rel="noopener" data-track="reserve_click">Reserve on OpenTable</a></li>
          <li><a href={site.links.giftCards} target="_blank" rel="noopener" data-track="gift_card_click">Gift cards</a></li>
        </ul>
      </div>
      <p className="mrz" aria-hidden="true">{MRZ}</p>
      {!site.live && <p className="proto">Redesign concept, not the official site. Photography, final copy and menus to be confirmed with The Consulate.</p>}
    </footer>
  );
}
