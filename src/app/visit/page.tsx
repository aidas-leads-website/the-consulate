import { site } from '@/content/site';
import { faqs } from '@/content/faq';
import { pageMeta } from '@/lib/meta';
import { breadcrumbs, graph, parkingHowTo, webPage } from '@/lib/schema';
import { Nav } from '@/components/Nav';
import { PageHead } from '@/components/PageHead';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Motion } from '@/components/Motion';
import { Facts, GoodToKnow, Groups, Parking } from '@/components/sections/Visit';
import { FaqList } from '@/components/FaqList';

export const metadata = pageMeta({
  title: 'Hours, parking and directions in Midtown',
  description: `The Consulate, ${site.address.full}. Open ${site.hours.text}. Free validated parking, step by step, and MARTA nearby.`,
  path: '/visit',
});

export default function VisitPage() {
  const planning = faqs.filter((f) => f.group === 'Planning a visit');
  return (
    <>
      <Nav />
      <main>
        <PageHead crumb="Visit" title="The last stop is ours." lede={<>Hidden away in Midtown, and easy to reach: free parking a short walk from the door, and MARTA’s Midtown station right beside it.</>} />
        <section className="lair-sec" aria-label="Hours, parking and house rules">
          <div className="wrap visit-page sel">
            <div>
              <Facts />
              <Parking as="h2" />
            </div>
            <div>
              <GoodToKnow as="h2" />
              <Groups as="h2" linkPage />
            </div>
          </div>
        </section>
        <FaqList title="Before you come" items={planning} />
      </main>
      <Footer />
      <JsonLd data={graph(webPage('/visit', `Visit | ${site.name}`, 'WebPage', { mainEntity: { '@id': `${site.url}/#restaurant` } }), parkingHowTo(), breadcrumbs([{ name: 'Visit', path: '/visit' }]))} />
      <Motion />
    </>
  );
}
