import { site } from '@/content/site';
import { visa } from '@/content/menu';
import { formatDay } from '@/lib/dates';
import { pageMeta } from '@/lib/meta';
import { graph, menu, webPage } from '@/lib/schema';
import { StampDefs } from '@/components/Stamp';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Motion } from '@/components/Motion';
import { Hero } from '@/components/sections/Hero';
import { VisaMenu } from '@/components/sections/VisaMenu';
import { Itinerary } from '@/components/sections/Itinerary';
import { StandingMenu } from '@/components/sections/StandingMenu';
import { Bar } from '@/components/sections/Bar';
import { Room } from '@/components/sections/Room';
import { Story } from '@/components/sections/Story';
import { Visit } from '@/components/sections/Visit';

export const metadata = pageMeta({
  title: `${site.name} | Global cuisine and cocktails, Midtown Atlanta`,
  absoluteTitle: true,
  description: `Every 90 days a guest spins the globe and Chef Mei Lin cooks wherever it stops. Now serving ${visa.country}. Dinner Tuesday to Saturday in Midtown Atlanta.`,
  path: '/',
});

// Pins the globe shows besides the itinerary: the current Visa country and the next one.
const extraPins = [
  { lat: visa.lat, lon: visa.lon, name: visa.country, info: [`On the Visa menu through ${formatDay(visa.validTo)}`] },
  { lat: visa.next.lat, lon: visa.next.lon, name: visa.next.country, info: [`Next on the Visa menu, from ${formatDay(visa.next.from)}`] },
];

export default function Home() {
  return (
    <>
      <StampDefs />
      <canvas id="globe" aria-hidden="true" data-pins={JSON.stringify(extraPins)} />
      <div className="pin-label" id="pin-label" aria-hidden="true" />
      <div className="pin-tip" id="pin-tip" role="status" />
      <Nav home />
      <main>
        <Hero />
        <VisaMenu />
        <Itinerary />
        <StandingMenu />
        <Bar />
        <Room />
        <Story />
        <Visit />
      </main>
      <Footer home />
      <JsonLd data={graph(webPage('/', `${site.name}: global cuisine and craft cocktails in Midtown Atlanta`), menu())} />
      <Motion />
    </>
  );
}
