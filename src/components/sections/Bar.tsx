import Link from 'next/link';
import { bar } from '@/content/menu';
import { formatDay } from '@/lib/dates';
import { DishItem } from '@/components/DishItem';

/** The bar. `full` adds the soft drinks, which only the menu page lists. */
export function Bar({ full = false }: { full?: boolean }) {
  return (
    <section className="bar" id="bar" aria-labelledby="bar-h">
      <div className="wrap bar-grid">
        <div>
          <h2 className="display" id="bar-h">Where people come to Bond.</h2>
          <p className="lede">Beers, wines and spirits from around the globe, with the commonplace brands left off on purpose. Tell your server what you like and they will steer you. Beverage Director: {bar.director}.</p>
          <h3 className="sub">Resident cocktails</h3>
          <ul>{bar.resident.map((d) => <DishItem key={d.name} dish={d} />)}</ul>
          {full && (
            <>
              <h3 className="sub">Soft drinks</h3>
              <ul>
                {bar.soft.map((d) => (
                  <li className="dish" key={d.name}>
                    <div className="dish-top"><h3>{d.name}</h3><span className="dots" /><span className="price">${d.price}</span></div>
                    <div className="meta">{d.origin && <span>{d.origin}</span>}<span>{d.size}</span></div>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="asof">
            Drinks as published on <time dateTime={bar.asOf}>{formatDay(bar.asOf, true)}</time>.{' '}
            {full ? 'Ask your server for the beer and wine lists.' : <Link className="link" href="/menu#bar">Soft drinks and prices</Link>}
          </p>
        </div>
        <div className="sunset" data-scroll>
          <div className="glass" aria-hidden="true"><i className="l1" /><i className="l2" /><span className="cube" /></div>
          <p><b>{bar.featured.name}, ${bar.featured.price}</b>{bar.featured.description}</p>
        </div>
      </div>
    </section>
  );
}
