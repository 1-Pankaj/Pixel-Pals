/**
 * Pet Home: choose a pet, tune how it behaves, play with it.
 * The three cards are alive: each pet runs the very same brain as the desktop pet,
 * so they blink, look at your cursor, hop and react to clicks right here.
 */
(function () {
  'use strict';

  const api = window.petAPI;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

  const TOGGLES = [
    ['alwaysOnTop', 'Always on top', 'Float above your other windows'],
    ['roam', 'Roam around the screen', 'Wander along the screen now and then'],
    ['lookAtCursor', 'Look at my cursor', 'Eyes follow the mouse, anywhere on screen'],
    ['sleepWhenIdle', 'Sleep when idle', 'Nap when the mouse has been still for a while'],
    ['reminders', 'Wellness nudges', 'Gentle reminders to drink water, stretch and rest your eyes'],
    ['funContent', 'Fun facts and jokes', 'Animal facts and silly puns, now and then'],
    ['sound', 'Sounds', 'Tiny pops and chirps (off until you turn it on)'],
    ['launchAtLogin', 'Start when I sign in', 'Your pet appears when you log in to your computer'],
  ];

  const CHAT_HINT = {
    silent: 'No spontaneous messages, and reactions stay quiet too.',
    quiet: 'A message every 7 to 14 minutes or so.',
    normal: 'A message every 2 to 5 minutes or so.',
    chatty: 'A message every minute or two.',
  };

  let cfg = null;
  const cards = [];
  const loginRow = {};

  /* ───────────────────────── toggles ───────────────────────── */
  function buildToggles() {
    const host = $('#toggles');
    for (const [key, title, desc] of TOGGLES) {
      const row = el('label', 'row');
      const txt = el('span', 'txt');
      const small = el('small', null, desc);
      txt.append(el('b', null, title), small);
      const input = el('input', 'sw');
      input.type = 'checkbox'; input.dataset.k = key;
      input.addEventListener('change', () => api.updateSettings({ [key]: input.checked }));
      row.append(txt, input);
      host.append(row);
      if (key === 'launchAtLogin') { loginRow.row = row; loginRow.small = small; loginRow.desc = desc; }
    }
  }

  /* ───────────────────────── pet cards ───────────────────────── */
  function say(c, m) {
    if (!m) return;
    c.hi.textContent = m.text; c.hi.classList.add('on');
    clearTimeout(c.hiTimer);
    c.hiTimer = setTimeout(() => c.hi.classList.remove('on'), 2700);
  }

  function select(c) {
    const mine = cfg.pet === c.meta.id;
    c.brain.click();
    say(c, Messages.line(c.meta.id, mine ? 'petted' : 'adopt', { date: new Date() }));
    if (!mine) { cfg.pet = c.meta.id; render(); api.updateSettings({ pet: c.meta.id }); }
  }

  function buildCards() {
    const host = $('#cards');
    for (const meta of Pets.list) {
      const node = el('button', 'card');
      node.type = 'button';
      node.style.setProperty('--c', meta.accent);
      node.setAttribute('aria-pressed', 'false');
      node.setAttribute('aria-label', meta.name + ' the ' + meta.species + '. ' + meta.tagline);

      const inner = el('div', 'in');
      const view = el('div', 'view');
      const canvas = el('canvas');
      const hi = el('div', 'hi');
      view.append(canvas, hi);

      const head = el('div', 'meta');
      head.append(el('h3', null, meta.name), el('span', 'species', meta.species));
      const traits = el('ul', 'traits');
      for (const t of meta.traits) traits.append(el('li', null, t));
      const cta = el('div', 'cta', 'Adopt ' + meta.name);
      inner.append(view, head, el('p', 'tag', meta.tagline), traits, cta);
      node.append(el('span', 'badge', 'Your pet'), inner);
      host.append(node);

      const c = {
        meta, node, canvas, hi, cta, hover: false, cpp: 3, hiTimer: 0,
        view: Display.createView(canvas, Scenes.W, Scenes.H, 3),
        sceneBuf: new Pixel.PixelBuffer(Scenes.W, Scenes.H),
        petBuf: new Pixel.PixelBuffer(Pets.BUF, Pets.BUF),
        brain: new PetBrain({
          messages: Messages, pets: Pets.PETS, petId: meta.id,
          settings: { chatty: 'silent', roam: false, sleep: false, look: true, reminders: false, fun: false },
        }),
      };
      node.addEventListener('click', () => select(c));
      node.addEventListener('dblclick', () => c.brain.doubleClick());
      node.addEventListener('pointerenter', () => { c.hover = true; });
      node.addEventListener('pointerleave', () => { c.hover = false; });
      cards.push(c);
    }
  }

  /** Pick the largest whole-number scale that fits the card, so pixels stay perfectly square. */
  function fitCards() {
    for (const c of cards) {
      const w = c.node.clientWidth - 6 - 24;
      const s = Math.max(2, Math.min(4, Math.floor(w / Scenes.W)));
      c.view.setScale(s);
      c.cpp = c.view.fit();
    }
  }

  /* ───────────────────────── settings → UI ───────────────────────── */
  function render() {
    const meta = Pets.get(cfg.pet);
    document.body.style.setProperty('--accent', meta.accent);
    for (const c of cards) {
      const on = c.meta.id === cfg.pet;
      c.node.setAttribute('aria-pressed', String(on));
      c.cta.textContent = on ? c.meta.name + ' is your pet' : 'Adopt ' + c.meta.name;
    }
    for (const i of $$('.sw')) i.checked = !!cfg[i.dataset.k];

    const canLogin = !!cfg.packaged;
    const login = $('.sw[data-k="launchAtLogin"]');
    login.disabled = !canLogin;
    loginRow.row.classList.toggle('off', !canLogin);
    loginRow.small.textContent = canLogin ? loginRow.desc : 'Available in the installed version (npm run dist)';

    for (const seg of $$('.seg')) {
      const key = seg.dataset.seg;
      for (const b of $$('button', seg)) b.setAttribute('aria-checked', String(String(cfg[key]) === b.dataset.v));
    }
    $('#chat-hint').textContent = CHAT_HINT[cfg.chatty] || '';
    $('#play-title').textContent = 'Play with ' + meta.name;
    $('#toggle-vis').textContent = cfg.visible ? 'Hide pet' : 'Show pet';
  }

  function wireControls() {
    for (const seg of $$('.seg')) {
      for (const b of $$('button', seg)) {
        b.addEventListener('click', () => {
          const key = seg.dataset.seg, v = key === 'scale' ? Number(b.dataset.v) : b.dataset.v;
          cfg[key] = v; render();
          api.updateSettings({ [key]: v });
        });
      }
    }
    for (const b of $$('[data-cmd]')) b.addEventListener('click', () => api.command(b.dataset.cmd));
    $('#toggle-vis').addEventListener('click', () => api.setVisible(!cfg.visible));
    $('#reset-pos').addEventListener('click', () => api.resetPosition());
    $('#quit').addEventListener('click', () => api.quit());
  }

  /* ───────────────────────── animation ───────────────────────── */
  let mouse = null, last = performance.now(), t = 0;
  window.addEventListener('pointermove', (e) => { mouse = { x: e.clientX, y: e.clientY }; });
  document.documentElement.addEventListener('pointerleave', () => { mouse = null; });

  function tick(now) {
    requestAnimationFrame(tick);
    if (now - last < 40) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now; t += dt;
    for (const c of cards) {
      let look = null;
      if (mouse) {
        const r = c.canvas.getBoundingClientRect();
        look = { dx: (mouse.x - r.left) / c.cpp - Scenes.PET_X - 32, dy: (mouse.y - r.top) / c.cpp - Scenes.PET_Y - Pets.get(c.meta.id).head };
      }
      const pose = c.brain.update(dt, { look, hovering: c.hover });
      Scenes.draw(c.sceneBuf, c.meta.id, t);
      Pets.render(c.petBuf, c.meta.id, pose);
      c.brain.drawFx(c.petBuf);
      c.sceneBuf.blitAt(c.petBuf, Scenes.PET_X, Scenes.PET_Y);
      c.view.draw(c.sceneBuf);
      c.brain.out.length = 0;
    }
  }

  /* ───────────────────────── start ───────────────────────── */
  async function start() {
    cfg = await api.getSettings();
    if (!cfg) return;
    $('#count').textContent = Messages.stats().total.toLocaleString('en-US');
    buildToggles();
    buildCards();
    wireControls();
    fitCards();
    render();
    new ResizeObserver(fitCards).observe($('#cards'));
    api.onSettings((s) => { cfg = s; render(); });
    requestAnimationFrame(tick);
  }

  start();
})();
