'use strict';
/**
 * Builds app/tray icons straight from the sprites: no image files to ship.
 * png(petId, size) -> Buffer     ico(petId) -> Buffer (multi-size, PNG-compressed)
 */
const { PixelBuffer } = require('./pixel');
const Pets = require('./pets');
const { encodePNG } = require('./png');

const MASTER = 256;
const cache = new Map();

/** Render the pet's happy face, crop to its silhouette, scale up with nearest neighbour, centre on a square. */
function master(petId) {
  if (cache.has(petId)) return cache.get(petId);
  const buf = new PixelBuffer(Pets.BUF, Pets.BUF);
  Pets.render(buf, petId, { t: 1.1, eyes: 'happy', mouth: 'open', blush: 0.85 });
  const d = buf.data;
  let x0 = 99, y0 = 99, x1 = -1, y1 = -1;
  for (let y = 0; y < buf.h; y++) {
    for (let x = 0; x < buf.w; x++) {
      const i = (y * buf.w + x) * 4;
      if (d[i + 3] < 200) { d[i + 3] = 0; continue; }          // drop the soft ground shadow
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
  const w = x1 - x0 + 1, h = y1 - y0 + 1, side = Math.max(w, h) + 4;
  const k = Math.max(1, Math.floor((MASTER * 0.92) / side));
  const out = new Uint8ClampedArray(MASTER * MASTER * 4);
  const offX = Math.floor((MASTER - w * k) / 2), offY = Math.floor((MASTER - h * k) / 2);
  for (let y = 0; y < h * k; y++) {
    for (let x = 0; x < w * k; x++) {
      const s = ((y0 + ((y / k) | 0)) * buf.w + x0 + ((x / k) | 0)) * 4, o = ((offY + y) * MASTER + offX + x) * 4;
      out[o] = d[s]; out[o + 1] = d[s + 1]; out[o + 2] = d[s + 2]; out[o + 3] = d[s + 3];
    }
  }
  cache.set(petId, out);
  return out;
}

/** Area-average (box) downscale with premultiplied alpha, so small icons stay clean. */
function resample(src, sw, sh, dw, dh) {
  const out = new Uint8ClampedArray(dw * dh * 4), rx = sw / dw, ry = sh / dh;
  for (let dy = 0; dy < dh; dy++) {
    for (let dx = 0; dx < dw; dx++) {
      const xa = dx * rx, xb = xa + rx, ya = dy * ry, yb = ya + ry;
      let r = 0, g = 0, b = 0, a = 0, wsum = 0;
      for (let sy = Math.floor(ya); sy < Math.ceil(yb); sy++) {
        const wy = Math.min(sy + 1, yb) - Math.max(sy, ya);
        for (let sx = Math.floor(xa); sx < Math.ceil(xb); sx++) {
          const w = wy * (Math.min(sx + 1, xb) - Math.max(sx, xa)), i = (sy * sw + sx) * 4, al = src[i + 3] / 255;
          r += src[i] * al * w; g += src[i + 1] * al * w; b += src[i + 2] * al * w; a += al * w; wsum += w;
        }
      }
      const o = (dy * dw + dx) * 4;
      if (a > 0) { out[o] = r / a; out[o + 1] = g / a; out[o + 2] = b / a; }
      out[o + 3] = (a / wsum) * 255;
    }
  }
  return out;
}

function png(petId, size) {
  size = size || 256;
  const m = master(petId);
  return encodePNG(size, size, size === MASTER ? m : resample(m, MASTER, MASTER, size, size));
}

/** Windows .ico with several PNG-compressed sizes (256 down to 16). */
function ico(petId) {
  const sizes = [256, 128, 64, 48, 32, 24, 16];
  const images = sizes.map((s) => png(petId, s));
  const head = Buffer.alloc(6 + 16 * sizes.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let offset = head.length;
  sizes.forEach((s, i) => {
    const e = 6 + 16 * i;
    head[e] = s === 256 ? 0 : s; head[e + 1] = s === 256 ? 0 : s; head[e + 2] = 0; head[e + 3] = 0;
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(images[i].length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += images[i].length;
  });
  return Buffer.concat([head].concat(images));
}

module.exports = { png, ico };
