/**
 * Everything that is not the pet itself but lives in the same 64x64 pixel space:
 * hearts, zzz, sparkles, notes, sweat drops, dizzy stars, treats and thought clouds.
 * Each icon is a tiny ASCII bitmap, outlined so it stays readable on any desktop.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Effects = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const ICONS = {
    heart: { rows: ['.rr.rr.', 'rhrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'], pal: { r: '#ff5c8a', h: '#ffc9d9' }, line: '#a3204f' },
    heartS: { rows: ['.r.r.', 'rrrrr', 'rrrrr', '.rrr.', '..r..'], pal: { r: '#ff7ba0' }, line: '#a3204f' },
    sparkle: { rows: ['..y..', '..w..', 'ywwwy', '..w..', '..y..'], pal: { y: '#ffe36e', w: '#ffffff' }, line: '#c98a1a' },
    twinkle: { rows: ['.y.', 'yyy', '.y.'], pal: { y: '#fff3a6' }, line: '#d9a022' },
    star: { rows: ['..y..', '..y..', 'yyyyy', '.yyy.', 'yy.yy'], pal: { y: '#ffd84a' }, line: '#b9801a' },
    note: { rows: ['..x..', '..xx.', '..x.x', '..x..', '..x..', 'xxx..', 'xxx..'], pal: { x: '#7a6cff' }, line: '#2f2a7a' },
    drop: { rows: ['.b.', '.b.', 'bbb', 'bbb', '.b.'], pal: { b: '#8fd8ff' }, line: '#2b78b8' },
    bang: { rows: ['rr', 'rr', 'rr', 'rr', '..', 'rr'], pal: { r: '#ff4d5e' }, line: '#8f1630' },
    ask: { rows: ['.rrr.', 'r...r', '...r.', '..r..', '.....', '..r..'], pal: { r: '#ffa23a' }, line: '#8f4a10' },
    zS: { rows: ['xxx', '..x', '.x.', 'xxx'], pal: { x: '#f4f6ff' }, line: '#4a50b8' },
    zM: { rows: ['xxxx', '...x', '..x.', '.x..', 'xxxx'], pal: { x: '#f4f6ff' }, line: '#4a50b8' },
    zL: { rows: ['xxxxx', '....x', '...x.', '..x..', '.x...', 'xxxxx'], pal: { x: '#f4f6ff' }, line: '#4a50b8' },
    crumb: { rows: ['o'], pal: { o: '#f1b46c' }, line: null },
    pebble: { rows: ['.gg.', 'gggg', 'gggg'], pal: { g: '#aab2d6' }, line: '#5d6591' },
  };

  function bitmap(buf, name, x, y) {
    const ic = ICONS[name];
    if (!ic) return;
    x = Math.round(x); y = Math.round(y);
    const paint = (s) => {
      for (let j = 0; j < ic.rows.length; j++) {
        const row = ic.rows[j];
        for (let i = 0; i < row.length; i++) if (row[i] !== '.') s.set(x + i, y + j, ic.pal[row[i]]);
      }
    };
    if (ic.line) buf.part(paint, ic.line); else paint(buf);
  }
  const size = (name) => ({ w: ICONS[name].rows[0].length, h: ICONS[name].rows.length });
  const centred = (buf, name, cx, cy) => { const s = size(name); bitmap(buf, name, cx - s.w / 2, cy - s.h / 2); };

  /* ───────────── treats ───────────── */
  function treat(buf, kind, x, y, spin) {
    x = Math.round(x); y = Math.round(y);
    if (kind === 'shrimp') {
      buf.part((s) => {
        s.ellipse(x - 3, y + 1, 2.2, 2.2, '#ff9b78'); s.ellipse(x - 0.5, y - 0.4, 2.4, 2.2, '#ffab8a');
        s.ellipse(x + 2.6, y - 0.2, 2.2, 2, '#ff9b78'); s.ellipse(x + 4.6, y + 1.8, 1.8, 1.8, '#ff8564');
        s.tri(x + 5, y + 2.5, x + 8, y + 1, x + 7.5, y + 4.8, '#ff6f4f');
        s.set(x - 4, y, '#2a1a30'); s.set(x - 5, y + 2, '#ffd2bf');
      }, '#9b3a2a');
    } else {
      const f = Math.sin(spin || 0) * 0.6;
      buf.part((s) => {
        s.ellipse(x, y, 4.4, 2.6, '#8fd0ff', f);
        s.ellipse(x - 0.4, y + 0.9, 3.4, 1.2, '#d3edff', f);
        s.tri(x + 3.5, y, x + 7.4, y - 3, x + 7.4, y + 3, '#58aef2');
        s.set(x - 2, y - 1, '#1b2a4a'); s.set(x + 0, y - 1, '#58aef2'); s.set(x + 1, y, '#58aef2');
      }, '#2c5c9e');
    }
  }

  /* ───────────── thought cloud ───────────── */
  function thought(buf, cx, cy, icon) {
    cx = Math.round(cx); cy = Math.round(cy);
    buf.part((s) => {
      s.ellipse(cx, cy, 8, 5.4, '#ffffff'); s.ellipse(cx - 5, cy + 1, 4.4, 3.8, '#ffffff'); s.ellipse(cx + 5.5, cy + 1, 4.4, 3.8, '#ffffff');
      s.ellipse(cx - 8, cy + 8, 1.9, 1.9, '#ffffff'); s.ellipse(cx - 10.5, cy + 11.5, 1.1, 1.1, '#ffffff');
    }, '#6d72b8');
    if (icon === 'fish' || icon === 'shrimp') treat(buf, icon, cx - 1, cy, 0);
    else centred(buf, icon, cx, cy);
  }

  /* ───────────── particles ───────────── */
  class Particles {
    constructor(rand) { this.list = []; this.R = rand || Math.random; }
    clear() { this.list.length = 0; }
    get length() { return this.list.length; }

    add(p) { if (this.list.length < 60) this.list.push(Object.assign({ t: 0, vx: 0, vy: 0, ax: 0, ay: 0, life: 1, sway: 0, rate: 0, icon: 'heart' }, p)); }

    heart(x, y, big) { this.add({ kind: 'float', icon: big ? 'heart' : 'heartS', x, y, vy: -9 - this.R() * 5, vx: (this.R() - 0.5) * 6, life: 1.5 + this.R() * 0.4, sway: 2.2 }); }
    hearts(x, y, n, spread) { for (let i = 0; i < n; i++) this.add({ kind: 'float', icon: i % 2 ? 'heartS' : 'heart', x: x + (this.R() - 0.5) * (spread || 14), y: y - this.R() * 3, vy: -8 - this.R() * 6, vx: (this.R() - 0.5) * 5, life: 1.2 + this.R() * 0.7, sway: 2, delay: i * 0.12 }); }
    sparkles(x, y, n, spread) { for (let i = 0; i < n; i++) this.add({ kind: 'twinkle', icon: 'sparkle', x: x + (this.R() - 0.5) * (spread || 22), y: y + (this.R() - 0.5) * (spread || 22) * 0.8, life: 0.7 + this.R() * 0.5, delay: this.R() * 0.4 }); }
    note(x, y) { this.add({ kind: 'float', icon: 'note', x, y, vy: -9, vx: (this.R() - 0.5) * 8, life: 1.7, sway: 3 }); }
    zzz(x, y, step) { this.add({ kind: 'float', icon: ['zS', 'zM', 'zL'][step % 3], x, y, vy: -6.5, vx: 3.2, life: 2.3, sway: 1.2 }); }
    drop(x, y) { this.add({ kind: 'fall', icon: 'drop', x, y, vy: 6, ay: 40, vx: 6, life: 0.8 }); }
    bang(x, y) { this.add({ kind: 'bob', icon: 'bang', x, y, life: 1.0 }); }
    ask(x, y) { this.add({ kind: 'bob', icon: 'ask', x, y, life: 1.2 }); }
    puff(x, y, n) { for (let i = 0; i < (n || 4); i++) { const a = (i / (n || 4)) * Math.PI * 2; this.add({ kind: 'puff', x, y, vx: Math.cos(a) * 14, vy: Math.sin(a) * 6 - 2, life: 0.45 }); } }
    crumbs(x, y, n) { for (let i = 0; i < n; i++) this.add({ kind: 'fall', icon: 'crumb', x, y, vx: (this.R() - 0.5) * 30, vy: -14 - this.R() * 14, ay: 90, life: 0.55 }); }
    stars(cx, cy, life) { for (let i = 0; i < 3; i++) this.add({ kind: 'orbit', icon: 'star', cx, cy, ang: (i / 3) * Math.PI * 2, rx: 11, ry: 3.4, life: life || 1.6, x: cx, y: cy }); }

    update(dt) {
      for (let i = this.list.length - 1; i >= 0; i--) {
        const p = this.list[i];
        if (p.delay > 0) { p.delay -= dt; continue; }
        p.t += dt;
        if (p.t >= p.life) { this.list.splice(i, 1); continue; }
        if (p.kind === 'orbit') { p.ang += dt * 5.5; p.x = p.cx + Math.cos(p.ang) * p.rx; p.y = p.cy + Math.sin(p.ang) * p.ry; p.back = Math.sin(p.ang) < 0; continue; }
        p.vx += p.ax * dt; p.vy += p.ay * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
      }
    }

    draw(buf) {
      for (const p of this.list) {
        if (p.delay > 0) continue;
        const k = p.t / p.life, ending = k > 0.78 && Math.floor(p.t * 16) % 2 === 0;
        if (ending) continue;
        let x = p.x, y = p.y;
        switch (p.kind) {
          case 'float': x += Math.sin(p.t * 5 + p.life * 9) * p.sway; centred(buf, p.icon, x, y); break;
          case 'twinkle': centred(buf, k < 0.25 || k > 0.7 ? 'twinkle' : 'sparkle', x, y); break;
          case 'bob': centred(buf, p.icon, x, y + (Math.floor(p.t * 10) % 2 ? -1 : 0)); break;
          case 'puff': { const r = 1 + k * 2.4; buf.ellipse(x, y, r, r * 0.8, k < 0.5 ? '#ffffff' : '#dfe3ff'); break; }
          case 'orbit': centred(buf, p.icon, x, y); break;
          default: centred(buf, p.icon, x, y);
        }
      }
    }
  }

  return { ICONS, bitmap, centred, treat, thought, Particles, size };
});
