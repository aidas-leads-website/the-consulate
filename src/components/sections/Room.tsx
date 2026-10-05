import { roomPieces } from '@/content/story';

export function Room() {
  return (
    <section className="room" id="room" aria-labelledby="room-h">
      <div className="room-intro">
        <h2 className="display" id="room-h"><span>No Edison bulbs.</span> <span>No reclaimed lumber.</span> <span>No subway tile.</span></h2>
        <p>Co-owner Doug Hines designed the room as the opposite of industrial chic: mid-century lighting and furniture, a lounge with a fireplace, and a permanent art collection. You are encouraged to get up and look around.</p>
      </div>
      <div className="collection" id="collection">
        <div className="cpin">
          <ul className="track" id="track">
            {roomPieces.map((p) => (
              <li className="label" key={p.title}>
                <h3 className="display">{p.title}</h3>
                <p>{p.text}</p>
                <p className="where">{p.where}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
