import { dishByName, home, itinerary } from '@/content/menu';
import { numberWord } from '@/lib/dates';

export function Itinerary() {
  const n = itinerary.length;
  return (
    <section className="stage journey" id="itinerary" aria-labelledby="it-h">
      <div className="pin">
        <div className="j-panel">
          <ol className="stops" id="stops">
            <li className="stop stop-intro is-active" data-lat={home.lat} data-lon={home.lon} data-name={home.name} data-info={home.info}>
              <p className="stop-n">{home.label}</p>
              <h2 className="display stop-place" id="it-h">The standing itinerary</h2>
              <p className="sel">{numberWord(n, true)} places never leave the menu, whatever the globe says. Keep scrolling to fly the route, west to east.</p>
              <a className="skip link" href="#menu">Skip to the full menu</a>
            </li>
            {itinerary.map((p, i) => (
              <li className="stop" key={p.name} data-lat={p.lat} data-lon={p.lon} data-name={p.name}>
                <p className="stop-n">Stop {i + 1} of {n}</p>
                <h3 className="display stop-place">{p.name}</h3>
                <ul className="stop-dishes sel">
                  {p.dishes.map(dishByName).map((d) => (
                    <li key={d.name}>
                      <div className="sd-top"><span>{d.name}</span><span>${d.price}</span></div>
                      <p className="sd-desc">{d.description}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li className="stop stop-spin">
              <p className="stop-n">Your turn</p>
              <h3 className="display stop-place">Can’t decide?</h3>
              <p className="sel">Do what we do. Spin the globe and order from wherever it lands.</p>
              <div className="cta-row"><button className="btn" id="spin" type="button">Spin the globe</button></div>
              <div id="spin-out" className="sel" aria-live="polite" />
            </li>
          </ol>
          <div className="route" aria-hidden="true"><span>{home.name}</span><span className="route-line"><i /></span><span>{itinerary[n - 1].name}</span></div>
        </div>
      </div>
    </section>
  );
}
