import { site } from '@/content/site';
import { pageMeta } from '@/lib/meta';
import { breadcrumbs, graph, webPage } from '@/lib/schema';
import { Nav } from '@/components/Nav';
import { PageHead } from '@/components/PageHead';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Motion } from '@/components/Motion';
import { Story } from '@/components/sections/Story';
import { Room } from '@/components/sections/Room';

export const metadata = pageMeta({
  title: 'Our story, the room and the art',
  description:
    'Chef Mei Lin and designer Douglas Hines opened The Consulate in Midtown Atlanta in 2016: Panton pendants, a Le Corbusier LC4 and art by Warhol and Matisse.',
  path: '/story',
});

export default function StoryPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHead
          crumb="Our story"
          title="Mei, Doug and the room."
          lede="Two native New Yorkers, a tea shop instead of a wedding, and a restaurant built as the opposite of industrial chic."
        />
        <Story />
        <Room />
      </main>
      <Footer />
      <JsonLd data={graph(webPage('/story', `Our story | ${site.name}`, 'AboutPage', { mainEntity: { '@id': `${site.url}/#restaurant` } }), breadcrumbs([{ name: 'Our story', path: '/story' }]))} />
      <Motion />
    </>
  );
}
