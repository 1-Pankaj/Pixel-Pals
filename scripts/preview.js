'use strict';
/**
 * npm run preview  ->  writes build/preview.png: every pet in every expression.
 * Handy when you tweak sprites, no Electron needed.
 */
const fs = require('fs');
const path = require('path');
const { PixelBuffer } = require('../src/shared/pixel');
const Pets = require('../src/shared/pets');
const { encodePNG, upscale } = require('../src/shared/png');

const STATES = [
  { name: 'idle' },
  { name: 'happy', eyes: 'happy', mouth: 'open', blush: 0.9 },
  { name: 'wide', eyes: 'wide', mouth: 'o' },
  { name: 'look', lookX: 1, lookY: -0.6 },
  { name: 'sleepy', eyes: 'sleepy', mouth: 'yawn', sleepy: 1 },
  { name: 'sleep', eyes: 'sleep', mouth: 'sleep', sleepy: 1 },
  { name: 'love', eyes: 'love', mouth: 'tongue', blush: 1 },
  { name: 'sad', eyes: 'sad', mouth: 'frown' },
  { name: 'dizzy', eyes: 'dizzy', mouth: 'o' },
  { name: 'held', eyes: 'wide', mouth: 'o', held: 1, swing: 0.6, oy: -8 },
  { name: 'walk', walking: 1, step: 1.3, ox: 1 },
  { name: 'squash', sy: 0.86, sx: 1.1, eyes: 'squint', mouth: 'flat' },
];

const COLS = 6, K = 3, CELL = Pets.BUF * K;
const rows = Math.ceil(STATES.length / COLS) * Pets.list.length;
const W = COLS * CELL, H = rows * CELL;
const sheet = new Uint8ClampedArray(W * H * 4);

// soft checker background so outlines and shadows read clearly
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 4, c = (((x / 24) | 0) + ((y / 24) | 0)) % 2 ? [221, 228, 246] : [233, 238, 251];
  sheet[i] = c[0]; sheet[i + 1] = c[1]; sheet[i + 2] = c[2]; sheet[i + 3] = 255;
}

const buf = new PixelBuffer(Pets.BUF, Pets.BUF);
let row = 0;
for (const pet of Pets.list) {
  STATES.forEach((st, n) => {
    Pets.render(buf, pet.id, Object.assign({ t: 1.1 }, st));
    const up = upscale(buf.data, buf.w, buf.h, K);
    const cx = (n % COLS) * CELL, cy = (row + Math.floor(n / COLS)) * CELL;
    for (let y = 0; y < up.h; y++) for (let x = 0; x < up.w; x++) {
      const s = (y * up.w + x) * 4, d = ((cy + y) * W + cx + x) * 4, a = up.data[s + 3] / 255;
      if (!a) continue;
      for (let k = 0; k < 3; k++) sheet[d + k] = up.data[s + k] * a + sheet[d + k] * (1 - a);
    }
  });
  row += Math.ceil(STATES.length / COLS);
}

const out = path.join(__dirname, '..', 'build');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'preview.png'), encodePNG(W, H, sheet));
console.log('wrote build/preview.png', W + 'x' + H);
