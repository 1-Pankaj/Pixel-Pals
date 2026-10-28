/**
 * Little animated pixel habitats (80x72) drawn behind each pet on the Pet Home cards.
 * The pet sprite (64x64) is composited at (8, 8) so its feet land on the ground line.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Scenes = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const W = 80, H = 72, PET_X = 8, PET_Y = 8;

  /** A sunny room: striped wallpaper, a window, wooden floor, a rug and a ball of yarn. */
  function mochi(b, t) {
    b.rect(0, 0, W, 54, '#ffe6c7');
    for (let x = 0; x < W; x += 10) b.rect(x, 0, 2, 54, '#ffdcb4');
    b.rect(0, 50, W, 4, '#f1c796'); b.rect(0, 54, W, 1, '#c99359');
    b.rect(0, 55, W, H - 55, '#e0a569');
    for (let y = 61; y < H; y += 6) b.rect(0, y, W, 1, '#c98f56');
    for (let r = 0; r < 3; r++) for (let x = (r % 2) * 10 + 4; x < W; x += 20) b.rect(x, 55 + r * 6, 1, 6, '#c98f56');
    // window and the sunbeam it throws on the floor
    b.rect(5, 5, 26, 26, '#fff7e8'); b.rect(7, 7, 22, 22, '#bfe4ff');
    b.rect(17, 7, 2, 22, '#fff7e8'); b.rect(7, 17, 22, 2, '#fff7e8');
    b.rect(9, 9, 6, 3, '#e6f5ff'); b.rect(21, 21, 6, 3, '#9fd0f5');
    b.tri(12, 56, 40, 56, 24, H, [255, 242, 190, 55]);
    if (Math.floor(t * 1.6) % 2) { b.set(11, 10, '#ffffff'); b.set(26, 25, '#ffffff'); }
    // rug
    b.ellipse(40, 66, 31, 5.6, '#f27c95'); b.ellipse(40, 66, 27, 4.4, '#ffa7b9'); b.ellipse(40, 66, 16, 2.6, '#f27c95');
    // yarn
    b.part((s) => { s.ellipse(67, 63, 4.2, 4, '#ff6b81'); s.set(64, 61, '#ffa5b4'); s.line(63, 64, 71, 62, '#d9475f'); s.line(64, 66, 70, 60, '#d9475f'); }, '#9c2a42');
    // picture frame on the wall
    b.rect(46, 14, 14, 11, '#b9824f'); b.rect(47, 15, 12, 9, '#ffe0e8'); b.set(53, 19, '#ff7ba0'); b.set(52, 18, '#ff7ba0'); b.set(54, 18, '#ff7ba0'); b.set(53, 20, '#ff7ba0');
  }

  /** A snowfield with soft mountains, falling snow, a block of ice and a few pebbles. */
  function waddle(b, t) {
    ['#8fb8ff', '#a2c3ff', '#b7d1ff', '#cde0ff', '#e0ecff', '#eff6ff'].forEach((c, i) => b.rect(0, i * 9, W, 9, c));
    b.tri(-8, 54, 14, 26, 36, 54, '#c9d8fb'); b.tri(18, 54, 46, 20, 74, 54, '#bccdf8'); b.tri(52, 54, 72, 30, 92, 54, '#c9d8fb');
    b.tri(40, 28, 46, 20, 52, 28, '#f4f8ff'); b.tri(9, 33, 14, 26, 19, 33, '#f4f8ff');
    b.rect(0, 54, W, H - 54, '#f7fbff'); b.rect(0, 54, W, 1, '#ffffff');
    for (let x = 3; x < W; x += 13) b.rect(x, 62 + ((x / 13) % 2) * 4, 7, 1, '#dbe7ff');
    b.ellipse(40, 66, 30, 4, '#e6efff');
    b.part((s) => { s.rect(3, 55, 11, 9, '#bfe6ff'); s.rect(4, 56, 3, 2, '#f1fbff'); s.rect(10, 61, 3, 2, '#98d0f0'); }, '#5f9ccc');
    b.part((s) => { s.ellipse(63, 64, 3.2, 2, '#aab2d6'); s.ellipse(69, 66, 2.6, 1.6, '#9aa3c9'); s.ellipse(59, 67, 2, 1.3, '#b8c0e0'); }, '#5d6591');
    for (let i = 0; i < 18; i++) {
      const x = ((i * 29) % 80) + Math.sin(t * 0.9 + i) * 2, y = ((i * 17) % 72 + t * (5 + (i % 3) * 3)) % 72;
      b.set(x, y, i % 4 === 0 ? '#ffffff' : [255, 255, 255, 190]);
      if (i % 5 === 0) b.set(x + 1, y, '#ffffff');
    }
  }

  /** A pond: light rays, a sandy bottom, rocks, swaying weed and rising bubbles. */
  function axo(b, t) {
    ['#d5f6f0', '#c2f0ea', '#aee9e4', '#99e0e0', '#85d5d9', '#72c9d3', '#62bccb', '#55aec3'].forEach((c, i) => b.rect(0, i * 9, W, 9, c));
    for (let i = 0; i < 4; i++) { const x0 = 6 + i * 20 + Math.sin(t * 0.5 + i) * 3; b.tri(x0, 0, x0 + 8, 0, x0 + 24, 58, [255, 255, 255, 30]); }
    b.rect(0, 59, W, H - 59, '#f3e0b8'); b.rect(0, 59, W, 1, '#fff3d6');
    for (let x = 2; x < W; x += 7) b.set(x + (x % 3), 63 + (x % 4) * 2, '#d9c18c');
    b.part((s) => { s.ellipse(8, 60, 6.5, 3.6, '#8fa0ba'); s.ellipse(16, 62, 4, 2.4, '#7d8ea8'); s.set(6, 58, '#b9c5da'); s.set(7, 58, '#b9c5da'); }, '#4b5873');
    for (let bi = 0; bi < 3; bi++) {
      const bx = 65 + bi * 5;
      for (let j = 0; j <= 15 - bi * 2; j++) {
        const x = Math.round(bx + Math.sin(t * 1.6 + j * 0.45 + bi) * (j * 0.16));
        b.set(x, 59 - j, '#3fba7f'); b.set(x + 1, 59 - j, '#2c9a66');
      }
    }
    for (let i = 0; i < 7; i++) {
      const x = 10 + i * 10 + Math.sin(t + i * 1.7) * 2, y = 70 - ((t * 7 + i * 13) % 68), r = 1.2 + (i % 3) * 0.55;
      b.part((s) => s.ellipse(x, y, r, r, [255, 255, 255, 110]), '#9fe9ee'); b.set(x - 0.5, y - 0.5, '#ffffff');
    }
  }

  const SCENES = { mochi, waddle, axo };
  /** Paint the habitat for a pet into buf (clears it first). */
  function draw(buf, id, t) { buf.clear(); (SCENES[id] || mochi)(buf, t || 0); }

  return { W, H, PET_X, PET_Y, draw };
});
