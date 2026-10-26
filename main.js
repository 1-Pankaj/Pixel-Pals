/* ============================================================
 * PIXEL PALS — Electron main process
 * ------------------------------------------------------------
 * - Frameless transparent always-on-top pet window
 * - Global cursor polling (eye tracking + hover pass-through)
 * - Manual drag with smoothing + fling physics with bounce
 * - Tray menu, context menu, adopt-a-buddy picker window
 * - State persistence (pet choice, position, settings)
 * ============================================================ */
const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

const WIN_W = 340;
const WIN_H = 400;
const IS_MAC = process.platform === 'darwin';

const PET_META = {
  mochi:   { name: 'Mochi' },
  biscuit: { name: 'Biscuit' },
  pudding: { name: 'Pudding' },
  luna:    { name: 'Luna' },
  clover:  { name: 'Clover' },
  miso:    { name: 'Miso' }
};

let petWin = null;
let pickerWin = null;
let tray = null;

let state = null;
const stateFile = () => path.join(app.getPath('userData'), 'pixel-pals-state.json');

/* ---------------- state ---------------- */
function loadState() {
  try {
    const raw = fs.readFileSync(stateFile(), 'utf8');
    const s = JSON.parse(raw);
    return {
      petId: PET_META[s.petId] ? s.petId : 'mochi',
      x: Number.isFinite(s.x) ? s.x : null,
      y: Number.isFinite(s.y) ? s.y : null,
      onboarded: !!s.onboarded,
      settings: Object.assign(
        {
          sound: true, messages: true, eyeTracking: true, wander: true, sleep: true, autostart: false,
          waterReminder: true, waterEveryMin: 45,
          stretchReminder: true, stretchEveryMin: 50,
          hourlyChime: false, globalShortcuts: true
        },
        s.settings || {}
      )
    };
  } catch (e) {
    return {
      petId: 'mochi',
      x: null, y: null,
      onboarded: false,
      settings: {
        sound: true, messages: true, eyeTracking: true, wander: true, sleep: true, autostart: false,
        waterReminder: true, waterEveryMin: 45,
        stretchReminder: true, stretchEveryMin: 50,
        hourlyChime: false, globalShortcuts: true
      }
    };
  }
}
function saveState() {
  try {
    if (petWin && !petWin.isDestroyed() && !drag.active && !fling.active && !hopAnim.active) {
      const b = petWin.getBounds();
      state.x = b.x; state.y = b.y;
    }
    fs.writeFileSync(stateFile(), JSON.stringify(state, null, 2), 'utf8');
  } catch (e) { /* non-fatal */ }
}

/* ---------------- helpers ---------------- */
function clampPointToWorkArea(x, y) {
  const disp = screen.getDisplayNearestPoint({ x: Math.round(x), y: Math.round(y) });
  const wa = disp.workArea;
  const cx = Math.min(Math.max(x, wa.x), wa.x + wa.width - WIN_W);
  const cy = Math.min(Math.max(y, wa.y), wa.y + wa.height - WIN_H);
  return { x: Math.round(cx), y: Math.round(cy) };
}

function sendToPet(channel, payload) {
  if (petWin && !petWin.isDestroyed()) {
    petWin.webContents.send(channel, payload);
  }
}

function applyIgnore(ignore) {
  if (!petWin || petWin.isDestroyed()) return;
  if (drag.active || fling.active) ignore = false;
  try { petWin.setIgnoreMouseEvents(ignore, { forward: true }); } catch (e) { /* ignore */ }
}

/* ---------------- cursor loop: eyes, drag, fling ---------------- */
let lastCursor = { x: -1, y: -1 };
const drag = { active: false, offX: 0, offY: 0, vx: 0, vy: 0, lastX: 0, lastY: 0, lastMoveAt: 0 };
const fling = { active: false, vx: 0, vy: 0 };
const hopAnim = { active: false }; // window hop animation (wander) handled renderer-side

// DRAG_TEST only: synthetic cursor lets CI exercise the real drag
// machinery (setPosition + IPC + bubble anchoring) without xdotool
let syntheticCursor = null;
function getCursorPoint() {
  return syntheticCursor || screen.getCursorScreenPoint();
}

function cursorTick() {
  if (!petWin || petWin.isDestroyed()) return;

  const c = getCursorPoint();
  if (c.x !== lastCursor.x || c.y !== lastCursor.y) {
    lastCursor = c;
    const b = petWin.getBounds();
    sendToPet('cursor', { x: c.x, y: c.y, wx: b.x, wy: b.y });
  }

  if (drag.active) {
    const b = petWin.getBounds();
    const tx = c.x - drag.offX;
    const ty = c.y - drag.offY;
    const clamped = clampPointToWorkArea(tx, ty);
    // Direct 1:1 follow — the window lands exactly on target every tick.
    // (The old smoothing lerp kept the window perpetually moving, which on
    // Windows makes transparent-window content visibly trail and slide.)
    // Velocity is still tracked for fling physics.
    drag.vx = drag.vx * 0.55 + (clamped.x - b.x) * 0.45;
    drag.vy = drag.vy * 0.55 + (clamped.y - b.y) * 0.45;
    petWin.setPosition(clamped.x, clamped.y);
    if (process.env.DRAG_TEST === '1' && Math.random() < 0.05) console.log('DBG drag move', Math.round(clamped.x), Math.round(clamped.y));
    drag.lastMoveAt = Date.now();
  }

  if (fling.active) {
    const b = petWin.getBounds();
    let nx = b.x + fling.vx;
    let ny = b.y + fling.vy;
    fling.vy += 1.15; // gravity (px per tick^2 @ ~60fps)

    const disp = screen.getDisplayNearestPoint({ x: Math.round(nx + WIN_W / 2), y: Math.round(ny + WIN_H / 2) });
    const wa = disp.workArea;
    let bounced = false;
    if (nx < wa.x) { nx = wa.x; fling.vx = Math.abs(fling.vx) * 0.5; bounced = true; }
    if (nx > wa.x + wa.width - WIN_W) { nx = wa.x + wa.width - WIN_W; fling.vx = -Math.abs(fling.vx) * 0.5; bounced = true; }
    if (ny > wa.y + wa.height - WIN_H) { ny = wa.y + wa.height - WIN_H; fling.vy = -Math.abs(fling.vy) * 0.48; fling.vx *= 0.82; bounced = true; }
    if (ny < wa.y) { ny = wa.y; fling.vy = Math.abs(fling.vy) * 0.48; bounced = true; }

    petWin.setPosition(Math.round(nx), Math.round(ny));

    const speed = Math.abs(fling.vx) + Math.abs(fling.vy);
    if ((speed < 2.2 && !bounced) || Date.now() - fling.start > 4000) {
      fling.active = false;
      saveState();
      sendToPet('cmd', { type: 'settle' });
      applyIgnore(true);
    }
  }
}

/* ---------------- pet window ---------------- */
function createPetWindow() {
  if (petWin && !petWin.isDestroyed()) petWin.destroy();

  const wa = screen.getPrimaryDisplay().workArea;
  const defaultX = wa.x + wa.width - WIN_W - 48;
  const defaultY = wa.y + wa.height - WIN_H - 12;
  let px = state.x == null ? defaultX : state.x;
  let py = state.y == null ? defaultY : state.y;
  const c = clampPointToWorkArea(px, py);
  px = c.x; py = c.y;

  petWin = new BrowserWindow({
    width: WIN_W,
    height: WIN_H,
    x: px,
    y: py,
    transparent: true,
    frame: false,
    resizable: false,
    movable: false,        // we move it ourselves (drag physics)
    hasShadow: false,
    skipTaskbar: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    focusable: false,      // never steal focus from the user's work
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });
  petWin.setAlwaysOnTop(true, 'screen-saver');
  try { petWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true }); } catch (e) { /* mac */ }

  petWin.loadFile(path.join(__dirname, 'src', 'pet.html'), { query: { pet: state.petId } });

  petWin.once('ready-to-show', () => {
    petWin.showInactive();
    applyIgnore(true);
    if (process.argv.includes('--debug')) {
      petWin.webContents.openDevTools({ mode: 'detach' });
    }
  });

  petWin.webContents.on('did-finish-load', () => {
    sendToPet('state', {
      petId: state.petId,
      settings: state.settings,
      bounds: petWin.getBounds()
    });
    updateTrayIcon();
  });

  petWin.on('closed', () => { petWin = null; });
}

function respawnPet() {
  saveState();
  createPetWindow();
}

/* ---------------- picker window ---------------- */
function openPicker() {
  if (pickerWin && !pickerWin.isDestroyed()) {
    pickerWin.focus();
    return;
  }
  const wa = screen.getPrimaryDisplay().workArea;
  pickerWin = new BrowserWindow({
    width: 540,
    height: 840,
    x: Math.round(wa.x + (wa.width - 540) / 2),
    y: Math.round(wa.y + (wa.height - 840) / 2),
    transparent: true,
    frame: false,
    resizable: false,
    show: false,
    minimizable: true,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  pickerWin.loadFile(path.join(__dirname, 'src', 'picker.html'), { query: { pet: state.petId } });
  pickerWin.once('ready-to-show', () => {
    pickerWin.show();
    if (process.argv.includes('--debug')) {
      pickerWin.webContents.openDevTools({ mode: 'detach' });
    }
  });
  pickerWin.on('closed', () => { pickerWin = null; });
}

/* ---------------- focus timer (lives in main; survives renderer reload) ---------------- */
const focus = { active: false, endsAt: 0, totalMin: 0, tick: null };

function focusStart(minutes) {
  focusStop(false);
  focus.active = true;
  focus.totalMin = minutes;
  focus.endsAt = Date.now() + minutes * 60000;
  focus.tick = setInterval(() => {
    const left = Math.max(0, Math.ceil((focus.endsAt - Date.now()) / 60000));
    refreshTrayMenu();
    sendToPet('cmd', { type: 'focus-tick', left });
    if (left <= 0) {
      const done = focus.totalMin;
      focusStop(false);
      sendToPet('cmd', { type: 'focus-done', minutes: done });
    }
  }, 15000);
  sendToPet('cmd', { type: 'focus-start', minutes });
  refreshTrayMenu();
}

function focusStop(announce) {
  if (!focus.active) { if (announce !== false) sendToPet('cmd', { type: 'focus-stop' }); return; }
  focus.active = false;
  if (focus.tick) { clearInterval(focus.tick); focus.tick = null; }
  if (announce !== false) sendToPet('cmd', { type: 'focus-stop' });
  refreshTrayMenu();
}

function focusLeftLabel() {
  if (!focus.active) return null;
  const left = Math.max(0, Math.ceil((focus.endsAt - Date.now()) / 60000));
  return `Focus: ${left} min left (of ${focus.totalMin})`;
}

/* ---------------- countdown timer ("tell me when 10 min pass") ---------------- */
const countdown = { active: false, endsAt: 0, totalMin: 0, tick: null };

function countdownStart(minutes) {
  countdownStop(false);
  countdown.active = true;
  countdown.totalMin = minutes;
  countdown.endsAt = Date.now() + minutes * 60000;
  countdown.tick = setInterval(() => {
    const left = Math.max(0, Math.ceil((countdown.endsAt - Date.now()) / 60000));
    refreshTrayMenu();
    if (left <= 0) {
      const done = countdown.totalMin;
      countdownStop(false);
      sendToPet('cmd', { type: 'countdown-done', minutes: done });
    }
  }, 5000);
  sendToPet('cmd', { type: 'countdown-set', minutes });
  refreshTrayMenu();
}

function countdownStop(announce) {
  if (!countdown.active) return;
  countdown.active = false;
  if (countdown.tick) { clearInterval(countdown.tick); countdown.tick = null; }
  refreshTrayMenu();
}

function countdownLeftLabel() {
  if (!countdown.active) return null;
  const left = Math.max(0, Math.ceil((countdown.endsAt - Date.now()) / 60000));
  return `Countdown: ${left} min left (of ${countdown.totalMin})`;
}

/* ---------------- global keyboard shortcuts ----------------
 * The pet window is intentionally non-focusable, so keyboard
 * control happens through system-wide shortcuts. Toggleable in
 * the tray menu (setting: globalShortcuts).                    */
const SHORTCUT_DEFS = [
  ['Alt+Shift+P', () => sendToPet('cmd', { type: 'pet' })],
  ['Alt+Shift+B', () => sendToPet('cmd', { type: 'say' })],
  ['Alt+Shift+F', () => sendToPet('cmd', { type: 'feed' })],
  ['Alt+Shift+D', () => sendToPet('cmd', { type: 'dance' })],
  ['Alt+Shift+N', () => sendToPet('cmd', { type: 'nap' })],
  ['Alt+Shift+T', () => sendToPet('cmd', { type: 'time' })],
  ['Alt+Shift+Q', () => sendToPet('cmd', { type: 'ask' })],
  ['Alt+Shift+R', () => sendToPet('cmd', { type: 'ask-rps' })],
  ['Alt+Shift+C', () => sendToPet('cmd', { type: 'ask-coin' })],
  ['Alt+Shift+M', () => sendToPet('cmd', { type: 'ask-8ball' })],
  ['Alt+Shift+K', () => sendToPet('cmd', { type: 'ask-knock' })],
  ['Alt+Shift+A', () => sendToPet('cmd', { type: 'ask-snack' })],
  ['Alt+Shift+Y', () => sendToPet('cmd', { type: 'story' })],
  ['Alt+Shift+E', () => sendToPet('cmd', { type: 'breathe' })],
  ['Alt+Shift+G', () => focusStart(25)],
  ['Alt+Shift+H', () => focusStop(true)],
  ['Alt+Shift+S', () => sendToPet('cmd', { type: 'stats' })],
  ['Alt+Shift+X', () => sendToPet('cmd', { type: 'dismiss' })],
  ['Alt+Shift+1', () => sendToPet('cmd', { type: 'choice', index: 0 })],
  ['Alt+Shift+2', () => sendToPet('cmd', { type: 'choice', index: 1 })],
  ['Alt+Shift+3', () => sendToPet('cmd', { type: 'choice', index: 2 })]
];

function applyShortcuts() {
  try {
    globalShortcut.unregisterAll();
    if (!state || state.settings.globalShortcuts === false) return;
    SHORTCUT_DEFS.forEach(([acc, fn]) => {
      try { globalShortcut.register(acc, fn); } catch (e) { /* taken by another app */ }
    });
  } catch (e) { /* non-fatal */ }
}

function sendShortcutHint() {
  sendToPet('cmd', { type: 'say' });
  setTimeout(() => sendToPet('cmd', { type: 'say' }), 5200);
}

/* ---------------- tray ---------------- */
function trayIconImage() {
  const file = path.join(__dirname, 'assets', `tray-${state.petId}.png`);
  try {
    const img = nativeImage.createFromPath(file);
    if (!img.isEmpty()) return img;
  } catch (e) { /* fallthrough */ }
  return nativeImage.createEmpty();
}

function updateTrayIcon() {
  if (tray) tray.setImage(trayIconImage());
}

function buildTrayMenu() {
  const s = state.settings;
  const petItem = (id) => ({
    label: PET_META[id].name,
    type: 'radio',
    checked: state.petId === id,
    click: () => setPet(id)
  });

  const toggle = (label, key) => ({
    label,
    type: 'checkbox',
    checked: s[key],
    click: (item) => {
      state.settings[key] = item.checked;
      saveState();
      sendToPet('cmd', { type: 'settings', settings: state.settings });
      if (key === 'autostart') applyAutostart();
      if (key === 'globalShortcuts') applyShortcuts();
    }
  });

  const focusLabel = focusLeftLabel();
  const focusItems = focus.active ? [
    { label: focusLabel, enabled: false },
    { label: 'Stop focus timer', click: () => focusStop(true) }
  ] : [
    { label: '15 min', click: () => focusStart(15) },
    { label: '25 min', click: () => focusStart(25) },
    { label: '50 min', click: () => focusStart(50) }
  ];

  const countdownItems = countdown.active ? [
    { label: countdownLeftLabel(), enabled: false },
    { label: 'Cancel countdown', click: () => countdownStop(false) }
  ] : [
    { label: '1 min', click: () => countdownStart(1) },
    { label: '5 min', click: () => countdownStart(5) },
    { label: '10 min', click: () => countdownStart(10) },
    { label: '20 min', click: () => countdownStart(20) },
    { label: '30 min', click: () => countdownStart(30) }
  ];

  return Menu.buildFromTemplate([
    { label: `Pixel Pals — ${PET_META[state.petId].name}`, enabled: false },
    { type: 'separator' },
    { label: 'Your pal', enabled: false },
    petItem('mochi'),
    petItem('biscuit'),
    petItem('pudding'),
    petItem('luna'),
    petItem('clover'),
    petItem('miso'),
    { type: 'separator' },
    { label: 'Fun', enabled: false },
    { label: 'Say something', click: () => sendToPet('cmd', { type: 'say' }) },
    { label: 'Pet (hearts!)', click: () => sendToPet('cmd', { type: 'pet' }) },
    { label: 'Give a snack', click: () => sendToPet('cmd', { type: 'feed' }) },
    { label: 'Dance party', click: () => sendToPet('cmd', { type: 'dance' }) },
    { label: 'Nap / wake', click: () => sendToPet('cmd', { type: 'nap' }) },
    { type: 'separator' },
    { label: 'Questions & games', enabled: false },
    { label: 'Ask me a question', click: () => sendToPet('cmd', { type: 'ask' }) },
    { label: 'Rock, paper, scissors', click: () => sendToPet('cmd', { type: 'ask-rps' }) },
    { label: 'Flip a coin', click: () => sendToPet('cmd', { type: 'ask-coin' }) },
    { label: 'Magic 8-ball', click: () => sendToPet('cmd', { type: 'ask-8ball' }) },
    { label: 'Knock-knock joke', click: () => sendToPet('cmd', { type: 'ask-knock' }) },
    { label: 'Snack, please?', click: () => sendToPet('cmd', { type: 'ask-snack' }) },
    { label: 'Tell me a story', click: () => sendToPet('cmd', { type: 'story' }) },
    { type: 'separator' },
    { label: 'Useful', enabled: false },
    { label: 'Focus timer', submenu: focusItems },
    { label: 'Countdown timer', submenu: countdownItems },
    { label: 'One-minute breathing break', click: () => sendToPet('cmd', { type: 'breathe' }) },
    { label: 'What time is it?', click: () => sendToPet('cmd', { type: 'time' }) },
    { label: 'How long have we hung out?', click: () => sendToPet('cmd', { type: 'stats' }) },
    { type: 'separator' },
    { label: 'Gentle reminders', enabled: false },
    toggle('Water break reminder', 'waterReminder'),
    { label: '   every ' + s.waterEveryMin + ' min', enabled: false },
    toggle('Stretch reminder', 'stretchReminder'),
    { label: 'Hourly chime', type: 'checkbox', checked: s.hourlyChime,
      click: (item) => { state.settings.hourlyChime = item.checked; saveState(); sendToPet('cmd', { type: 'settings', settings: state.settings }); } },
    { type: 'separator' },
    toggle('Sound effects', 'sound'),
    toggle('Random messages', 'messages'),
    toggle('Eyes follow mouse', 'eyeTracking'),
    toggle('Wander around', 'wander'),
    toggle('Sleep mode', 'sleep'),
    toggle('Global keyboard shortcuts', 'globalShortcuts'),
    toggle(IS_MAC ? 'Start at login' : 'Start with Windows', 'autostart'),
    { type: 'separator' },
    { label: 'Adopt a different pal...', click: () => openPicker() },
    { type: 'separator' },
    { label: 'Quit Pixel Pals', click: () => { saveState(); app.quit(); } }
  ]);
}

function createTray() {
  try {
    tray = new Tray(trayIconImage());
    tray.setToolTip('Pixel Pals');
    tray.setContextMenu(buildTrayMenu());
    tray.on('click', () => { if (tray) tray.popUpContextMenu(buildTrayMenu()); });
  } catch (e) {
    // tray unavailable (some linux) — app still works
  }
}

function refreshTrayMenu() {
  if (tray) tray.setContextMenu(buildTrayMenu());
}

function applyAutostart() {
  try {
    app.setLoginItemSettings({ openAtLogin: !!state.settings.autostart });
  } catch (e) { /* dev mode may throw */ }
}

function setPet(id) {
  if (!PET_META[id]) return;
  state.petId = id;
  state.onboarded = true;
  saveState();
  refreshTrayMenu();
  respawnPet();
}

/* ---------------- context menu (right-click on pet) ---------------- */
function popupContextMenu() {
  const menu = Menu.buildFromTemplate([
    { label: `Hi, I am ${PET_META[state.petId].name}!`, enabled: false },
    { type: 'separator' },
    { label: 'Pet me (hearts!)', click: () => sendToPet('cmd', { type: 'pet' }) },
    { label: 'Give a snack', click: () => sendToPet('cmd', { type: 'feed' }) },
    { label: 'Ask me a question', click: () => sendToPet('cmd', { type: 'ask' }) },
    { label: 'Rock, paper, scissors', click: () => sendToPet('cmd', { type: 'ask-rps' }) },
    { label: 'Tell me a story', click: () => sendToPet('cmd', { type: 'story' }) },
    { label: 'Dance party', click: () => sendToPet('cmd', { type: 'dance' }) },
    { label: 'Say something', click: () => sendToPet('cmd', { type: 'say' }) },
    { label: 'What time is it?', click: () => sendToPet('cmd', { type: 'time' }) },
    { label: 'Nap / wake', click: () => sendToPet('cmd', { type: 'nap' }) },
    { type: 'separator' },
    { label: 'Focus 25 min', click: () => focusStart(25) },
    focus.active
      ? { label: focusLeftLabel(), enabled: false }
      : { label: 'No focus session', enabled: false },
    { type: 'separator' },
    { label: 'Adopt a different pal...', click: () => openPicker() },
    { type: 'separator' },
    { label: 'Quit Pixel Pals', click: () => { saveState(); app.quit(); } }
  ]);
  const win = petWin && !petWin.isDestroyed() ? petWin : undefined;
  menu.popup({ window: win });
}

/* ---------------- IPC ---------------- */
ipcMain.on('drag-start', () => {
  const b = petWin ? petWin.getBounds() : { x: 0, y: 0 };
  if (process.env.DRAG_TEST === '1') console.log('DBG drag-start at', b.x, b.y);
  drag.active = true;
  drag.offX = lastCursor.x - b.x;
  drag.offY = lastCursor.y - b.y;
  drag.vx = 0; drag.vy = 0;
  drag.lastX = lastCursor.x; drag.lastY = lastCursor.y;
  drag.lastMoveAt = Date.now();
  applyIgnore(false);
  sendToPet('cmd', { type: 'drag-start' });
});

ipcMain.on('drag-end', () => {
  if (!drag.active) return;
  drag.active = false;
  const speed = Math.hypot(drag.vx, drag.vy);
  if (speed > 14) {
    fling.active = true;
    fling.start = Date.now();
    fling.vx = Math.max(-40, Math.min(40, drag.vx));
    fling.vy = Math.max(-40, Math.min(40, drag.vy));
    sendToPet('cmd', { type: 'fling' });
  } else {
    saveState();
    sendToPet('cmd', { type: 'settle' });
    applyIgnore(true);
  }
});

ipcMain.on('hover', (e, hovering) => {
  applyIgnore(!hovering);
});

ipcMain.on('context-menu', () => popupContextMenu());

ipcMain.on('open-picker', () => openPicker());

ipcMain.on('adopt', (e, petId) => {
  setPet(petId);
  if (pickerWin && !pickerWin.isDestroyed()) pickerWin.close();
});

ipcMain.on('settings-update', (e, patch) => {
  state.settings = Object.assign({}, state.settings, patch || {});
  if (patch && 'autostart' in patch) applyAutostart();
  saveState();
  refreshTrayMenu();
});

ipcMain.on('hop-move', (e, d) => {
  if (!petWin || petWin.isDestroyed()) return;
  const b = petWin.getBounds();
  const c = clampPointToWorkArea(b.x + (d.dx || 0), b.y + (d.dy || 0));
  petWin.setPosition(c.x, c.y);
});

ipcMain.on('tray-refresh', () => refreshTrayMenu());

ipcMain.on('request-quit', () => { saveState(); app.quit(); });

ipcMain.on('tray-face', (e, dataUrl) => {
  try {
    if (tray && typeof dataUrl === 'string' && dataUrl.startsWith('data:image/png')) {
      const img = nativeImage.createFromDataURL(dataUrl);
      if (!img.isEmpty()) tray.setImage(img);
    }
  } catch (err) { /* ignore */ }
});

/* ---------------- app lifecycle ---------------- */
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (pickerWin && !pickerWin.isDestroyed()) {
      pickerWin.focus();
    } else if (!state || !state.onboarded) {
      openPicker();
    } else if (petWin && !petWin.isDestroyed()) {
      sendToPet('cmd', { type: 'say' });
    }
  });

  app.whenReady().then(() => {
    state = loadState();
    applyAutostart();

    // drag regression test: synthetic cursor drags through the REAL
    // machinery (cursorTick -> setPosition -> renderer IPC -> bubble anchor)
    if (process.env.DRAG_TEST === '1') {
      createPetWindow();
      setInterval(cursorTick, 16);   // drive the drag loop with the synthetic cursor
      petWin.webContents.once('did-finish-load', () => {
        setTimeout(() => {
          const fs2 = require('fs');
          if (!fs2.existsSync(path.join(__dirname, 'out'))) fs2.mkdirSync(path.join(__dirname, 'out'));
          const sleepMs = (ms) => new Promise(r => setTimeout(r, ms));
          (async () => {
            try {
              const b = petWin.getBounds();
              // place the synthetic cursor on the pet sprite (bottom-center)
              let cx = b.x + 170, cy = b.y + 300;
              syntheticCursor = { x: cx, y: cy };
              await sleepMs(500);
              // press inside the renderer (real DOM event -> drag pipeline)
              await petWin.webContents.executeJavaScript(
                "window.dispatchEvent(new MouseEvent('mousedown',{button:0,clientX:170,clientY:300,bubbles:true}));'down'"
              );
              // move past the drag threshold WELL BEFORE the 420ms squish timer
              await sleepMs(120);
              cx += 14; cy -= 10;
              syntheticCursor = { x: cx, y: cy };
              const d1 = await petWin.webContents.executeJavaScript(
                `window.dispatchEvent(new MouseEvent('mousemove',{clientX:${170 + 14},clientY:${300 - 10},bubbles:true}));JSON.stringify(window.__petdbg())`
              );
              console.log('DBG after drag-move:', d1);
              await sleepMs(250);
              // sweep: back-and-forth while drifting up (exercises shake detection too)
              for (let i = 0; i < 34; i++) {
                const wob = Math.floor(i / 4) % 2 === 0 ? 1 : -1;
                cx += wob * 9;
                cy -= 2;
                syntheticCursor = { x: cx, y: cy };
                const bx = petWin.getBounds();
                const dres = await petWin.webContents.executeJavaScript(
                  `window.dispatchEvent(new MouseEvent('mousemove',{clientX:${Math.round(cx - bx.x)},clientY:${Math.round(cy - bx.y)},bubbles:true}));JSON.stringify(window.__petdbg())`
                ).catch((e) => 'EXECJS-ERR:' + e.message);
                if (i < 2 || i === 16) console.log('DBG loop', i, dres);
                if (i === 16) {
                  const img = await petWin.webContents.capturePage();
                  fs2.writeFileSync(path.join(__dirname, 'out', 'drag-mid.png'), img.toPNG());
                }
                await sleepMs(42);
              }
              const img2 = await petWin.webContents.capturePage();
              fs2.writeFileSync(path.join(__dirname, 'out', 'drag-late.png'), img2.toPNG());
              await petWin.webContents.executeJavaScript(
                "window.dispatchEvent(new MouseEvent('mouseup',{button:0,bubbles:true}));'up'"
              );
              await sleepMs(700);
              const img3 = await petWin.webContents.capturePage();
              fs2.writeFileSync(path.join(__dirname, 'out', 'drag-end.png'), img3.toPNG());
              const b2 = petWin.getBounds();
              console.log('DRAG_TEST window moved from', b.x, b.y, 'to', b2.x, b2.y);
            } catch (e) { console.error('DRAG_TEST error:', e.message); }
            syntheticCursor = null;
            app.exit(0);
          })();
        }, 2600);
      });
      return;
    }

    // smoke-test mode (used by the dev harness): boot, screenshot, adopt, screenshot, exit
    if (process.env.SMOKE === '1') {
      createPetWindow();
      setTimeout(() => openPicker(), 800);
      setTimeout(() => {
        const fs2 = require('fs');
        const shots = {};
        const cap = (win, name) => {
          if (!win || win.isDestroyed()) return Promise.resolve();
          return win.webContents.capturePage().then((img) => {
            shots[name] = img;
            fs2.writeFileSync(path.join(__dirname, 'out', `smoke-${name}.png`), img.toPNG());
          }).catch(() => {});
        };
        cap(petWin, 'pet')
          .then(() => cap(pickerWin, 'picker'))
          .then(() => {
            // adopt pudding through the real IPC path
            if (pickerWin && !pickerWin.isDestroyed()) {
              return pickerWin.webContents.executeJavaScript("window.petAPI.adopt('pudding')").catch(() => {});
            }
          })
          .then(() => new Promise(r => setTimeout(r, 2500)))
          .then(() => cap(petWin, 'pet-adopted'))
          .then(() => {
            // question with choice buttons through the real IPC path
            sendToPet('cmd', { type: 'ask-rps' });
            return new Promise(r => setTimeout(r, 1800));
          })
          .then(() => cap(petWin, 'pet-question'))
          .then(() => {
            // answer via simulated click on a choice button
            return petWin.webContents.executeJavaScript(
              "(function(){var b=document.querySelector('#bubble-choices button');if(b){b.click();return 'clicked';}return 'no-button';})()"
            ).catch(() => 'js-error');
          })
          .then((r) => { console.log('SMOKE choice click:', r); return new Promise(rr => setTimeout(rr, 700)); })
          .then(() => cap(petWin, 'pet-answer'))
          .then(() => {
            sendToPet('cmd', { type: 'feed', kind: 'boba' });
            return new Promise(r => setTimeout(r, 2200));
          })
          .then(() => cap(petWin, 'pet-boba'))
          .then(() => {
            sendToPet('cmd', { type: 'dance' });
            return new Promise(r => setTimeout(r, 900));
          })
          .then(() => cap(petWin, 'pet-dance'))
          .then(() => {
            sendToPet('cmd', { type: 'time' });
            return new Promise(r => setTimeout(r, 700));
          })
          .then(() => cap(petWin, 'pet-time'))
          .then(() => app.exit(0));
      }, 3200);
      return;
    }

    createTray();
    applyShortcuts();
    if (!state.onboarded) {
      openPicker();
    } else {
      createPetWindow();
    }

    setInterval(cursorTick, 16);
    setInterval(saveState, 15000);

    screen.on('display-removed', () => {
      if (petWin && !petWin.isDestroyed()) {
        const b = petWin.getBounds();
        const c = clampPointToWorkArea(b.x, b.y);
        petWin.setPosition(c.x, c.y);
      }
    });
  });

  app.on('window-all-closed', () => {
    // Tray keeps the app alive unless quitting was requested
    if (!tray) app.quit();
  });

  app.on('before-quit', () => {
    saveState();
    try { globalShortcut.unregisterAll(); } catch (e) { }
    try { app.setLoginItemSettings({ openAtLogin: !!state.settings.autostart }); } catch (e) { }
  });
}

app.setAppUserModelId('com.pixelpals.desktop');
