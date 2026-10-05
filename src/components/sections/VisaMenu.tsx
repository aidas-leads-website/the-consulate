import { visa } from '@/content/menu';
import { formatDay } from '@/lib/dates';
import { Stamp } from '@/components/Stamp';
import { DishItem } from '@/components/DishItem';

export function VisaMenu({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <section className="paper visa" id="visa" aria-labelledby="visa-h">
      <div className="band" />
      <div className="wrap">
        <header className="visa-head">
          <div>
            <H className="display" id="visa-h">{visa.country}</H>
            <p>This is the Visa, the menu the globe chose. It stays through {formatDay(visa.validTo, true)}, then {visa.next.country} takes its place.</p>
          </div>
          <div className="visa-marks" data-scroll>
            <svg className="rosette" viewBox="-100 -100 200 200" aria-hidden="true"><path id="rosette-path" fill="none" stroke="currentColor" strokeWidth=".45" /></svg>
            <Stamp />
          </div>
        </header>
        <ul className="dishes">
          {visa.dishes.map((d) => <DishItem key={d.name} dish={d} />)}
        </ul>
        <div className="visa-extra">
          <div>
            <h3 className="sub">To finish</h3>
            <ul>{visa.desserts.map((d) => <DishItem key={d.name} dish={d} />)}</ul>
          </div>
          <div>
            <h3 className="sub">To drink, ${visa.cocktailPrice} each</h3>
            <ul>{visa.cocktails.map((d) => <DishItem key={d.name} dish={d} />)}</ul>
          </div>
        </div>
        <p className="asof">
          Menu as published on <time dateTime={visa.menuAsOf}>{formatDay(visa.menuAsOf, true)}</time>. An 18% service fee is added to every tab.
        </p>
      </div>
      <div className="band" />
    </section>
  );
}
