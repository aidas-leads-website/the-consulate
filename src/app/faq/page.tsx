import { site } from '@/content/site';
import { faqs, type Faq } from '@/content/faq';
import { pageMeta } from '@/lib/meta';
import { breadcrumbs, faqPage, graph } from '@/lib/schema';
import { Nav } from '@/components/Nav';
import { PageHead } from '@/components/PageHead';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Motion } from '@/components/Motion';
import { FaqGrid } from '@/components/FaqList';

export const metadata = pageMeta({
  title: 'FAQ: the Visa menu, fees, parking and dress',
  description:
    'Answers about The Consulate in Atlanta: the 90-day Visa menu, hours, free parking, dress code, the 18% service fee, allergies and corkage.',
  path: '/faq',
});

export default function FaqPage() {
  const groups = faqs.reduce<Record<string, Faq[]>>((acc, f) => ((acc[f.group] ||= []).push(f), acc), {});
  return (
    <>
      <Nav />
      <main>
        <PageHead crumb="Questions" title="Good questions." lede={<>Everything guests ask before they come. Anything else, call <a className="link" href={`tel:${site.phone.tel}`} data-track="phone_click">{site.phone.display}</a>.</>} />
        <section className="paper" aria-label="Questions and answers">
          <div className="band" />
          <div className="wrap">
            {Object.entries(groups).map(([group, items]) => (
              <div className="faq-group" key={group}>
                <h2 className="sub">{group}</h2>
                <FaqGrid items={items} />
              </div>
            ))}
          </div>
          <div className="band" />
        </section>
      </main>
      <Footer />
      <JsonLd data={graph(faqPage(), breadcrumbs([{ name: 'Questions', path: '/faq' }]))} />
      <Motion />
    </>
  );
}
