/**
 * Tiny synthesised sound effects (WebAudio, no files). Off by default; the user opts in.
 * Each pet has its own "voice" pitch for the soft pop that plays when it speaks.
 */
(function (root) {
  'use strict';
  let ctx = null, enabled = false, voice = { freq: 540, type: 'triangle' }, lastTalk = 0;

  function ac() {
    if (!ctx) { const C = root.AudioContext || root.webkitAudioContext; if (!C) return null; ctx = new C(); }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  function tone(f0, f1, dur, type, vol, delay) {
    const a = ac(); if (!a) return;
    const t = a.currentTime + (delay || 0), o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.03);
  }
  function noise(dur, vol) {
    const a = ac(); if (!a) return;
    const n = Math.floor(a.sampleRate * dur), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = a.createBufferSource(), g = a.createGain(), f = a.createBiquadFilter();
    f.type = 'highpass'; f.frequency.value = 1800; g.gain.value = vol;
    s.buffer = b; s.connect(f); f.connect(g); g.connect(a.destination); s.start();
  }

  const SOUNDS = {
    talk() { const n = Date.now(); if (n - lastTalk < 400) return; lastTalk = n; tone(voice.freq, voice.freq * 1.3, 0.09, voice.type, 0.05); },
    pet() { tone(voice.freq * 1.2, voice.freq * 1.9, 0.14, 'sine', 0.07); },
    hop() { tone(240, 430, 0.1, 'square', 0.02); },
    land() { tone(170, 80, 0.09, 'sine', 0.05); },
    whoa() { tone(voice.freq * 1.7, voice.freq * 0.7, 0.3, 'triangle', 0.06); },
    tada() { [523, 659, 784].forEach((f, i) => tone(f, f, 0.15, 'square', 0.025, i * 0.08)); },
    crunch() { noise(0.09, 0.07); },
    chomp() { tone(210, 120, 0.06, 'square', 0.02); },
    happy() { tone(voice.freq, voice.freq * 1.5, 0.12, 'sine', 0.06); tone(voice.freq * 1.5, voice.freq * 2, 0.14, 'sine', 0.06, 0.1); },
  };

  root.Sound = {
    setEnabled(v) { enabled = !!v; },
    setVoice(v) { if (v) voice = v; },
    play(name) { if (enabled && SOUNDS[name]) { try { SOUNDS[name](); } catch (e) { /* audio is optional */ } } },
  };
})(typeof self !== 'undefined' ? self : this);
