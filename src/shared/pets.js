/**
 * The pets. Every sprite is drawn procedurally onto a 64x64 pixel buffer:
 * ramped palettes, cel shading, per-part outlines, parallax face that tracks the cursor.
 * To add a pet: write a draw function, add it to PETS. Nothing else needs to change.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./pixel'));
  else root.Pets = factory(root.Pixel);
})(typeof self !== 'undefined' ? self : this, function (Pixel) {
  'use strict';

  const { Rig, ramp } = Pixel;
  const BUF = 64, CX = 32, FEET = 56;
  const EYE = '#2b1b33', HL = '#ffffff', TONGUE = '#ff7d97', MOUTH_IN = '#5b2437';

  /** Everything a draw function may read. The brain fills these in each frame. */
  const DEFAULTS = {
    t: 0, ox: 0, oy: 0, sx: 1, sy: 1,
    lookX: 0, lookY: 0,            // -1..1 where the cursor is
    eyes: 'open',                  // open wide sleepy sad happy sleep love dizzy squint
    mouth: 'smile',                // smile open o yawn flat frown tongue sleep
    blink: 0, blush: 0.3,
    step: 0, walking: 0,           // walk-cycle phase
    sleepy: 0, held: 0, swing: 0,  // droop / picked-up / dangle sway
    flap: 0, ear: 0, gill: 0,      // species extras
    tail: 0, back: false,
  };

  /* ───────────────────────── shared face parts ───────────────────────── */
  const PAT = {
    happy: [[-2, 0], [-1, -1], [0, -1], [1, -1], [2, 0]],
    sleep: [[-2, -1], [-1, 0], [0, 0], [1, 0], [2, -1]],
    blink: [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]],
    x: [[-2, -2], [-1, -1], [0, 0], [1, 1], [2, 2], [2, -2], [1, -1], [-1, 1], [-2, 2]],
    gt: [[-2, -2], [-1, -1], [0, 0], [-1, 1], [-2, 2]],
    lt: [[2, -2], [1, -1], [0, 0], [1, 1], [2, 2]],
    heart: [[-1, -2], [1, -2], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]],
  };
  const dots = (b, pts, x, y, c) => { for (const p of pts) b.set(x + p[0], y + p[1], c); };

  /** One eye. (ex, ey) = centre pixel column and boundary row. */
  function drawEye(b, s, ex, ey, side, o) {
    o = o || {};
    const col = o.col || EYE;
    let kind = s.eyes;
    if (s.blink > 0.55 && (kind === 'open' || kind === 'wide' || kind === 'sad' || kind === 'sleepy')) kind = 'blink';
    switch (kind) {
      case 'happy': return dots(b, PAT.happy, ex, ey, col);
      case 'sleep': return dots(b, PAT.sleep, ex, ey, col);
      case 'blink': return dots(b, PAT.blink, ex, ey, col);
      case 'dizzy': return dots(b, PAT.x, ex, ey, col);
      case 'squint': return dots(b, side < 0 ? PAT.gt : PAT.lt, ex, ey, col);
      case 'love': dots(b, PAT.heart, ex, ey, '#ff4f7d'); b.set(ex - 1, ey - 1, '#ffc7d6'); return;
      default: break;
    }
    let rx = o.rx || 2.5, ry = o.ry || 3, cy = ey;
    if (kind === 'wide') { rx += 1.1; ry += 0.8; }
    if (kind === 'sleepy') { ry = 2; cy = ey + 1; }
    b.ellipse(ex + 0.5, cy, rx, ry, col);
    const top = Math.ceil(cy - ry - 0.5), bot = Math.floor(cy + ry - 0.5);
    if (kind === 'sleepy') b.set(ex - 1, top + 1, HL);
    else { b.rect(ex - 1, top + 1, 2, 2, HL); b.set(ex + 1, bot - 1, HL); }
    if (kind === 'sad') { b.set(ex + side * 2, bot + 1, '#8fd8ff'); b.set(ex + side * 2, bot + 2, '#8fd8ff'); }
  }

  function blush(b, s, x, y) {
    if (s.blush < 0.15) return;
    b.ellipse(x + 0.5, y, 1.7, 1.05, [255, 120, 150, Math.round(80 + s.blush * 150)]);
  }

  /* ───────────────────────── MOCHI · cat ───────────────────────── */
  const CAT = { body: ramp('#f6a55f'), cream: ramp('#fff1da'), ear: '#ff9fb3', nose: '#f4708a' };

  function catMouth(b, kind, x, y) {
    switch (kind) {
      case 'open': b.rect(x - 1, y, 3, 3, MOUTH_IN); b.set(x, y + 2, TONGUE); break;
      case 'o': b.ellipse(x + 0.5, y + 1.5, 1.3, 1.3, MOUTH_IN); break;
      case 'yawn': b.ellipse(x + 0.5, y + 2, 2.6, 3, MOUTH_IN); b.rect(x - 1, y + 3, 3, 1, TONGUE); break;
      case 'flat': b.rect(x - 1, y, 3, 1, EYE); break;
      case 'frown': dots(b, [[-2, 1], [-1, 0], [0, 0], [1, 0], [2, 1]], x, y, EYE); break;
      case 'sleep': b.set(x, y, EYE); break;
      case 'tongue': dots(b, [[-2, 0], [0, 0], [2, 0], [-1, 1], [1, 1]], x, y, EYE); b.set(x, y + 2, TONGUE); break;
      default: dots(b, [[-2, 0], [0, 0], [2, 0], [-1, 1], [1, 1]], x, y, EYE);
    }
  }

  function drawCat(r, s) {
    const b = r.b, P = CAT, line = P.body.line;
    const fxl = Math.round(s.lookX * 2.4), fyl = Math.round(s.lookY * 1.4);
    const hy = -21 + s.sleepy * 3.5;
    const ax = r.cx + fxl, ay = Math.round(r.Y(hy)) + fyl;
    const lift = (sd) => (s.walking ? Math.max(0, sd * Math.sin(s.step)) * 2.4 : 0);

    r.part(line, () => { // tail
      for (let i = 0; i <= 9; i++) {
        const u = i / 9;
        const x = 6.5 + 10.8 * Math.sin(u * 1.3) + Math.sin(s.tail + u * 2.6) * 2.6 * u + s.swing * 2.6 * u;
        const y = -4.5 - 15.5 * u + s.held * 1.2 * u;
        const rad = 2.9 - 1.1 * u;
        r.ell(x, y, rad, rad, u > 0.84 ? P.cream.base : (i === 3 || i === 6 ? P.body.shade : P.body.base));
      }
    });

    r.part(line, () => { // body
      r.ball(0, -9.2, 9.8, 8.8, P.body);
      r.atop(() => {
        r.ball(0, -7.0, 5.9, 6.6, P.cream, { hi: false });
        r.rect(-10, -12, 3, 1, P.body.deep); r.rect(8, -12, 3, 1, P.body.deep);
        r.rect(-10, -9, 2, 1, P.body.deep); r.rect(9, -9, 2, 1, P.body.deep);
      });
    });

    r.part(line, () => { // front paws
      for (const sd of [-1, 1]) {
        r.ball(sd * 4.7 + s.swing * s.held * 1.5, -2 - lift(sd) + s.held * 1.8, 3.5, 2.3, P.cream, { hi: false });
      }
    });
    if (!s.walking) for (const sd of [-1, 1]) r.dot(sd * 5, -1.4 + s.held * 1.8, line);

    r.part(line, () => { // head + ears
      for (const sd of [-1, 1]) {
        const tw = sd < 0 ? Math.max(0, s.ear) : Math.max(0, -s.ear);
        const tx = sd * (11.4 + s.sleepy * 1.4) + fxl * 0.5, ty = hy - 16.2 + s.sleepy * 3.2 + tw * 2.4;
        r.tri(sd * 12.9, hy - 3.2, sd * 3.6, hy - 10.4, tx, ty, P.body.base);
        r.tri(sd * 10.7, hy - 5.8, sd * 6.0, hy - 9.6, tx - sd * 0.6, ty + 3.4, P.ear);
      }
      r.ball(0, hy, 13, 11, P.body);
      r.atop(() => {
        r.ball(fxl, hy + 4.8, 5.6, 3.7, P.cream, { hi: false });
        r.rect(fxl - 3, hy - 10.4, 1, 3, P.body.deep); r.rect(fxl, hy - 10.8, 1, 4, P.body.deep); r.rect(fxl + 3, hy - 10.4, 1, 3, P.body.deep);
        r.rect(-12 + fxl, hy - 1, 3, 1, P.body.deep); r.rect(-12 + fxl, hy + 1, 2, 1, P.body.deep);
        r.rect(10 + fxl, hy - 1, 3, 1, P.body.deep); r.rect(11 + fxl, hy + 1, 2, 1, P.body.deep);
      });
    });

    if (s.back) return;
    drawEye(b, s, ax - 6, ay + 1, -1); drawEye(b, s, ax + 6, ay + 1, 1);
    blush(b, s, ax - 9, ay + 4); blush(b, s, ax + 9, ay + 4);
    b.rect(ax - 1, ay + 3, 3, 1, P.nose); b.set(ax, ay + 4, P.nose);
    catMouth(b, s.mouth, ax, ay + 5);
    for (const sd of [-1, 1]) { // whiskers
      b.set(ax + sd * 14, ay + 4, line); b.set(ax + sd * 15, ay + 3, line);
      b.set(ax + sd * 14, ay + 6, line); b.set(ax + sd * 15, ay + 7, line);
    }
  }

  /* ───────────────────────── WADDLE · penguin ───────────────────────── */
  const PEN = { body: ramp('#46539e'), belly: ramp('#f6f8ff'), orange: ramp('#ffab35'), line: '#161b45' };

  function drawPenguin(r, s) {
    const b = r.b, P = PEN, line = P.line;
    const fxl = Math.round(s.lookX * 2.2), fyl = Math.round(s.lookY * 1.3);
    const hy = -22 + s.sleepy * 2.5;
    const ax = r.cx + fxl, ay = Math.round(r.Y(hy)) + fyl;
    const lift = (sd) => (s.walking ? Math.max(0, sd * Math.sin(s.step)) * 2.2 : 0);
    const W = P.belly.base;

    r.part(line, () => { // body, tuft, belly, face mask
      r.tri(-2.6, -27.5, 0.4 + s.swing, -33.5, 2.8, -27.5, P.body.base);
      r.ball(0, -14.8, 12.6, 14.8, P.body);
      r.atop(() => {
        r.ball(0, -8.0, 8.3, 7.7, P.belly, { hi: false });
        r.ell(fxl - 6, hy, 4.7, 5.1, W); r.ell(fxl + 6, hy, 4.7, 5.1, W); r.ell(fxl, hy + 1.2, 3.4, 3.2, W);
      });
    });

    r.part(line, () => { // flippers
      const fl = Math.max(s.flap, s.held * 0.55);
      for (const sd of [-1, 1]) {
        r.ball(sd * (12.8 + fl * 2.4), -13 - fl * 5, 2.9, 6.9, P.body, { hi: false }, -sd * (0.26 + fl * 0.95 + Math.abs(s.swing) * 0.2));
      }
    });

    r.part(line, () => { // feet
      for (const sd of [-1, 1]) r.ball(sd * 5.3, -1.5 - lift(sd) + s.held * 1.5, 4.4, 2.1, P.orange, { hi: false });
    });

    if (s.back) return;
    const px = Math.round(s.lookX * 1.5), py = Math.round(s.lookY * 1.2);
    drawEye(b, s, ax - 6 + px, ay + py, -1); drawEye(b, s, ax + 6 + px, ay + py, 1);
    blush(b, s, ax - 10, ay + 4); blush(b, s, ax + 10, ay + 4);
    const by = ay + 5, o = P.orange;
    if (s.mouth === 'open' || s.mouth === 'o' || s.mouth === 'yawn') {
      const g = s.mouth === 'yawn' ? 3 : (s.mouth === 'o' ? 1 : 2);
      b.ellipse(ax + 0.5, by + 1, 3.5, 1.3, MOUTH_IN);
      b.ellipse(ax + 0.5, by - 0.2, 3.4, 1.3, o.light);
      b.ellipse(ax + 0.5, by + 1 + g, 2.8, 1.1, o.base);
      if (g > 1) b.rect(ax - 1, by + 2, 3, 1, TONGUE);
    } else {
      b.ellipse(ax + 0.5, by + 0.5, 3.6, 1.5, o.base);
      b.rect(ax - 2, by - 1, 5, 1, o.light);
      b.rect(ax - 3, by + 1, 7, 1, o.shade);
    }
  }

  /* ───────────────────────── AXO · axolotl ───────────────────────── */
  const AXO = { body: ramp('#ffb4c9'), belly: ramp('#ffe6ee'), gill: ramp('#ff6f9f'), tip: '#ff4a86', line: '#8e3a63' };

  function axoMouth(b, kind, x, y) {
    const M = '#a43b65';
    switch (kind) {
      case 'open': b.ellipse(x + 0.5, y + 1, 3.6, 2.4, M); b.rect(x - 1, y + 2, 3, 1, TONGUE); break;
      case 'o': b.ellipse(x + 0.5, y + 1, 1.6, 1.6, M); break;
      case 'yawn': b.ellipse(x + 0.5, y + 1.5, 4.2, 3.2, M); b.rect(x - 2, y + 3, 5, 1, TONGUE); break;
      case 'flat': b.rect(x - 2, y, 5, 1, M); break;
      case 'frown': dots(b, [[-3, 1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 1]], x, y, M); break;
      case 'sleep': b.rect(x - 2, y, 5, 1, M); break;
      case 'tongue': b.rect(x - 3, y, 7, 1, M); b.set(x - 4, y - 1, M); b.set(x + 4, y - 1, M); b.rect(x, y + 1, 2, 2, TONGUE); break;
      default: b.rect(x - 3, y, 7, 1, M); b.set(x - 4, y - 1, M); b.set(x + 4, y - 1, M);
    }
  }

  function drawAxo(r, s) {
    const b = r.b, P = AXO, line = P.line;
    const fxl = Math.round(s.lookX * 2.6), fyl = Math.round(s.lookY * 1.4);
    const hy = -12.2 + s.sleepy * 2.2;
    const ax = r.cx + fxl, ay = Math.round(r.Y(hy)) + fyl;
    const lift = (sd) => (s.walking ? Math.max(0, sd * Math.sin(s.step)) * 2.2 : 0);

    for (const sd of [-1, 1]) r.part(P.gill.deep, () => { // gills
      const stalks = [[-17.5, -0.8, -0.6, 8.5], [-13.8, -0.97, -0.2, 9.4], [-10.2, -0.85, 0.5, 7.8]];
      stalks.forEach((st, k) => {
        for (let j = 0; j <= 6; j++) {
          const u = j / 6;
          const wig = Math.sin(s.t * 3 + k * 1.7 + u * 3 + (sd > 0 ? 1.3 : 0)) * (0.7 + s.gill * 1.8 + Math.abs(s.swing)) * u;
          const x = sd * (12.4 - st[1] * st[3] * u) + 0, y = st[0] + st[2] * st[3] * u + wig;
          r.ell(x, y, j === 6 ? 2.1 : 1.9 - u * 0.4, j === 6 ? 2.1 : 1.9 - u * 0.4, j === 6 ? P.tip : P.gill.base);
        }
      });
    });

    r.part(line, () => { // tail
      for (let i = 0; i <= 6; i++) {
        const u = i / 6;
        r.ell(9.5 + 10 * u, -4.5 - 2.5 * u + Math.sin(s.tail + u * 2.4) * 1.8 * u + s.swing * 2 * u, 3.3 - 1.7 * u, 3.1 - 1.8 * u, i > 3 ? P.gill.light : P.body.base);
      }
    });

    r.part(line, () => { // body
      r.ball(0, -11.4, 14.6, 11.2, P.body);
      r.atop(() => {
        r.ball(0, -5.2, 10.6, 5.4, P.belly, { hi: false });
        for (const [fx, fy] of [[-7, -17], [-4, -19], [6, -18], [9, -15], [-10, -14]]) r.dot(fx, fy, P.body.shade);
      });
    });

    r.part(line, () => { // stubby arms
      for (const sd of [-1, 1]) r.ball(sd * 9.8 + s.swing * s.held * 1.5, -1.9 - lift(sd) + s.held * 1.8, 3.8, 2.3, P.body, { hi: false });
    });
    for (const sd of [-1, 1]) { r.dot(sd * 9, -1.2 - lift(sd) + s.held * 1.8, P.body.deep); r.dot(sd * 11, -1.2 - lift(sd) + s.held * 1.8, P.body.deep); }

    if (s.back) return;
    drawEye(b, s, ax - 9, ay - 1, -1, { ry: 2.6 }); drawEye(b, s, ax + 9, ay - 1, 1, { ry: 2.6 });
    blush(b, s, ax - 12, ay + 2); blush(b, s, ax + 12, ay + 2);
    axoMouth(b, s.mouth, ax, ay + 4);
  }

  /* ───────────────────────── registry & render ───────────────────────── */
  const PETS = {
    mochi: {
      id: 'mochi', name: 'Mochi', species: 'Cat', accent: '#f6a55f', draw: drawCat,
      tagline: 'A sleepy tabby who is quietly convinced you are the best human alive.',
      traits: ['Cuddly', 'Curious', 'Loaf-prone'], height: 38, mouthY: 16, shadowW: 11, treat: 'fish', idle: ['earTwitch', 'tailFlick'], top: 18, head: 34,
    },
    waddle: {
      id: 'waddle', name: 'Waddle', species: 'Penguin', accent: '#7f8cff', draw: drawPenguin,
      tagline: 'A tiny tuxedo-wearing optimist who gives out pebbles and good vibes.',
      traits: ['Cheerful', 'Loyal', 'Slidey'], height: 34, mouthY: 17, shadowW: 11, treat: 'fish', idle: ['flap'], top: 22, head: 34,
    },
    axo: {
      id: 'axo', name: 'Axo', species: 'Axolotl', accent: '#ff7aa8', draw: drawAxo,
      tagline: 'A forever-smiling water dragon with fluffy gills and a very big heart.',
      traits: ['Gentle', 'Smiley', 'Wiggly'], height: 24, mouthY: 8, shadowW: 14, treat: 'shrimp', idle: ['gillWave', 'tailFlick'], top: 30, head: 44,
    },
  };

  const list = Object.values(PETS);
  const get = (id) => PETS[id] || PETS.mochi;

  /** Draw a pet into buf from a (partial) state object. */
  function render(buf, id, state) {
    const pet = get(id);
    const s = Object.assign({}, DEFAULTS, state);
    buf.clear();
    const air = Math.max(0, -s.oy), k = Math.max(0.5, 1 - air / 24) * (s.held ? 0.8 : 1);
    buf.ellipse(CX + 0.5, FEET + 0.5, pet.shadowW * k * Math.max(0.6, Math.abs(s.sx)), 2.4 * k, '#2a1b4d55');
    pet.draw(new Rig(buf, CX + 0.5, FEET, { sx: s.sx, sy: s.sy, ox: s.ox, oy: s.oy }), s);
    return buf;
  }

  return { BUF, CX, FEET, PETS, list, get, render, DEFAULTS };
});
