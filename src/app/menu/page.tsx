import { site } from '@/content/site';
import { standing, visa } from '@/content/menu';
import { formatDay } from '@/lib/dates';
import { pageMeta } from '@/lib/meta';
import { breadcrumbs, graph, menu, webPage } from '@/lib/schema';
import { StampDefs } from '@/components/Stamp';
import { Nav } from '@/components/Nav';
import { PageHead } from '@/components/PageHead';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Motion } from '@/components/Motion';
import { VisaMenu } from '@/components/sections/VisaMenu';
import { StandingMenu } from '@/components/sections/StandingMenu';
import { Bar } from '@/components/sections/Bar';

const places = new Set(standing.map((d) => d.origin).filter((o) => o !== 'Global')).size;

export const metadata = pageMeta({
  title: `Menu: ${visa.country} Visa and global standing menu`,
  description: `The Consulate’s menus as text, with prices: the ${visa.country} Visa menu through ${formatDay(visa.validTo, true)}, ${standing.length} standing dishes from ${places} places, cocktails and soft drinks.`,
  path: '/menu',
});

export default function MenuPage() {
  return (
    <>
      <StampDefs />
      <Nav />
      <main>
        <PageHead
          crumb="Menu"
          title="The menu"
          lede={<>Three lists. The Visa changes every 90 days with the globe; this one is {visa.country}, until {formatDay(visa.validTo)}. The standing menu never leaves. The bar sits in between.</>}
        >
          <div className="cta-row">
            <a className="btn" href={site.links.reserve} target="_blank" rel="noopener" data-track="reserve_click">Reserve a table</a>
            <a className="btn ghost" href="#menu">Standing menu</a>
            <a className="btn ghost" href="#bar">Cocktails</a>
          </div>
        </PageHead>
        <VisaMenu />
        <StandingMenu />
        <Bar full />
      </main>
      <Footer />
      <JsonLd data={graph(webPage('/menu', `Menu | ${site.name}`, 'WebPage', { mainEntity: { '@id': `${site.url}/menu#menu` } }), menu(), breadcrumbs([{ name: 'Menu', path: '/menu' }]))} />
      <Motion />
    </>
  );
}
