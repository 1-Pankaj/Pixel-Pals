/* Pure WebAudio synthesize engine adapted for Pixel Pals website */

let ctx = null;
let master = null;
let enabled = true;

function ac() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.55;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value = 12;
      comp.ratio.value = 6;
      comp.attack.value = 0.004;
      comp.release.value = 0.18;
      master.connect(comp).connect(ctx.destination);
    } catch (e) { return null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function pluck(freq, dur, vol, when, opts = {}) {
  const a = ac(); if (!a || !enabled) return;
  const t0 = a.currentTime + (when || 0);
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + (opts.attack || 0.012));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const o = a.createOscillator();
  o.type = opts.type || 'triangle';
  o.frequency.setValueAtTime(freq, t0);
  if (opts.slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(30, opts.slideTo), t0 + dur);
  const lp = a.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = opts.cutoff || 2400;
  o.connect(g).connect(lp).connect(master);
  o.start(t0); o.stop(t0 + dur + 0.05);
  if (!opts.noHarm) {
    const g2 = a.createGain();
    g2.gain.setValueAtTime(0.0001, t0);
    g2.gain.exponentialRampToValueAtTime(vol * 0.28, t0 + 0.015);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.7);
    const o2 = a.createOscillator();
    o2.type = 'sine';
    o2.frequency.setValueAtTime(freq * 2, t0);
    o2.connect(g2).connect(lp);
    o2.start(t0); o2.stop(t0 + dur);
  }
}

function bell(freq, dur, vol, when) {
  const a = ac(); if (!a || !enabled) return;
  const t0 = a.currentTime + (when || 0);
  [[1, vol], [2.01, vol * 0.22], [2.99, vol * 0.08]].forEach(([mult, v]) => {
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    const o = a.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq * mult, t0);
    o.connect(g).connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  });
}

function noise(dur, vol, when, opts = {}) {
  const a = ac(); if (!a || !enabled) return;
  const t0 = a.currentTime + (when || 0);
  const len = Math.max(1, Math.floor(a.sampleRate * dur));
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = opts.type || 'bandpass';
  f.frequency.setValueAtTime(opts.freq || 800, t0);
  if (opts.sweepTo) f.frequency.exponentialRampToValueAtTime(opts.sweepTo, t0 + dur);
  f.Q.value = opts.q || 1;
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + (opts.attack || 0.02));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t0); src.stop(t0 + dur + 0.05);
}

function wobble(freq, dur, vol, when, wobbleHz) {
  const a = ac(); if (!a || !enabled) return;
  const t0 = a.currentTime + (when || 0);
  const o = a.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(freq, t0);
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.06);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const lfo = a.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = wobbleHz || 22;
  const lfoG = a.createGain();
  lfoG.gain.value = vol * 0.55;
  lfo.connect(lfoG).connect(g.gain);
  const lp = a.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 900;
  o.connect(g).connect(lp).connect(master);
  o.start(t0); lfo.start(t0);
  o.stop(t0 + dur + 0.05); lfo.stop(t0 + dur + 0.05);
}

const P = {
  c5: 523.25, d5: 587.33, e5: 659.25, g5: 784, a5: 880, c6: 1046.5, e6: 1318.5,
  c4: 261.63, e4: 329.63, g4: 392, a4: 440
};

export const PET_SFX = {
  setEnabled(v) { enabled = !!v; },
  unlock() { ac(); },
  pop() { pluck(P.e5, 0.1, 0.1, 0, { cutoff: 1800 }); pluck(P.g5, 0.09, 0.07, 0.05, { cutoff: 1800 }); },
  boop() { pluck(P.c5, 0.12, 0.13, 0, { type: 'sine', cutoff: 1500 }); },
  purr() { wobble(170, 0.42, 0.09, 0, 24); pluck(P.g4, 0.2, 0.05, 0.02, { cutoff: 1200 }); },
  boing() { pluck(240, 0.16, 0.09, 0, { slideTo: 520, cutoff: 1400 }); },
  chime() { bell(P.c5, 0.28, 0.09); bell(P.e5, 0.26, 0.08, 0.09); bell(P.g5, 0.4, 0.08, 0.18); },
  sparkle() { pluck(P.e5, 0.09, 0.06, 0); pluck(P.g5, 0.09, 0.06, 0.07); pluck(P.c6, 0.14, 0.06, 0.14); },
  giggle() { pluck(P.a5, 0.07, 0.07, 0, { cutoff: 2200 }); pluck(P.c6, 0.09, 0.07, 0.08, { cutoff: 2200 }); },
  munch() {
    noise(0.07, 0.07, 0, { freq: 900, q: 0.8, sweepTo: 400 });
    noise(0.05, 0.05, 0.09, { freq: 700, q: 0.9, sweepTo: 300 });
  },
  dance() {
    const seq = [[P.c5, 0], [P.e5, 0.12], [P.g5, 0.24], [P.e5, 0.36], [P.a5, 0.48], [P.g5, 0.62], [P.c6, 0.76]];
    seq.forEach(([f, t]) => pluck(f, 0.14, 0.075, t, { cutoff: 2600 }));
  },
  blip(ch) {
    if (!ch) return;
    const c = ch.toLowerCase().charCodeAt(0);
    if (c < 97 || c > 122) return;
    const notes = [261.63, 293.66, 329.63, 392, 440];
    const f = notes[(c - 97) % 5] * 2;
    pluck(f, 0.05, 0.02, 0, { cutoff: 3200, noHarm: true });
  },
  click() { pluck(P.e6, 0.06, 0.07, 0, { cutoff: 3000, noHarm: true }); },
  fanfare() {
    const seq = [[P.c5, 0], [P.e5, 0.11], [P.g5, 0.22], [P.c6, 0.33]];
    seq.forEach(([f, t], i) => bell(f, i === 3 ? 0.6 : 0.22, 0.09, t));
  },
  drum() { for (let i = 0; i < 7; i++) noise(0.045, 0.05, i * 0.062, { freq: 620, q: 1.1, attack: 0.004 }); },
  correct() { bell(P.e5, 0.22, 0.09); bell(P.a5, 0.34, 0.08, 0.12); },
  bell() { bell(P.g4, 0.5, 0.1); bell(P.c5, 0.7, 0.09, 0.18); }
};
