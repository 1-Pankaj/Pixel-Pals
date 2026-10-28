/**
 * Pet window renderer. Glue between three things:
 *   - the brain (what the pet does),
 *   - the sprites (what it looks like),
 *   - the main process (where the cursor is, where the window is, and how to move it).
 */
(function () {
  'use strict';

  const api = window.petAPI;
  const $ = (s) => document.querySelector(s);
  const cv = $('#pet'), bubble = $('#bubble'), shown = $('#shown'), ghost = $('#ghost');

  const VOICES = {
    mochi: { freq: 540, type: 'triangle' },
    waddle: { freq: 430, type: 'triangle' },
    axo: { freq: 690, type: 'sine' },
  };

  const buf = new Pixel.PixelBuffer(Pets.BUF, Pets.BUF);
  let cfg = null, view = null, brain = null;
  let cpp = 4;                              // css pixels per sprite pixel
  let rect = { left: 0, top: 0, w: 256, h: 256 };
  let cur = null, lastPos = null;           // cursor payload from main, and where it last "really" moved
  let interactive = false, dragging = false, down = null, lastUp = 0;
  let bub = null, bubBox = null, dpr = window.devicePixelRatio || 1;

  const mapCfg = (s) => ({ chatty: s.chatty, roam: s.roam, look: s.lookAtCursor, sleep: s.sleepWhenIdle, reminders: s.reminders, fun: s.funContent });

  /* ───────────────────────── layout ───────────────────────── */
  function applyTheme() {
    const meta = Pets.get(cfg.pet);
    document.documentElement.style.setProperty('--accent', meta.accent);
    Sound.setVoice(VOICES[cfg.pet]);
  }

  function fit() {
    view.setScale(cfg.scale);
    cpp = view.fit();
    const r = cv.getBoundingClientRect();
    rect = { left: r.left, top: r.top, w: r.width, h: r.height };
    dpr = window.devicePixelRatio || 1;
    positionBubble(true);
  }

  /* ───────────────────────── speech bubble ───────────────────────── */
  function showBubble(ev) {
    if (bub) clearTimeout(bub.timer);
    bub = { text: ev.text, n: 0, t0: performance.now(), timer: setTimeout(hideBubble, ev.ms) };
    ghost.textContent = ev.text; shown.textContent = '';
    bubble.hidden = false;
    bubble.classList.remove('out', 'pop'); void bubble.offsetWidth; bubble.classList.add('pop');
    positionBubble(true);
  }

  function hideBubble() {
    if (!bub) return;
    clearTimeout(bub.timer);
    bub = null; bubBox = null;
    bubble.classList.remove('pop'); bubble.classList.add('out');
    setTimeout(() => { if (!bub) bubble.hidden = true; }, 170);
  }

  function typewriter(now) {
    if (!bub) return;
    const n = Math.min(bub.text.length, Math.floor(((now - bub.t0) / 1000) * 70));
    if (n !== bub.n) { bub.n = n; shown.textContent = bub.text.slice(0, n); ghost.textContent = bub.text.slice(n); }
  }

  let lastBubKey = '';
  function positionBubble(force) {
    if (!bub) return;
    const W = window.innerWidth, H = window.innerHeight, bw = bubble.offsetWidth, bh = bubble.offsetHeight, meta = Pets.get(brain.id);
    let bottom = rect.h - (meta.top - 9) * cpp + 9;
    let left = W / 2 - bw / 2;
    if (cur) {
      const topScreen = cur.wy + H - bottom - bh;
      if (topScreen < cur.dy + 4) bottom -= cur.dy + 4 - topScreen;                   // keep it on the screen
      const minL = Math.max(4, cur.dx - cur.wx + 8), maxL = Math.min(W - bw - 4, cur.dx + cur.dw - cur.wx - bw - 8);
      left = maxL < minL ? clamp(left, 4, W - bw - 4) : clamp(left, minL, maxL);
    }
    left = Math.round(left); bottom = Math.round(bottom);
    const tailX = Math.round(clamp(W / 2 - left - 12, 10, bw - 34));
    const key = left + '|' + bottom + '|' + tailX + '|' + bw + '|' + bh;
    if (force || key !== lastBubKey) {
      lastBubKey = key;
      bubble.style.left = left + 'px'; bubble.style.bottom = bottom + 'px';
      bubble.style.setProperty('--tail-x', tailX + 'px');
    }
    bubBox = { left, top: H - bottom - bh, right: left + bw, bottom: H - bottom };
  }

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ───────────────────────── input ───────────────────────── */
  function overPet(bx, by) {
    const x = Math.floor(bx), y = Math.floor(by);
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if (buf.alpha(x + i, y + j) > 120) return true;
    return false;
  }

  cv.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    down = { x: e.screenX, y: e.screenY };
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  cv.addEventListener('pointermove', (e) => {
    if (!down || dragging) return;
    if (Math.hypot(e.screenX - down.x, e.screenY - down.y) > 5) {
      dragging = true; document.body.classList.add('dragging');
      api.dragStart(); brain.grab();
    }
  });
  function endPointer(e) {
    if (!down) return;
    const was = dragging;
    down = null; dragging = false; document.body.classList.remove('dragging');
    try { cv.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    if (was) { api.dragEnd(); brain.drop(); return; }
    const now = performance.now();
    if (now - lastUp < 320) { lastUp = 0; brain.doubleClick(); } else { lastUp = now; brain.click(); }
  }
  cv.addEventListener('pointerup', endPointer);
  cv.addEventListener('pointercancel', endPointer);
  bubble.addEventListener('click', hideBubble);
  window.addEventListener('contextmenu', (e) => { e.preventDefault(); if (interactive) api.showMenu(); });
  window.addEventListener('blur', () => { if (dragging) { dragging = false; down = null; document.body.classList.remove('dragging'); api.dragEnd(); brain.drop(); } });

  /* ───────────────────────── frame loop ───────────────────────── */
  let last = performance.now();

  function frame(now) {
    requestAnimationFrame(frame);
    const sleeping = brain.state === 'sleep' && !brain.act;
    if (now - last < (sleeping ? 90 : 31)) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;

    let look = null, room = null, moved = false, hover = false, overBubble = false;
    if (cur) {
      const lx = cur.x - cur.wx, ly = cur.y - cur.wy;
      const bx = (lx - rect.left) / cpp, by = (ly - rect.top) / cpp;
      look = { dx: bx - 32, dy: by - Pets.get(brain.id).head };
      if (!lastPos || Math.hypot(cur.x - lastPos.x, cur.y - lastPos.y) > 3) { moved = !!lastPos; lastPos = { x: cur.x, y: cur.y }; }
      const cx = cur.wx + cur.ww / 2;
      room = { left: cx - (cur.ax + 30), right: cur.ax + cur.aw - 30 - cx };
      overBubble = !!(bub && bubBox && lx >= bubBox.left && lx <= bubBox.right && ly >= bubBox.top && ly <= bubBox.bottom);
      hover = !dragging && !overBubble && overPet(bx, by);
    }

    const want = hover || overBubble || dragging;
    if (want !== interactive) { interactive = want; api.setInteractive(want); }

    const pose = brain.update(dt, { look, cursorMoved: moved, hovering: hover, room });
    Pets.render(buf, brain.id, pose);
    brain.drawFx(buf);
    view.draw(buf);

    for (const ev of brain.out) {
      if (ev.type === 'say') showBubble(ev);
      else if (ev.type === 'walk') api.walk(ev.dx, ev.ms);
      else if (ev.type === 'walk-stop') api.walkStop();
      else if (ev.type === 'sound') Sound.play(ev.name);
    }
    brain.out.length = 0;

    typewriter(now);
    positionBubble(false);

    if ((window.devicePixelRatio || 1) !== dpr) fit();
  }

  /* ───────────────────────── start ───────────────────────── */
  async function start() {
    cfg = await api.getSettings();
    if (!cfg) return;
    view = Display.createView(cv, Pets.BUF, Pets.BUF, cfg.scale);
    brain = new PetBrain({ messages: Messages, pets: Pets.PETS, petId: cfg.pet, settings: mapCfg(cfg) });
    Sound.setEnabled(cfg.sound);
    applyTheme();
    fit();

    api.onCursor((c) => { cur = c; });
    api.onDrag((d) => brain.dragMove(d.vx));
    api.onWalkDone(() => brain.walkDone());
    api.onCommand((c) => brain.command(c.type));
    api.onSettings((s) => {
      const prev = cfg;
      cfg = s;
      brain.configure(mapCfg(s));
      Sound.setEnabled(s.sound);
      if (s.pet !== prev.pet) { brain.setPet(s.pet); applyTheme(); hideBubble(); }
      if (s.scale !== prev.scale) fit();
    });
    window.addEventListener('resize', fit);

    if (location.hash === '#debug') window.__pet = { brain, buf, get cfg() { return cfg; }, get cpp() { return cpp; } };

    brain.hello();
    requestAnimationFrame(frame);
  }

  start();
})();
