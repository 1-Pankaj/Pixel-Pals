'use strict';
/**
 * npm test: no Electron needed.
 *  1. every pet renders in every expression
 *  2. the message library is clean (lengths, empties, duplicates)
 *  3. each pet "lives" for two simulated hours (idle, sleeping, waking, petting, feeding, roaming)
 *  4. settings validation and icon encoding
 *  5. the real main process boots against a mocked Electron and its IPC behaves
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const Module = require('module');

const { PixelBuffer } = require('../src/shared/pixel');
const Pets = require('../src/shared/pets');
const Messages = require('../src/shared/messages');
const PetBrain = require('../src/shared/brain');
const Icons = require('../src/shared/icons');
const { sanitize } = require('../src/main/settings');

let failures = 0, checks = 0;
const ok = (cond, label) => { checks++; if (!cond) { failures++; console.log('  FAIL  ' + label); } };
const section = (t) => console.log('\n' + t);

function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ─────────────── 1. sprites ─────────────── */
section('Sprites');
{
  const buf = new PixelBuffer(64, 64);
  const eyes = ['open', 'wide', 'sleepy', 'sad', 'happy', 'sleep', 'love', 'dizzy', 'squint'];
  const mouths = ['smile', 'open', 'o', 'yawn', 'flat', 'frown', 'tongue', 'sleep'];
  for (const pet of Pets.list) {
    let blank = 0;
    for (const e of eyes) for (const m of mouths) {
      Pets.render(buf, pet.id, { eyes: e, mouth: m, t: 1, blink: e === 'open' ? 1 : 0 });
      let n = 0; for (let i = 3; i < buf.data.length; i += 4) if (buf.data[i] > 200) n++;
      if (n < 200) blank++;
    }
    ok(blank === 0, pet.id + ': every expression draws a body');
    for (const extra of [{ held: 1, swing: 0.8, oy: -8 }, { walking: 1, step: 2, ox: 1 }, { sx: 0.14, back: true }, { sy: 0.8, sx: 1.2 }, { flap: 1, ear: 1, gill: 1 }]) {
      Pets.render(buf, pet.id, extra);
    }
  }
  ok(true, 'extreme poses do not throw');
}

/* ─────────────── 2. messages ─────────────── */
section('Messages');
{
  const stats = Messages.stats();
  console.log('  ' + stats.total + ' lines (' + stats.shared + ' shared, ' + JSON.stringify(stats.pets) + ')');
  ok(stats.total >= 1000, 'at least 1000 messages');
  const seen = new Map(), dupes = [];
  let bad = 0;
  const walk = (o, where) => {
    if (Array.isArray(o)) { for (const e of o) { const t = Array.isArray(e) ? e[0] : e; if (typeof t !== 'string' || !t.trim() || t.length > 110) { bad++; console.log('   bad line in ' + where + ': ' + JSON.stringify(t)); } else { if (seen.has(t)) dupes.push(t); seen.set(t, where); } } }
    else if (o && typeof o === 'object') for (const k of Object.keys(o)) walk(o[k], where + '.' + k);
  };
  walk(globalThis.MessageData, 'M');
  ok(bad === 0, 'no empty or overlong lines');
  ok(dupes.length <= 6, 'almost no duplicate lines (' + dupes.length + ' found)');
  if (dupes.length) console.log('   dupes: ' + dupes.slice(0, 6).join(' | '));
  for (const id of ['mochi', 'waddle', 'axo']) {
    for (const pool of ['petted', 'petSpam', 'dizzy', 'lifted', 'dropped', 'fed', 'trick', 'wake', 'sleepTalk', 'bored', 'hover', 'yawn', 'daydream', 'walk', 'sneeze', 'hiccup', 'startled', 'back', 'adopt', 'bye', 'joke', 'fact', 'care', 'cheer', 'compliment']) {
      const m = Messages.line(id, pool, { date: new Date('2026-03-04T10:00:00') });
      ok(m && m.text && m.mood, id + ' has "' + pool + '"');
    }
    for (const d of ['2026-01-01', '2026-02-14', '2026-10-31', '2026-12-25', '2026-06-10']) ok(Messages.greeting(id, { date: new Date(d + 'T08:00:00') }).text, id + ' greets on ' + d);
  }
  for (let h = 0; h < 24; h++) ok(Messages.random('axo', { date: new Date(2026, 4, 5, h) }).text, 'random line at ' + h + ':00');
}

/* ─────────────── 3. a simulated life ─────────────── */
section('Simulated lifetime');
for (const pet of Pets.list) {
  Messages.reset(); Messages.setRandom(rng(11));
  let now = new Date('2026-05-05T09:00:00').getTime();
  const brain = new PetBrain({
    random: rng(5), messages: Messages, pets: Pets.PETS, petId: pet.id, clock: () => new Date(now),
    settings: { chatty: 'normal', roam: true, look: true, sleep: true, reminders: true, fun: true, sleepAfter: 150 },
  });
  const buf = new PixelBuffer(64, 64), counts = { say: 0, walk: 0, sound: 0, 'walk-stop': 0 }, pools = {};
  let sleptFrames = 0, woke = 0, prevSleep = false, nan = 0, thrown = null, maxSayGap = 0, lastSay = 0;
  const DT = 1 / 30, FRAMES = 2 * 3600 * 30;
  try {
    for (let f = 0; f < FRAMES; f++) {
      const t = f * DT, minute = t / 60;
      now += DT * 1000;
      // minutes 0-12 active, 12-40 away, 40-55 active, 55-70 away, then active
      const away = (minute > 12 && minute < 40) || (minute > 55 && minute < 70);
      const moving = !away && f % 45 === 0;
      const input = { look: { dx: Math.sin(t) * 60, dy: Math.cos(t * 0.7) * 40 }, cursorMoved: moving, hovering: !away && Math.floor(t / 20) % 7 === 0, room: { left: 400, right: 600 } };
      const pose = brain.update(DT, input);
      if (f % 7 === 0) for (const k of ['sx', 'sy', 'oy', 'ox', 'lookX', 'lookY', 'blush', 'sleepy', 'held', 'swing']) if (!Number.isFinite(pose[k])) nan++;
      if (f % 300 === 0) { Pets.render(buf, pet.id, pose); brain.drawFx(buf); }
      // scripted player: pets sometimes, feeds sometimes, drags rarely
      if (!away && f % 1800 === 600) brain.click();
      if (!away && f % 5400 === 2700) brain.feed();
      if (!away && f % 9000 === 4500) { brain.grab(); brain.dragMove(300); }
      if (brain.state === 'held' && f % 9000 === 4560) brain.drop();
      for (const ev of brain.out) {
        counts[ev.type] = (counts[ev.type] || 0) + 1;
        if (ev.type === 'say') { pools[ev.pool] = (pools[ev.pool] || 0) + 1; maxSayGap = Math.max(maxSayGap, t - lastSay); lastSay = t; }
        if (ev.type === 'walk') setTimeout(() => {}, 0), brain.walkDone();   // the main process would report arrival
      }
      brain.out.length = 0;
      if (brain.state === 'sleep') sleptFrames++;
      if (prevSleep && brain.state !== 'sleep') woke++;
      prevSleep = brain.state === 'sleep';
    }
  } catch (e) { thrown = e; }
  console.log('  ' + pet.id.padEnd(7) + 'says ' + String(counts.say).padStart(3) + '  walks ' + String(counts.walk).padStart(2) + '  slept ' + Math.round(sleptFrames / 30 / 60) + ' min  woke ' + woke + 'x');
  ok(!thrown, pet.id + ': two simulated hours without an exception' + (thrown ? ' (' + thrown.stack + ')' : ''));
  ok(nan === 0, pet.id + ': pose values always finite');
  ok(counts.say > 25, pet.id + ': talks regularly');
  const REACT = new Set(['petted', 'petSpam', 'dizzy', 'lifted', 'dropped', 'fed', 'trick', 'startled', 'wake', 'back', 'adopt', 'bye']);
  let ambient = 0; for (const k of Object.keys(pools)) if (!REACT.has(k)) ambient += pools[k];
  console.log('         spontaneous lines ' + ambient + ', reactions to the player ' + (counts.say - ambient));
  ok(ambient > 15 && ambient < 75, pet.id + ': spontaneous chatter is steady, not spammy (' + ambient + ' in ~70 active minutes)');
  ok(counts.walk >= 3, pet.id + ': roams the screen');
  ok(sleptFrames / 30 > 600, pet.id + ': falls asleep when the mouse is still');
  ok(woke >= 2, pet.id + ': wakes up when the mouse returns');
  ok(Object.keys(pools).length >= 8, pet.id + ': draws from many message pools (' + Object.keys(pools).length + ')');
}
{
  // silent means silent; chatty is chattier
  const run = (chatty) => {
    Messages.reset(); Messages.setRandom(rng(3));
    const b = new PetBrain({ random: rng(9), messages: Messages, pets: Pets.PETS, petId: 'mochi', settings: { chatty, roam: false, sleep: false } });
    let n = 0;
    for (let f = 0; f < 30 * 3600; f++) { b.update(1 / 30, { cursorMoved: f % 30 === 0 }); for (const e of b.out) if (e.type === 'say') n++; b.out.length = 0; }
    return n;
  };
  const silent = run('silent'), quiet = run('quiet'), normal = run('normal'), chatty = run('chatty');
  console.log('  messages per simulated hour: silent ' + silent + ', quiet ' + quiet + ', normal ' + normal + ', chatty ' + chatty);
  ok(silent === 0, 'silent mode says nothing');
  ok(quiet < normal && normal < chatty, 'quiet < normal < chatty');
}

/* ─────────────── 4. settings + icons ─────────────── */
section('Settings and icons');
{
  const s = sanitize({ pet: 'dragon', scale: 9, chatty: 'loud', roam: 'yes', pos: { x: 'a', y: 2 } });
  ok(s.pet === 'mochi' && s.scale === 4 && s.chatty === 'normal' && s.roam === true && s.pos === null, 'bad settings fall back to safe defaults');
  ok(sanitize({ pet: 'axo', scale: '5', pos: { x: 10.4, y: 20.6 } }).pos.y === 21, 'valid settings survive');
  for (const p of Pets.list) {
    const png = Icons.png(p.id, 32);
    ok(png.slice(0, 4).toString('hex') === '89504e47', p.id + ' icon is a PNG');
  }
  const ico = Icons.ico('mochi');
  ok(ico.readUInt16LE(2) === 1 && ico.readUInt16LE(4) === 7 && ico[6] === 0, 'icon.ico has 7 sizes starting at 256');
}

/* ─────────────── 5. main process smoke test ─────────────── */
section('Main process (mocked Electron)');
async function mainSmoke() {
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'pets-'));
  const wins = [], ipcOn = {}, ipcHandle = {}, trays = [], menus = [];
  let readyCb = null, quitCalled = false, cursor = { x: 500, y: 400 };
  const display = { bounds: { x: 0, y: 0, width: 1920, height: 1080 }, workArea: { x: 0, y: 0, width: 1920, height: 1040 } };
  class FakeWin {
    constructor(o) { this.o = o; this.b = { x: o.x || 0, y: o.y || 0, width: o.width, height: o.height }; this.sent = []; this.vis = false; this.ignore = null; this.ready = null; wins.push(this); const self = this; this.webContents = { send: (...a) => self.sent.push(a), on() {}, setWindowOpenHandler() {} }; }
    setAlwaysOnTop() {} setVisibleOnAllWorkspaces() {} loadFile() {} on() {} moveTop() {} focus() {} restore() {} isMinimized() { return false; }
    setIgnoreMouseEvents(...a) { this.ignore = a; }
    once(ev, cb) { if (ev === 'ready-to-show') this.ready = cb; }
    showInactive() { this.vis = true; } show() { this.vis = true; } hide() { this.vis = false; } isVisible() { return this.vis; } isDestroyed() { return false; }
    getBounds() { return Object.assign({}, this.b); } setBounds(b) { this.b = Object.assign({}, b); }
  }
  const electron = {
    app: { requestSingleInstanceLock: () => true, on() {}, whenReady: () => ({ then: (cb) => { readyCb = cb; } }), getPath: () => userData, setAppUserModelId() {}, isPackaged: false, getVersion: () => '1.0.0', quit() { quitCalled = true; }, commandLine: { appendSwitch() {} }, setLoginItemSettings() {} },
    BrowserWindow: FakeWin,
    Tray: class { constructor() { trays.push(this); } setToolTip() {} on() {} setImage() {} setContextMenu(m) { this.menu = m; } },
    Menu: { setApplicationMenu() {}, buildFromTemplate: (t) => { const m = { template: t, popup() { m.popped = true; } }; menus.push(m); return m; } },
    screen: { getPrimaryDisplay: () => display, getAllDisplays: () => [display], getCursorScreenPoint: () => cursor, getDisplayMatching: () => display, getDisplayNearestPoint: () => display },
    ipcMain: { handle: (c, f) => { ipcHandle[c] = f; }, on: (c, f) => { ipcOn[c] = f; } },
    nativeImage: { createEmpty: () => ({ addRepresentation() {} }), createFromBuffer: () => ({}) },
  };
  const load = Module._load;
  Module._load = function (req, ...rest) { return req === 'electron' ? electron : load.call(this, req, ...rest); };
  try {
    require('../src/main/main.js');
    ok(typeof readyCb === 'function', 'main registers its start-up');
    readyCb();
    const pet = wins[0], home = wins[1];
    ok(pet && pet.o.transparent && pet.o.frame === false && pet.o.alwaysOnTop && pet.o.focusable === false, 'pet window is transparent, frameless, topmost and non-focusable');
    ok(pet.ignore && pet.ignore[0] === true, 'pet window starts click-through');
    ok(home, 'first run opens Pet Home');
    pet.ready(); ok(pet.vis, 'pet window shows when ready');
    ok(trays.length === 1 && trays[0].menu, 'tray icon with a menu');

    const e = { sender: pet.webContents }, stranger = { sender: {} };
    const before = pet.getBounds();
    ipcOn['pet:interactive'](e, true); ok(pet.ignore[0] === false, 'hovering the pet makes the window clickable');
    ipcOn['pet:interactive'](stranger, true); ipcOn['pet:interactive'](e, false); ok(pet.ignore[0] === true, 'leaving the pet makes it click-through again; strangers are ignored');

    ipcOn['settings:update'](e, { scale: 5 });
    ok(pet.getBounds().width === 344 && pet.getBounds().height === 450, 'changing size resizes the window');
    ok(Math.abs((pet.getBounds().y + pet.getBounds().height) - (before.y + before.height) - 8) <= 1, 'resizing keeps the pet standing on the same spot');
    ipcOn['settings:update'](e, { scale: 4, pet: 'axo', chatty: 'quiet', pos: 'nope' });
    const got = ipcHandle['settings:get'](e);
    ok(got.pet === 'axo' && got.chatty === 'quiet' && got.scale === 4, 'settings update and are readable');
    ok(pet.sent.some((m) => m[0] === 'settings' && m[1].pet === 'axo'), 'settings are broadcast to the pet window');
    ok(JSON.parse(fs.readFileSync(path.join(userData, 'settings.json'), 'utf8')).pet === 'axo', 'settings are saved to disk');

    ipcOn['pet:menu'](e); const menu = menus[menus.length - 1];
    ok(menu.popped && menu.template.some((i) => i.label === 'Give a treat') && menu.template.some((i) => i.label === 'Quit'), 'right-click menu opens with the expected items');
    menu.template.find((i) => i.label === 'Give a treat').click();
    ok(pet.sent.some((m) => m[0] === 'command' && m[1].type === 'treat'), 'menu command reaches the renderer');

    // drag: the window should follow the cursor, then settle on screen
    cursor = { x: before.x + 100, y: before.y + 300 };
    ipcOn['pet:drag-start'](e);
    cursor = { x: 800, y: 600 };
    await new Promise((r) => setTimeout(r, 60));
    const moved = pet.getBounds();
    ok(moved.x !== before.x && moved.width === before.width, 'dragging moves the window and keeps its size');
    cursor = { x: -5000, y: 600 };            // fling it far off screen
    await new Promise((r) => setTimeout(r, 40));
    ipcOn['pet:drag-end'](e);
    const settled = pet.getBounds();
    ok(settled.x + settled.width / 2 >= 24, 'a pet flung off-screen is pulled back so it can always be found');
    ok(pet.sent.some((m) => m[0] === 'drag'), 'drag velocity is reported to the renderer');

    // roaming: walk 200px right and arrive
    const start = pet.getBounds().x;
    ipcOn['pet:walk'](e, { dx: 200, ms: 400 });
    await new Promise((r) => setTimeout(r, 650));
    ok(pet.getBounds().x - start >= 195 && pet.sent.some((m) => m[0] === 'walk-done'), 'roaming walks the window and reports arrival');

    ipcOn['app:visible'](e, false); ok(!pet.vis, 'hide pet works');
    ipcOn['app:visible'](e, true); ok(pet.vis, 'show pet works');
    ipcOn['app:quit'](e);
    await new Promise((r) => setTimeout(r, 2100));
    ok(quitCalled, 'quit says goodbye, then exits');
  } catch (err) {
    ok(false, 'main process threw: ' + (err && err.stack));
  } finally { Module._load = load; }
}

mainSmoke().then(() => {
  console.log('\n' + (failures ? failures + ' of ' + checks + ' checks FAILED' : 'All ' + checks + ' checks passed'));
  process.exit(failures ? 1 : 0);
});
