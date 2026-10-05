import Link from 'next/link';
import { goodToKnow, parkingSteps, site, transitNote } from '@/content/site';

const hoursData = `${site.hours.days.join(',')}|${site.hours.opens}|${site.hours.closes}`;

export function Facts() {
  return (
    <>
      <dl className="facts">
        <div><dt>Address</dt><dd>10 10th St NW, P200<br />{site.address.locality}, {site.address.region} {site.address.postalCode}</dd></div>
        <div><dt>Hours</dt><dd>{site.hours.text}<br />{site.hours.closed}<br /><span className="status" data-hours={hoursData} /></dd></div>
        <div><dt>Phone</dt><dd><a className="link" href={`tel:${site.phone.tel}`} data-track="phone_click">{site.phone.display}</a></dd></div>
      </dl>
      <div className="cta-row">
        <a className="btn" href={site.links.reserve} target="_blank" rel="noopener" data-track="reserve_click">Reserve a table</a>
        <a className="btn ghost" href={site.links.directions} target="_blank" rel="noopener" data-track="directions_click">Get directions</a>
      </div>
    </>
  );
}

export function Parking({ as: H = 'h3' }: { as?: 'h2' | 'h3' }) {
  return (
    <>
      <H className="vh" id="parking">Parking is free. Here is the way in.</H>
      <ol className="steps">
        {parkingSteps.map((s) => <li key={s}><span>{s}</span></li>)}
      </ol>
      <p className="dim" style={{ marginTop: '.9rem' }}>{transitNote}</p>
    </>
  );
}

export function GoodToKnow({ as: H = 'h3' }: { as?: 'h2' | 'h3' }) {
  return (
    <>
      <H className="vh" id="good-to-know">Good to know</H>
      <ul className="know">
        {goodToKnow.map((k) => (
          <li key={k.title}>
            <b>{k.title}</b> {k.text}
            {k.phone && <> <a className="link" href={`tel:${site.phone.tel}`} data-track="phone_click">{site.phone.display}</a>.</>}
          </li>
        ))}
      </ul>
    </>
  );
}

export function Groups({ as: H = 'h3', linkPage = false }: { as?: 'h2' | 'h3'; linkPage?: boolean }) {
  const { roomMin, roomMax, buyoutFrom } = site.privateDining;
  return (
    <>
      <H className="vh" id="groups">Groups and gift cards</H>
      <p>
        The private dining room seats {roomMin} to {roomMax}. For {buyoutFrom} or more we can arrange a buyout. For events and filming, write to{' '}
        <a className="link" href={`mailto:${site.email}`} data-track="email_click">{site.email}</a>.
      </p>
      <div className="cta-row">
        <a className="btn ghost" href={site.links.giftCards} target="_blank" rel="noopener" data-track="gift_card_click">Buy a gift card</a>
        {linkPage && <Link className="btn ghost" href="/private-dining">Plan a private dinner</Link>}
      </div>
    </>
  );
}

/** Home page scene 8: the globe turns to Atlanta behind this column. */
export function Visit() {
  return (
    <section className="stage visit" id="visit" aria-labelledby="visit-h">
      <div className="visit-col sel">
        <h2 className="display" id="visit-h">The last stop is ours.</h2>
        <Facts />
        <Parking />
        <GoodToKnow />
        <Groups />
      </div>
    </section>
  );
}
