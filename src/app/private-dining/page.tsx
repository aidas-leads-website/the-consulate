import { site } from '@/content/site';
import { faqs } from '@/content/faq';
import { pageMeta } from '@/lib/meta';
import { breadcrumbs, graph, webPage } from '@/lib/schema';
import { Nav } from '@/components/Nav';
import { PageHead } from '@/components/PageHead';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Motion } from '@/components/Motion';
import { EnquiryForm } from '@/components/EnquiryForm';
import { FaqList } from '@/components/FaqList';

const { roomMin, roomMax, buyoutFrom } = site.privateDining;

export const metadata = pageMeta({
  title: 'Private dining and buyouts in Midtown',
  description: `Private dining at The Consulate in Midtown Atlanta: a room for ${roomMin} to ${roomMax} guests, full buyouts from ${buyoutFrom}, and events or filming. Send an enquiry.`,
  path: '/private-dining',
});

export default function PrivateDiningPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHead
          crumb="Private dining"
          title="A room of your own."
          lede={`The private dining room seats ${roomMin} to ${roomMax}. For ${buyoutFrom} or more, take the whole restaurant. Events and filming are welcome too.`}
        />
        <section className="lair-sec" aria-label="Rooms and enquiries">
          <div className="wrap visit-page">
            <div>
              <dl className="facts">
                <div><dt>Private dining room</dt><dd>{roomMin} to {roomMax} guests</dd></div>
                <div><dt>Buyout</dt><dd>{buyoutFrom} guests or more</dd></div>
                <div><dt>Large tables</dt><dd>Call <a className="link" href={`tel:${site.phone.tel}`} data-track="phone_click">{site.phone.display}</a> after 5pm for the reservation coordinator</dd></div>
                <div><dt>Events, buyouts and filming</dt><dd><a className="link" href={`mailto:${site.email}`} data-track="email_click">{site.email}</a></dd></div>
              </dl>
              <p className="dim">An 18% service fee is added to every tab.</p>
            </div>
            <div>
              <h2 className="vh" style={{ marginTop: 0 }}>Send an enquiry</h2>
              <EnquiryForm email={site.email} phone={site.phone.display} />
            </div>
          </div>
        </section>
        <FaqList title="Groups and events" items={faqs.filter((f) => f.group === 'Groups and events')} />
      </main>
      <Footer />
      <JsonLd data={graph(webPage('/private-dining', `Private dining | ${site.name}`, 'ContactPage'), breadcrumbs([{ name: 'Private dining', path: '/private-dining' }]))} />
      <Motion />
    </>
  );
}
