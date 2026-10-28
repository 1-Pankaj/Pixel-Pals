/**
 * Tiny software pixel rasteriser used by every sprite in the app.
 * Works in Node (icons, previews) and in the browser (the live pet).
 * No dependencies, no image files: every pixel is computed.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Pixel = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const cache = new Map();

  /** '#rgb' | '#rrggbb' | '#rrggbbaa' | [r,g,b,a] -> [r,g,b,a] */
  function rgba(c) {
    if (typeof c !== 'string') return c;
    let v = cache.get(c);
    if (v) return v;
    let h = c[0] === '#' ? c.slice(1) : c;
    if (h.length <= 4) h = h.split('').map((x) => x + x).join('');
    v = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length >= 8 ? parseInt(h.slice(6, 8), 16) : 255];
    cache.set(c, v);
    return v;
  }

  function hexToHsl(hex) {
    const [r, g, b] = rgba(hex).slice(0, 3).map((v) => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return [h, s, l];
  }

  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    const to = (v) => Math.round(clamp(v + m, 0, 1) * 255).toString(16).padStart(2, '0');
    return '#' + to(r) + to(g) + to(b);
  }

  /** Build a hue-shifted palette ramp (shadows lean purple, highlights lean warm). */
  function ramp(hex) {
    const [h, s, l] = hexToHsl(hex);
    const d = ((260 - h + 540) % 360) - 180;
    const sd = Math.sign(d) * Math.min(Math.abs(d) * 0.15, 12);
    const mk = (dh, ds, dl) => hslToHex(h + dh, clamp(s + ds, 0, 1), clamp(l + dl, 0.03, 0.97));
    return {
      hi: mk(-sd * 0.5, -0.06, 0.17),
      light: mk(-sd * 0.25, -0.02, 0.08),
      base: hex,
      shade: mk(sd, 0.05, -0.11),
      deep: mk(sd * 1.5, 0.08, -0.22),
      line: mk(sd * 2, 0.1, -0.4),
    };
  }

  class PixelBuffer {
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.data = new Uint8ClampedArray(w * h * 4);
      this._s = null;
      this._a = null;
    }

    clear() { this.data.fill(0); return this; }

    alpha(x, y) { return x < 0 || y < 0 || x >= this.w || y >= this.h ? 0 : this.data[(y * this.w + x) * 4 + 3]; }

    set(x, y, c) {
      x = Math.floor(x); y = Math.floor(y);
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      const col = rgba(c), d = this.data, i = (y * this.w + x) * 4, a = col[3];
      if (a === 255 || d[i + 3] === 0) { d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = a; return; }
      const fa = a / 255, da = d[i + 3] / 255, oa = fa + da * (1 - fa);
      d[i] = (col[0] * fa + d[i] * da * (1 - fa)) / oa;
      d[i + 1] = (col[1] * fa + d[i + 1] * da * (1 - fa)) / oa;
      d[i + 2] = (col[2] * fa + d[i + 2] * da * (1 - fa)) / oa;
      d[i + 3] = oa * 255;
    }

    rect(x, y, w, h, c) {
      x = Math.round(x); y = Math.round(y);
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    }

    line(x0, y0, x1, y1, c) {
      x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
      let err = dx + dy;
      for (;;) {
        this.set(x0, y0, c);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
      }
    }

    /** Hard-edged (aliased) ellipse, optionally rotated. */
    ellipse(cx, cy, rx, ry, c, rot = 0) {
      if (rx <= 0.01 || ry <= 0.01) return;
      const cs = Math.cos(rot), sn = Math.sin(rot), m = Math.ceil(Math.max(rx, ry)) + 1;
      for (let y = Math.floor(cy - m); y <= Math.ceil(cy + m); y++) {
        for (let x = Math.floor(cx - m); x <= Math.ceil(cx + m); x++) {
          const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
          const u = (dx * cs + dy * sn) / rx, v = (-dx * sn + dy * cs) / ry;
          if (u * u + v * v <= 1) this.set(x, y, c);
        }
      }
    }

    /** Cel-shaded ellipse (sphere lit from the top-left) using a ramp palette. */
    sphere(cx, cy, rx, ry, pal, o, rot = 0) {
      o = o || {};
      if (rx <= 0.01 || ry <= 0.01) return;
      const L = o.light || [-0.42, -0.62, 0.66], T = o.t || [0.1, 0.55, 0.9];
      const cs = Math.cos(rot), sn = Math.sin(rot), m = Math.ceil(Math.max(rx, ry)) + 1;
      for (let y = Math.floor(cy - m); y <= Math.ceil(cy + m); y++) {
        for (let x = Math.floor(cx - m); x <= Math.ceil(cx + m); x++) {
          const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
          const u = (dx * cs + dy * sn) / rx, v = (-dx * sn + dy * cs) / ry, r2 = u * u + v * v;
          if (r2 > 1) continue;
          const nz = Math.sqrt(1 - r2), nx = u * cs - v * sn, ny = u * sn + v * cs;
          const i = nx * L[0] + ny * L[1] + nz * L[2];
          const col = i < T[0] ? pal.shade : i < T[1] ? pal.base : (i < T[2] || o.hi === false) ? pal.light : pal.hi;
          this.set(x, y, col);
        }
      }
    }

    tri(ax, ay, bx, by, cx, cy, c) {
      const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
      if (!area) return;
      const x0 = Math.floor(Math.min(ax, bx, cx)), x1 = Math.ceil(Math.max(ax, bx, cx));
      const y0 = Math.floor(Math.min(ay, by, cy)), y1 = Math.ceil(Math.max(ay, by, cy));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const px = x + 0.5, py = y + 0.5;
          const w0 = ((bx - px) * (cy - py) - (by - py) * (cx - px)) / area;
          const w1 = ((cx - px) * (ay - py) - (cy - py) * (ax - px)) / area;
          if (w0 >= 0 && w1 >= 0 && w0 + w1 <= 1) this.set(x, y, c);
        }
      }
    }

    /** Add a 1px outline on transparent pixels touching opaque ones. */
    outline(c, diag) {
      const w = this.w, h = this.h, d = this.data, hits = [];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (d[(y * w + x) * 4 + 3] !== 0) continue;
          if (this.alpha(x - 1, y) || this.alpha(x + 1, y) || this.alpha(x, y - 1) || this.alpha(x, y + 1) ||
            (diag && (this.alpha(x - 1, y - 1) || this.alpha(x + 1, y - 1) || this.alpha(x - 1, y + 1) || this.alpha(x + 1, y + 1)))) hits.push(x, y);
        }
      }
      for (let i = 0; i < hits.length; i += 2) this.set(hits[i], hits[i + 1], c);
    }

    /** Composite src over this. If atop, only where this is already opaque. */
    blit(src, atop) {
      const s = src.data, d = this.data;
      for (let i = 0; i < s.length; i += 4) {
        const a = s[i + 3];
        if (!a) continue;
        if (atop && !d[i + 3]) continue;
        if (a === 255) { d[i] = s[i]; d[i + 1] = s[i + 1]; d[i + 2] = s[i + 2]; d[i + 3] = 255; }
        else { const p = i >> 2; this.set(p % this.w, (p / this.w) | 0, [s[i], s[i + 1], s[i + 2], a]); }
      }
    }

    /** Composite a buffer of any size over this one at (ox, oy). */
    blitAt(src, ox, oy) {
      const s = src.data;
      for (let y = 0; y < src.h; y++) {
        for (let x = 0; x < src.w; x++) {
          const i = (y * src.w + x) * 4, a = s[i + 3];
          if (a) this.set(ox + x, oy + y, [s[i], s[i + 1], s[i + 2], a]);
        }
      }
    }

    /** Draw fn(scratch), outline it, then composite. Lets every body part own its outline. */
    part(fn, outline) {
      const s = this._s || (this._s = new PixelBuffer(this.w, this.h));
      s.clear();
      fn(s);
      if (outline) s.outline(outline);
      this.blit(s);
    }

    /** Draw fn(scratch) but only keep pixels that land on already-opaque pixels. */
    atop(fn) {
      const s = this._a || (this._a = new PixelBuffer(this.w, this.h));
      s.clear();
      fn(s);
      this.blit(s, true);
    }
  }

  /**
   * A Rig maps a local coordinate system (origin = feet centre, y up is negative)
   * onto the buffer, applying squash/stretch/offset so animation never breaks outlines.
   * dot()/rect() take horizontal PIXEL offsets from the centre column.
   */
  class Rig {
    constructor(buf, px, py, t) {
      t = t || {};
      this.b = buf; this.t = buf; this.px = px; this.py = py;
      this.sx = t.sx == null ? 1 : t.sx;
      this.sy = t.sy == null ? 1 : t.sy;
      this.ox = t.ox || 0; this.oy = t.oy || 0;
      this.ax = Math.max(0.05, Math.abs(this.sx));
      this.cx = Math.floor(px) + Math.round(this.ox);
    }
    X(x) { return this.px + this.ox + x * this.sx; }
    Y(y) { return this.py + this.oy + y * this.sy; }
    ell(cx, cy, rx, ry, c, rot) { this.t.ellipse(this.X(cx), this.Y(cy), rx * this.ax, ry * this.sy, c, (rot || 0) * (this.sx < 0 ? -1 : 1)); }
    ball(cx, cy, rx, ry, pal, o, rot) { this.t.sphere(this.X(cx), this.Y(cy), rx * this.ax, ry * this.sy, pal, o, (rot || 0) * (this.sx < 0 ? -1 : 1)); }
    tri(ax, ay, bx, by, cx, cy, c) { this.t.tri(this.X(ax), this.Y(ay), this.X(bx), this.Y(by), this.X(cx), this.Y(cy), c); }
    rect(dx, y, w, h, c) {
      const y0 = Math.round(this.Y(y)), y1 = Math.round(this.Y(y + h));
      this.t.rect(this.cx + Math.round(dx * this.sx), y0, Math.max(1, Math.round(w * this.ax)), Math.max(1, y1 - y0), c);
    }
    dot(dx, y, c) { this.t.set(this.cx + Math.round(dx * this.sx), Math.round(this.Y(y)), c); }
    part(outline, fn) { const prev = this.t; prev.part((s) => { this.t = s; fn(); }, outline); this.t = prev; }
    atop(fn) { const prev = this.t; prev.atop((s) => { this.t = s; fn(); }); this.t = prev; }
  }

  return { PixelBuffer, Rig, rgba, ramp, hexToHsl, hslToHex, clamp };
});
