import { intentions, press, recognition } from '@/content/story';
import { formatDay } from '@/lib/dates';
import { site } from '@/content/site';

export function Story() {
  return (
    <section className="paper story" id="story" aria-labelledby="story-h">
      <div className="band" />
      <div className="wrap">
        <div className="story-grid">
          <div>
            <h2 className="display" id="story-h">Open since <time dateTime={site.founded}>{formatDay(site.founded, true)}</time>.</h2>
            <p>Mei Lin runs the kitchen. Douglas Hines designed the room. Both are native New Yorkers who chose Atlanta as home.</p>
            <p>In 2012, instead of a grand wedding, they opened Honey Bubble Tea in Poncey-Highland. The Consulate followed four years later, the first of eight restaurants they have planned for the city.</p>
            <p className="orig">The original, since 2016. The Consulate is not affiliated with any other restaurant or bar using its name or concept.</p>
          </div>
          <div>
            <h3 className="sub">Recognition</h3>
            <ul className="recog">
              {recognition.map((r) => <li key={r.title}><span>{r.title}</span><span>{r.year}</span></li>)}
            </ul>
            {/* fix: F12 asks for press with links; the prototype listed awards only */}
            <h3 className="sub" style={{ marginTop: '2.4rem' }}>Press</h3>
            <ul className="recog">
              {press.map((p) => (
                <li key={p.url}>
                  <span><a href={p.url} target="_blank" rel="noopener">{p.title}</a><span className="src">{p.source}</span></span>
                  <span>{p.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h3 className="sr">What Mei and Doug set out to build</h3>
        <ul className="wanted" id="wanted">
          {intentions.map((l) => <li key={l}>{l}</li>)}
        </ul>
      </div>
      <div className="band" />
    </section>
  );
}
