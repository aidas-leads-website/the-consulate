import { site } from '@/content/site';
import { visa } from '@/content/menu';
import { formatDay, numberWord } from '@/lib/dates';
import { Stamp } from '@/components/Stamp';

export function Hero() {
  return (
    <section className="stage hero" id="top">
      <div className="pin">
        <div className="beat beat-1 on">
          <h1 className="wordmark"><span>The</span><span>Consulate</span></h1>
          <p className="hero-sub sel">Global cuisine and craft cocktails in Midtown Atlanta. Every 90 days a guest spins our globe, and Chef Mei Lin cooks wherever it stops.</p>
          <div className="cta-row">
            <a className="btn" href={site.links.reserve} target="_blank" rel="noopener" data-track="reserve_click">Reserve a table</a>
            <a className="btn ghost" href="#visa">See where it stopped</a>
          </div>
          <p className="hint dim">Scroll to stop the globe. Drag to spin it yourself.</p>
        </div>
        <div className="beat beat-2">
          <h2 className="display">One guest spins. The kitchen follows.</h2>
          <p className="sel">The globe picks a country and Chef Mei Lin writes a new menu for it. We call that menu the Visa. Ninety days later, someone spins again.</p>
        </div>
        <div className="beat beat-3">
          <Stamp labelled />
          <h2 className="display">It stopped on {visa.country}.</h2>
          <p className="sel">
            {numberWord(visa.dishes.length, true)} dishes and {numberWord(visa.cocktails.length)} cocktails, on the menu through {formatDay(visa.validTo)}.
          </p>
          <div className="cta-row"><a className="btn" href="#visa">Read the {visa.country} menu</a></div>
          <p className="next dim sel" id="next" data-next-date={visa.next.from} data-next-country={visa.next.country} data-next-day={formatDay(visa.next.from)}>
            Next stamp: {visa.next.country}, from {formatDay(visa.next.from)}.
          </p>
        </div>
        {/* Shown only without WebGL or JavaScript (requirement M3); lazy, so nobody else downloads it. */}
        <figure className="flatmap">
          {/* eslint-disable-next-line @next/next/no-img-element -- a static SVG; next/image adds nothing here */}
          <img src="/map.svg" width={720} height={284} loading="lazy" decoding="async" alt={`Map of the places on the menu: ${visa.country} for the Visa, fourteen standing-menu origins from New York City to Japan, and Atlanta.`} />
        </figure>
      </div>
    </section>
  );
}
