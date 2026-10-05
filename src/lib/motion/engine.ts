// Scroll-linked motion for every page, ported from the prototype's script.
// All text is already in the server-rendered HTML; this only animates (requirement M4).
// The globe (three.js) is a separate chunk loaded after first paint (P2), and the loop
// skips rendering while the globe is covered or the tab is hidden (P3).
import { track } from '@/lib/track';
import type { GeoPin, GlobeScene, PinObj, SceneName } from '@/lib/globe/scene';

const D = Math.PI / 180, TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sstep = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

type Listener = (e: Event) => void;

export function startMotion(): () => void {
  const root = document.documentElement;
  const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector<T>(s);
  const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll<T>(s));
  const offs: (() => void)[] = [];
  const on = (t: EventTarget, type: string, fn: Listener, opts?: AddEventListenerOptions) => {
    t.addEventListener(type, fn, opts);
    offs.push(() => t.removeEventListener(type, fn, opts));
  };
  let alive = true, raf = 0, G: GlobeScene | null = null;
  const cleanup = () => {
    alive = false;
    cancelAnimationFrame(raf);
    offs.forEach((f) => f());
    G?.dispose();
    G = null;
    root.classList.remove('gl-ready');
  };

  // analytics: any element with data-track reports its click
  on(document, 'click', (e) => {
    const el = (e.target as Element | null)?.closest?.('[data-track]');
    if (el) track(el.getAttribute('data-track') || 'click');
  });

  rosette();
  clock();

  /* ---------------- elements ---------------- */
  const canvas = $<HTMLCanvasElement>('#globe'), hero = $('#top'), journey = $('#itinerary'), visit = $('#visit');
  const beats = $$('.beat'), stopEls = $$('#stops .stop');
  const collection = $('#collection'), trackEl = $('#track');
  const wanted = $$('#wanted li'), scrollFx = $$('[data-scroll]');
  const label = $('#pin-label'), tip = $('#pin-tip');
  const spinBtn = $<HTMLButtonElement>('#spin'), spinOut = $('#spin-out');

  const geo: GeoPin[] = stopEls.filter((e) => e.hasAttribute('data-lat')).map((e) => ({
    lat: +e.dataset.lat!,
    lon: +e.dataset.lon!,
    name: e.dataset.name!,
    info: e.dataset.info ? [e.dataset.info] : $$('.sd-top', e).map((r) => r.children[0].textContent + ', ' + r.children[1].textContent),
  }));
  const extra: GeoPin[] = canvas?.dataset.pins ? JSON.parse(canvas.dataset.pins) : [];
  const VN = extra[0], BG = extra[1];
  const randomStop = () => geo[1 + Math.floor(Math.random() * (geo.length - 1))];

  function showSpin(g: GeoPin) {
    if (!spinOut || !spinBtn) return;
    spinOut.textContent = '';
    const b = document.createElement('b'); b.textContent = g.name + '.';
    const s = document.createElement('span'); s.textContent = 'From here: ' + g.info.join('; ') + '.';
    spinOut.appendChild(b); spinOut.appendChild(s);
    spinBtn.textContent = 'Spin again';
  }

  let staticMode = root.classList.contains('static');
  const canGlobe = !!canvas && !!VN && geo.length > 1;
  const S = { y: VN ? -VN.lon * D + 2.2 : 0, pitch: VN ? VN.lat * 0.8 * D : 0, px: 0, py: 0, sc: 1, fling: 0 };
  let spinAnim: { t0: number; dur: number; from: number; to: number; g: GeoPin } | null = null;
  let spinPick: GeoPin | null = null;

  if (spinBtn) on(spinBtn, 'click', () => {
    if (!G || staticMode) { if (geo.length > 1) showSpin(randomStop()); return; }
    if (spinAnim) return;
    const g = randomStop();
    const d = (((-g.lon * D - S.y) % TAU) + TAU) % TAU;
    spinAnim = { t0: performance.now(), dur: 2800, from: S.y, to: S.y + d + TAU * 2, g };
    spinPick = g;
    if (spinOut) spinOut.textContent = '';
    spinBtn.disabled = true;
  });

  // The globe waits for the page's own resources (load event), then for an idle moment.
  const afterPaint = (fn: () => void) => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const idle = () => (w.requestIdleCallback ? w.requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 250));
    if (document.readyState === 'complete') idle();
    else on(window, 'load', idle, { once: true });
  };
  const loadGlobe = () =>
    import('@/lib/globe/scene')
      .then((m) => (alive && canvas ? m.createScene(canvas, geo, VN, BG) : null))
      .catch(() => null);

  /* ---------------- static: reduced motion or no WebGL ---------------- */
  if (staticMode) {
    scrollFx.forEach((el) => el.style.setProperty('--p', '.6'));
    if (canGlobe && !root.classList.contains('no-gl')) {
      afterPaint(() => loadGlobe().then((g) => {
        if (!alive) { g?.dispose(); return; }
        if (!g) { root.classList.add('no-gl'); return; }
        G = g;
        const still = () => {
          g.resize();
          const P = g.place('hero');
          g.rig.position.set(P.x, P.y, 0); g.rig.scale.setScalar(P.s);
          g.earth.rotation.y = -VN.lon * D; g.axis.rotation.x = VN.lat * 0.8 * D;
          g.vnPin.head.scale.setScalar(1.8); g.vnPin.halo.material.opacity = 0.8; g.vnPin.halo.scale.setScalar(1.6);
          g.render(); root.classList.add('gl-ready');
        };
        still();
        on(window, 'resize', still);
      }));
    }
    return cleanup;
  }

  function toStatic() {
    staticMode = true;
    root.classList.add('static', 'no-gl');
    cancelAnimationFrame(raf);
    scrollFx.forEach((el) => el.style.setProperty('--p', '.6'));
    label?.classList.remove('show'); tip?.classList.remove('show');
  }

  /* ---------------- scroll state ---------------- */
  let cur: SceneName | null = null, hp = 0, jIdx = -1, jF = 0, lastY = -1, dirty = true, inited = false, trackMax = 0, seen = false;
  const NONE = { top: 0, bottom: -1, height: 0 };
  const rectOf = (el: HTMLElement | null) => (el ? el.getBoundingClientRect() : NONE);
  const vis = (r: { top: number; bottom: number }, vh: number) => Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
  const setBeat = (el: HTMLElement, o: number, y: number) => { el.style.setProperty('--o', o.toFixed(3)); el.style.setProperty('--y', y.toFixed(1)); el.classList.toggle('on', o > 0.5); };

  function readScroll() {
    const vh = innerHeight;
    const hr = rectOf(hero), jr = rectOf(journey), vr = rectOf(visit);
    const hv = vis(hr, vh), jv = vis(jr, vh), vv = vis(vr, vh);
    cur = hv <= 0 && jv <= 0 && vv <= 0 ? null : hv >= jv && hv >= vv ? 'hero' : jv >= vv ? 'journey' : 'visit';

    if (hero) {
      hp = clamp(-hr.top / Math.max(1, hr.height - vh));
      if (hv > 0 && beats.length === 3) {
        const a = sstep(0.1, 0.2, hp), b0 = sstep(0.24, 0.32, hp), b1 = sstep(0.54, 0.62, hp), c = sstep(0.7, 0.78, hp);
        setBeat(beats[0], 1 - a, -40 * a);
        setBeat(beats[1], b0 * (1 - b1), 30 * (1 - b0) - 30 * b1);
        setBeat(beats[2], c, 30 * (1 - c));
        beats[2].style.setProperty('--st', sstep(0.74, 0.82, hp).toFixed(3));
      }
      if (!seen && hp >= 1) { seen = true; track('globe_scene_passed'); }
    }

    if (journey && stopEls.length) {
      const n = stopEls.length, jp = clamp(-jr.top / Math.max(1, jr.height - vh));
      const idx = Math.min(n - 1, Math.floor(jp * n));
      jF = Math.min(1, jp * n - idx);
      if (idx !== jIdx) {
        jIdx = idx;
        stopEls.forEach((e, i) => e.classList.toggle('is-active', i === idx));
        journey.style.setProperty('--jp', clamp(idx / (geo.length - 1)).toFixed(4));
        if (idx !== n - 1) spinPick = null;
      }
    }

    scrollFx.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) el.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height)).toFixed(4));
    });
    if (collection && trackEl) {
      const cr = collection.getBoundingClientRect();
      if (cr.bottom > 0 && cr.top < vh) trackEl.style.transform = 'translate3d(' + (-clamp(-cr.top / Math.max(1, cr.height - vh)) * trackMax).toFixed(1) + 'px,0,0)';
    }
    wanted.forEach((li) => { const t = li.getBoundingClientRect().top; li.classList.toggle('dim', t >= vh * 0.74 && t < vh); });
  }

  // keyboard users: bring a hidden hero beat into view when focus lands inside it
  if (hero && beats.length === 3) {
    ([[beats[1], 0.42], [beats[2], 0.88]] as [HTMLElement, number][]).forEach(([el, at]) => {
      on(el, 'focusin', () => {
        if (!el.classList.contains('on')) scrollTo(0, hero.offsetTop + (hero.offsetHeight - innerHeight) * at);
      });
    });
  }

  /* ---------------- pointer: drag to spin, tap a pin ---------------- */
  const drag = { on: false, x: 0, moved: 0, v: 0, t: 0 };
  let tipPin: PinObj | null = null, tipY = 0;
  if (canvas) {
    on(canvas, 'pointerdown', (ev) => {
      const e = ev as PointerEvent;
      drag.on = true; drag.x = e.clientX; drag.moved = 0; drag.v = 0; drag.t = e.timeStamp;
      canvas.classList.add('dragging');
      try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic events */ }
    });
    on(canvas, 'pointermove', (ev) => {
      const e = ev as PointerEvent;
      if (!drag.on || spinAnim) return;
      const dx = e.clientX - drag.x, dtm = Math.max(1, e.timeStamp - drag.t) / 1000, da = (dx * 0.0055) / Math.max(0.4, S.sc);
      drag.x = e.clientX; drag.t = e.timeStamp; drag.moved += Math.abs(dx);
      S.y += da; drag.v = drag.v * 0.6 + (da / dtm) * 0.4;
    });
    const endDrag = (ev: Event) => {
      const e = ev as PointerEvent;
      if (!drag.on) return;
      drag.on = false; canvas.classList.remove('dragging');
      if (e.type === 'pointerup' && drag.moved < 6) tapAt(e.clientX, e.clientY);
      else S.fling = clamp(drag.v, -9, 9);
    };
    on(canvas, 'pointerup', endDrag);
    on(canvas, 'pointercancel', endDrag);
  }
  function tapAt(x: number, y: number) {
    if (!G || !tip) return;
    let best: PinObj | null = null, bd = 34;
    for (const p of G.allPins) {
      const s = G.screenOf(p); if (!s.front) continue;
      const d = Math.hypot(s.x - x, s.y - y); if (d < bd) { bd = d; best = p; }
    }
    tipPin = best; tipY = scrollY;
    if (best) {
      tip.textContent = '';
      const b = document.createElement('b'); b.textContent = best.data.name; tip.appendChild(b);
      tip.appendChild(document.createTextNode(best.data.info.join('; ')));
    } else tip.classList.remove('show');
  }

  // Place an overlay beside a pin. The label flips to the pin's left near the right edge,
  // and the tip is kept inside the viewport (both ran off screen in the prototype).
  function putAt(el: HTMLElement, pin: PinObj, dx: number, dy: number, flip: boolean) {
    const p = G!.screenOf(pin);
    if (!p.front) { el.classList.remove('show'); return false; }
    const w = el.offsetWidth, vw = innerWidth;
    let x = p.x + dx;
    if (flip) {
      const left = x + w > vw - 8;
      el.classList.toggle('flip', left);
      if (left) x = p.x - dx - w;
    } else x = Math.min(x, vw - w - 8);
    el.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(p.y + dy) + 'px,0)';
    el.classList.add('show');
    return true;
  }

  /* ---------------- frame ---------------- */
  let lastT = 0;
  function frame(t: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016); lastT = t;
    if (dirty || scrollY !== lastY) { readScroll(); lastY = scrollY; dirty = false; }
    if (!G) return;
    if (!cur || document.hidden) { label?.classList.remove('show'); tip?.classList.remove('show'); return; }

    // where the globe should be and what it should face
    const P = G.place(cur);
    let T = VN, pull = 1, active: PinObj | null = null, labelText = '', spinFree = 0;
    if (cur === 'hero') {
      const s = sstep(0.12, 0.66, hp);
      spinFree = 0.62 * Math.pow(1 - s, 1.5); pull = sstep(0.7, 1, s);
      if (hp > 0.66) { active = G.vnPin; labelText = VN.name; }
      G.setLegs(() => 0);
    } else if (cur === 'journey') {
      const last = stopEls.length - 1, gi = Math.min(jIdx, geo.length - 1), arrive = sstep(0, 0.55, jF);
      T = geo[gi]; active = G.pins[gi];
      if (jIdx === last) {
        G.setLegs(() => 1);
        if (spinPick) { T = spinPick; active = G.pins[geo.indexOf(spinPick)]; } else active = null;
      } else G.setLegs((i) => (i < gi - 1 ? 1 : i === gi - 1 ? arrive : 0));
      labelText = active ? active.data.name : '';
    } else {
      T = geo[0]; active = G.pins[0]; labelText = 'The Consulate';
      G.setLegs(() => 1);
    }

    const k = 1 - Math.exp(-dt * 4);
    if (!inited) { S.px = P.x; S.py = P.y; S.sc = P.s; inited = true; }
    S.px += (P.x - S.px) * k; S.py += (P.y - S.py) * k; S.sc += (P.s - S.sc) * k;
    G.rig.position.set(S.px, S.py, 0); G.rig.scale.setScalar(S.sc);

    if (spinAnim) {
      const u = clamp((t - spinAnim.t0) / spinAnim.dur), e = 1 - Math.pow(1 - u, 4);
      S.y = spinAnim.from + (spinAnim.to - spinAnim.from) * e;
      if (u >= 1) { const g = spinAnim.g; spinAnim = null; if (spinBtn) spinBtn.disabled = false; showSpin(g); }
    } else if (!drag.on) {
      S.y += (spinFree + S.fling * (1 - pull)) * dt; S.fling *= Math.exp(-dt * 1.6);
      const d = ((((-T.lon * D - S.y) % TAU) + TAU * 1.5) % TAU) - Math.PI;
      S.y += d * (1 - Math.exp(-dt * 3.4 * pull));
    }
    const latK = cur === 'visit' ? 1 : 0.8;
    S.pitch += (T.lat * latK * D - S.pitch) * (1 - Math.exp(-dt * 3.4));
    G.earth.rotation.y = S.y; G.axis.rotation.x = S.pitch;

    // pins
    const ph = (t / 1700) % 1;
    for (const p of G.allPins) {
      const isOn = p === active;
      p.k += ((isOn ? 1.9 : 1) - p.k) * k; p.head.scale.setScalar(p.k);
      if (isOn) { p.halo.scale.setScalar(1 + ph * 2.4); p.halo.material.opacity = (1 - ph) * 0.9; }
      else if (p.halo.material.opacity !== 0) p.halo.material.opacity = 0;
    }

    G.scene.updateMatrixWorld();
    if (label) {
      if (active && labelText && !spinAnim) { if (label.textContent !== labelText) label.textContent = labelText; putAt(label, active, 10, -12, true); }
      else label.classList.remove('show');
    }
    if (tip && tipPin) { if (Math.abs(scrollY - tipY) > 140 || !putAt(tip, tipPin, 16, 18, false)) { tipPin = null; tip.classList.remove('show'); } }

    G.render();
    if (!root.classList.contains('gl-ready')) root.classList.add('gl-ready');
  }

  function resize() {
    if (trackEl) trackMax = Math.max(0, trackEl.offsetWidth - innerWidth);
    G?.resize();
    dirty = true;
  }

  resize();
  on(window, 'resize', resize);
  raf = requestAnimationFrame(frame);

  if (canGlobe) {
    afterPaint(() => loadGlobe().then((g) => {
      if (!alive) { g?.dispose(); return; }
      if (!g) { toStatic(); return; }
      G = g;
      resize();
    }));
  }

  return cleanup;
}

/* ---------------- guilloche rosette behind the visa stamp ---------------- */
function rosette() {
  const p = document.getElementById('rosette-path');
  if (!p || p.getAttribute('d')) return;
  let d = '';
  const ring = (base: number, amp: number, k: number, n: number) => {
    for (let m = 0; m < n; m++) {
      for (let i = 0; i <= 360; i++) {
        const th = i * D, r = base + amp * Math.sin(k * th + (m * TAU) / n);
        d += (i ? 'L' : 'M') + (r * Math.cos(th)).toFixed(2) + ' ' + (r * Math.sin(th)).toFixed(2);
      }
      d += 'Z';
    }
  };
  ring(70, 26, 12, 6);
  ring(36, 12, 8, 5);
  p.setAttribute('d', d);
}

/* ---------------- countdown and open-now line, in Atlanta time ---------------- */
function clock() {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', hour12: false }).formatToParts(new Date());
    const o: Record<string, string> = {};
    parts.forEach((x) => { o[x.type] = x.value; });
    const now = { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday) };

    document.querySelectorAll<HTMLElement>('[data-next-date]').forEach((next) => {
      const [y, m, d] = next.dataset.nextDate!.split('-').map(Number);
      const days = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(now.y, now.m - 1, now.d)) / 864e5);
      const country = next.dataset.nextCountry, day = next.dataset.nextDay;
      if (days > 1) next.textContent = `Next stamp: ${country}, from ${day}. ${days} days to go.`;
      else if (days === 1) next.textContent = `Next stamp: ${country}, from tomorrow.`;
      else next.textContent = 'The globe has been spun again. Ask your server where it stopped.';
    });

    document.querySelectorAll<HTMLElement>('[data-hours]').forEach((st) => {
      const [days, opens, closes] = st.dataset.hours!.split('|');
      const open = days.split(',').map(Number);
      const isOpen = (wd: number) => open.includes(wd);
      const o12 = (h: number) => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`;
      const op = +opens, cl = +closes;
      let msg: string;
      if (isOpen(now.wd) && now.h >= op && now.h < cl) msg = `Open now until ${o12(cl)}.`;
      else if (isOpen(now.wd) && now.h < op) msg = `Opens today at ${o12(op)}.`;
      else {
        let n = 1;
        while (n < 7 && !isOpen((now.wd + n) % 7)) n++;
        const name = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][(now.wd + n) % 7];
        msg = n === 1 ? `Opens tomorrow at ${o12(op)}.` : `Opens ${name} at ${o12(op)}.`;
      }
      st.textContent = msg + ' Atlanta time.';
    });
  } catch {
    /* leave the static copy */
  }
}
