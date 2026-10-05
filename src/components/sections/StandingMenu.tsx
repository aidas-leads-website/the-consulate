import { sections, standing, standingAsOf } from '@/content/menu';
import { formatDay, numberWord } from '@/lib/dates';
import { DishItem } from '@/components/DishItem';
import { MenuFilter } from './MenuFilter';

export function StandingMenu() {
  const places = new Set(standing.map((d) => d.origin).filter((o) => o !== 'Global')).size;
  const label = Object.fromEntries(sections.map((s) => [s.key, s.label]));
  const count = Object.fromEntries(sections.map((s) => [s.key, standing.filter((d) => d.section === s.key).length]));
  return (
    <section className="paper" id="menu" aria-labelledby="menu-h">
      <div className="band" />
      <div className="wrap">
        <MenuFilter
          sections={sections}
          counts={{ all: standing.length, ...count }}
          intro={
            <div>
              <h2 className="display" id="menu-h">The standing menu</h2>
              <p>{numberWord(standing.length, true)} dishes from {numberWord(places)} places. Each one is marked with where it comes from.</p>
            </div>
          }
        >
          {standing.map((d) => (
            <DishItem
              key={d.name}
              dish={d}
              data-s={d.section}
              meta={<><span className="origin">{d.origin}</span><span className="dim">{label[d.section]}</span></>}
            />
          ))}
        </MenuFilter>
        <p className="asof">
          Menu as published on <time dateTime={standingAsOf}>{formatDay(standingAsOf, true)}</time>. Our flavors are bold. If a dish reaches you wrong, tell your server and we will fix it.
        </p>
      </div>
      <div className="band" />
    </section>
  );
}
