'use strict';
/**
 * Pixel Pals, main process.
 *
 *  - One transparent, frameless, always-on-top, non-focusable window holds the pet.
 *    It never steals focus from what you are working on.
 *  - The cursor is polled here (so the pet's eyes follow it everywhere on the screen) and sent
 *    to the renderer, which decides if the mouse is over the pet or over empty space.
 *    Over empty space the window is click-through.
 *  - Dragging and roaming move the window from here, using integer bounds every time.
 */
const { app, BrowserWindow, Tray, Menu, screen, ipcMain, nativeImage } = require('electron');
const path = require('path');
const { Store } = require('./settings');
const Pets = require('../shared/pets');
const Icons = require('../shared/icons');

const PRELOAD = path.join(__dirname, 'preload.js');
const PET_HTML = path.join(__dirname, '..', 'renderer', 'pet.html');
const HOME_HTML = path.join(__dirname, '..', 'renderer', 'home.html');

const winSize = (scale) => ({ width: Math.max(340, 64 * scale + 24), height: 64 * scale + 130 });
const feetInset = (scale) => 8 * scale;           // transparent rows below the pet's feet (64 - 56)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

let store = null, petWin = null, homeWin = null, tray = null, quitting = false;
let cursorTimer = null, topTimer = null, drag = null, dragTimer = null, walkAnim = null;
let lastCursor = { x: -1, y: -1, wx: 0, wy: 0 }, lastSent = 0;

if (process.platform === 'linux') app.commandLine.appendSwitch('enable-transparent-visuals');

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => openHome());
  app.on('window-all-closed', () => { /* keep living in the tray */ });
  app.on('before-quit', () => { quitting = true; });
  app.whenReady().then(start);
}

/* ───────────────────────────── start-up ───────────────────────────── */
function start() {
  app.setAppUserModelId('com.pixelpals.app');
  store = new Store(app.getPath('userData'));
  Menu.setApplicationMenu(null);
  registerIpc();
  createPetWindow();
  createTray();
  applyLoginItem();
  if (store.get().firstRun) { store.update({ firstRun: false }); openHome(); }
}

const publicSettings = () => Object.assign({}, store.get(), { packaged: app.isPackaged, version: app.getVersion(), platform: process.platform });
const alive = (w) => w && !w.isDestroyed();
const send = (channel, payload) => { if (alive(petWin)) petWin.webContents.send(channel, payload); };
const broadcast = (channel, payload) => { for (const w of [petWin, homeWin]) if (alive(w)) w.webContents.send(channel, payload); };

/* ───────────────────────────── pet window ───────────────────────────── */
function isVisiblePos(pos, size) {
  const cx = pos.x + size.width / 2, cy = pos.y + size.height - 40;
  return screen.getAllDisplays().some((d) => cx >= d.bounds.x && cx <= d.bounds.x + d.bounds.width && cy >= d.bounds.y && cy <= d.bounds.y + d.bounds.height);
}

function defaultPosition(scale) {
  const size = winSize(scale), wa = screen.getPrimaryDisplay().workArea;
  return { x: Math.round(wa.x + wa.width - size.width - 60), y: Math.round(wa.y + wa.height - size.height + feetInset(scale)) };
}

function createPetWindow() {
  const s = store.get(), size = winSize(s.scale);
  const pos = s.pos && isVisiblePos(s.pos, size) ? s.pos : defaultPosition(s.scale);

  petWin = new BrowserWindow({
    width: size.width, height: size.height, x: pos.x, y: pos.y,
    transparent: true, frame: false, hasShadow: false, backgroundColor: '#00000000',
    resizable: false, maximizable: false, minimizable: false, fullscreenable: false,
    skipTaskbar: true, focusable: false, alwaysOnTop: s.alwaysOnTop, show: false,
    title: 'Desktop Pet',
    webPreferences: {
      preload: PRELOAD, contextIsolation: true, nodeIntegration: false, sandbox: true,
      backgroundThrottling: false, autoplayPolicy: 'no-user-gesture-required', spellcheck: false, devTools: !app.isPackaged,
    },
  });

  petWin.setAlwaysOnTop(s.alwaysOnTop, 'screen-saver');
  if (process.platform === 'darwin') petWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  petWin.setIgnoreMouseEvents(true, { forward: true });
  petWin.loadFile(PET_HTML);
  petWin.once('ready-to-show', () => {
    petWin.setBounds({ x: pos.x, y: pos.y, width: size.width, height: size.height });
    if (store.get().visible) petWin.showInactive();
  });
  petWin.on('closed', () => { petWin = null; });
  petWin.webContents.on('will-navigate', (e) => e.preventDefault());
  petWin.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  startCursorLoop();
  clearInterval(topTimer);
  topTimer = setInterval(() => {   // the taskbar likes to steal "topmost"; politely take it back
    if (alive(petWin) && petWin.isVisible() && store.get().alwaysOnTop) { petWin.setAlwaysOnTop(true, 'screen-saver'); petWin.moveTop(); }
  }, 4000);
}

/** Poll the real cursor (works anywhere on screen) and tell the renderer where it is. */
function startCursorLoop() {
  clearInterval(cursorTimer);
  cursorTimer = setInterval(() => {
    if (!alive(petWin) || !petWin.isVisible()) return;
    const c = screen.getCursorScreenPoint(), b = petWin.getBounds(), now = Date.now();
    const changed = c.x !== lastCursor.x || c.y !== lastCursor.y || b.x !== lastCursor.wx || b.y !== lastCursor.wy;
    if (!changed && now - lastSent < 250) return;
    lastCursor = { x: c.x, y: c.y, wx: b.x, wy: b.y }; lastSent = now;
    const disp = screen.getDisplayMatching(b), d = disp.bounds, a = disp.workArea;
    petWin.webContents.send('cursor', { x: c.x, y: c.y, wx: b.x, wy: b.y, ww: b.width, wh: b.height, dx: d.x, dy: d.y, dw: d.width, dh: d.height, ax: a.x, ay: a.y, aw: a.width, ah: a.height });
  }, 16);
}

/** After a drag or a walk, make sure the pet is still on a screen, and remember where it is. */
function settle() {
  if (!alive(petWin)) return;
  const b = petWin.getBounds(), inset = feetInset(store.get().scale);
  const cx = b.x + b.width / 2, feet = b.y + b.height - inset;
  const d = screen.getDisplayNearestPoint({ x: Math.round(cx), y: Math.round(feet) }).bounds;
  const nx = Math.round(clamp(cx, d.x + 24, d.x + d.width - 24) - b.width / 2);
  const ny = Math.round(clamp(feet, d.y + 100, d.y + d.height) - (b.height - inset));
  if (nx !== b.x || ny !== b.y) petWin.setBounds({ x: nx, y: ny, width: b.width, height: b.height });
  store.update({ pos: { x: nx, y: ny } });
}

function resizeForScale(next, prev) {
  if (!alive(petWin)) return;
  const b = petWin.getBounds(), ns = winSize(next);
  const feet = b.y + b.height - feetInset(prev), cx = b.x + b.width / 2;
  petWin.setBounds({ x: Math.round(cx - ns.width / 2), y: Math.round(feet - (ns.height - feetInset(next))), width: ns.width, height: ns.height });
  settle();
}

function setVisible(v) {
  store.update({ visible: !!v });
  if (alive(petWin)) { if (v) { petWin.showInactive(); send('command', { type: 'hello' }); } else petWin.hide(); }
  broadcast('settings', publicSettings());
  refreshTrayMenu();
}

/* ───────────────────────────── dragging & roaming ───────────────────────────── */
function stopWalk() { if (walkAnim) { clearInterval(walkAnim.timer); walkAnim = null; } }

function startDrag() {
  if (!alive(petWin)) return;
  stopWalk();
  const c = screen.getCursorScreenPoint(), b = petWin.getBounds();
  drag = { ox: c.x - b.x, oy: c.y - b.y, w: b.width, h: b.height, lastX: b.x, lastT: Date.now(), lastSend: 0 };
  clearInterval(dragTimer);
  dragTimer = setInterval(() => {
    if (!drag || !alive(petWin)) return;
    const p = screen.getCursorScreenPoint(), x = Math.round(p.x - drag.ox), y = Math.round(p.y - drag.oy), now = Date.now();
    petWin.setBounds({ x, y, width: drag.w, height: drag.h });       // always pass the size: avoids DPI drift
    if (now - drag.lastSend > 30) {
      send('drag', { vx: ((x - drag.lastX) / Math.max(1, now - drag.lastT)) * 1000 });
      drag.lastX = x; drag.lastT = now; drag.lastSend = now;
    }
  }, 8);
}

function endDrag() {
  clearInterval(dragTimer); dragTimer = null;
  if (!drag) return;
  drag = null;
  settle();
}

function walkBy(dx, ms) {
  if (!alive(petWin) || drag) return;
  stopWalk();
  const b = petWin.getBounds(), d = screen.getDisplayMatching(b).workArea;
  const lo = d.x + 30 - b.width / 2, hi = d.x + d.width - 30 - b.width / 2;
  const from = b.x, to = Math.round(clamp(b.x + dx, lo, hi)), t0 = Date.now(), dur = Math.max(300, ms);
  const timer = setInterval(() => {
    if (!alive(petWin)) { stopWalk(); return; }
    const k = clamp((Date.now() - t0) / dur, 0, 1), e = k * k * (3 - 2 * k);
    petWin.setBounds({ x: Math.round(from + (to - from) * e), y: b.y, width: b.width, height: b.height });
    if (k >= 1) { stopWalk(); settle(); send('walk-done', {}); }
  }, 16);
  walkAnim = { timer };
}

/* ───────────────────────────── settings side-effects ───────────────────────────── */
function applyLoginItem() {
  if (!app.isPackaged) return;     // in development this would register a bare Electron
  try { app.setLoginItemSettings({ openAtLogin: !!store.get().launchAtLogin }); } catch (e) { /* ignore */ }
}

function updateSettings(patch) {
  const prev = store.get(), next = store.update(patch);
  if (next.scale !== prev.scale) resizeForScale(next.scale, prev.scale);
  if (next.alwaysOnTop !== prev.alwaysOnTop && alive(petWin)) petWin.setAlwaysOnTop(next.alwaysOnTop, 'screen-saver');
  if (next.launchAtLogin !== prev.launchAtLogin) applyLoginItem();
  if (next.visible !== prev.visible && alive(petWin)) { if (next.visible) petWin.showInactive(); else petWin.hide(); }
  broadcast('settings', publicSettings());
  refreshTray();
  return next;
}

/* ───────────────────────────── menus ───────────────────────────── */
function buildMenu() {
  const s = store.get(), meta = Pets.get(s.pet);
  const cmd = (type) => () => send('command', { type });
  const radio = (label, checked, patch) => ({ label, type: 'radio', checked, click: () => updateSettings(patch) });
  const check = (label, key) => ({ label, type: 'checkbox', checked: !!s[key], click: (item) => updateSettings({ [key]: item.checked }) });
  return Menu.buildFromTemplate([
    { label: meta.name + ' the ' + meta.species, enabled: false },
    { type: 'separator' },
    { label: 'Give a treat', click: cmd('treat') },
    { label: 'Pet me', click: cmd('pet') },
    { label: 'Do a trick', click: cmd('trick') },
    { label: 'Take a nap', click: cmd('nap') },
    {
      label: 'Say something',
      submenu: [
        { label: 'Anything', click: cmd('say') }, { label: 'Tell me a joke', click: cmd('joke') }, { label: 'Fun fact', click: cmd('fact') },
        { label: 'Cheer me up', click: cmd('cheer') }, { label: 'Compliment me', click: cmd('compliment') }, { label: 'Wellness nudge', click: cmd('care') },
      ],
    },
    { type: 'separator' },
    { label: 'Switch pet', submenu: Pets.list.map((p) => radio(p.name + ' the ' + p.species, s.pet === p.id, { pet: p.id })) },
    { label: 'Size', submenu: [['Small', 3], ['Medium', 4], ['Large', 5]].map(([l, v]) => radio(l, s.scale === v, { scale: v })) },
    { label: 'Chattiness', submenu: [['Silent', 'silent'], ['Quiet', 'quiet'], ['Normal', 'normal'], ['Chatty', 'chatty']].map(([l, v]) => radio(l, s.chatty === v, { chatty: v })) },
    { type: 'separator' },
    check('Always on top', 'alwaysOnTop'), check('Roam around the screen', 'roam'), check('Look at my cursor', 'lookAtCursor'),
    check('Sleep when idle', 'sleepWhenIdle'), check('Sounds', 'sound'),
    { type: 'separator' },
    { label: 'Open Pet Home...', click: openHome },
    { label: 'Bring pet back to the corner', click: resetPosition },
    { label: 'Hide pet', click: () => setVisible(false) },
    { label: 'Quit', click: quitApp },
  ]);
}

function resetPosition() {
  if (!alive(petWin)) return;
  const s = store.get(), size = winSize(s.scale), p = defaultPosition(s.scale);
  petWin.setBounds({ x: p.x, y: p.y, width: size.width, height: size.height });
  store.update({ pos: p });
  if (!petWin.isVisible()) setVisible(true);
}

/* ───────────────────────────── tray ───────────────────────────── */
function trayImage() {
  const img = nativeImage.createEmpty(), id = store.get().pet;
  img.addRepresentation({ scaleFactor: 1, buffer: Icons.png(id, 16) });
  img.addRepresentation({ scaleFactor: 2, buffer: Icons.png(id, 32) });
  return img;
}

function createTray() {
  tray = new Tray(trayImage());
  tray.setToolTip('Pixel Pals');
  tray.on('click', () => setVisible(!store.get().visible));
  refreshTrayMenu();
}

function refreshTray() {
  if (!tray) return;
  tray.setImage(trayImage());
  refreshTrayMenu();
}

function refreshTrayMenu() {
  if (!tray) return;
  const s = store.get();
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: s.visible ? 'Hide pet' : 'Show pet', click: () => setVisible(!s.visible) },
    { label: 'Give a treat', click: () => { if (!s.visible) setVisible(true); send('command', { type: 'treat' }); } },
    { label: 'Switch pet', submenu: Pets.list.map((p) => ({ label: p.name + ' the ' + p.species, type: 'radio', checked: s.pet === p.id, click: () => updateSettings({ pet: p.id }) })) },
    { label: 'Open Pet Home...', click: openHome },
    { label: 'Bring pet back to the corner', click: resetPosition },
    { type: 'separator' },
    { label: 'Quit Pixel Pals', click: quitApp },
  ]));
}

/* ───────────────────────────── home window ───────────────────────────── */
function openHome() {
  if (alive(homeWin)) { if (homeWin.isMinimized()) homeWin.restore(); homeWin.show(); homeWin.focus(); return; }
  homeWin = new BrowserWindow({
    width: 940, height: 760, minWidth: 800, minHeight: 640, show: false, title: 'Pixel Pals',
    backgroundColor: '#edeaff', autoHideMenuBar: true,
    icon: nativeImage.createFromBuffer(Icons.png(store.get().pet, 256)),
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#edeaff', symbolColor: '#2b2250', height: 44 },
    webPreferences: { preload: PRELOAD, contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false, devTools: !app.isPackaged },
  });
  homeWin.loadFile(HOME_HTML);
  homeWin.once('ready-to-show', () => homeWin.show());
  homeWin.on('closed', () => { homeWin = null; });
  homeWin.webContents.on('will-navigate', (e) => e.preventDefault());
  homeWin.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

/* ───────────────────────────── quitting ───────────────────────────── */
function quitApp() {
  if (quitting) return;
  quitting = true;
  settle();
  if (alive(petWin) && petWin.isVisible()) { send('command', { type: 'goodbye' }); setTimeout(() => app.quit(), 1900); }
  else app.quit();
}

/* ───────────────────────────── IPC ───────────────────────────── */
function registerIpc() {
  const fromPet = (e) => alive(petWin) && e.sender === petWin.webContents;
  const fromApp = (e) => (alive(petWin) && e.sender === petWin.webContents) || (alive(homeWin) && e.sender === homeWin.webContents);

  ipcMain.handle('settings:get', (e) => (fromApp(e) ? publicSettings() : null));
  ipcMain.on('settings:update', (e, patch) => { if (fromApp(e) && patch && typeof patch === 'object') updateSettings(patch); });

  ipcMain.on('pet:interactive', (e, on) => { if (fromPet(e)) petWin.setIgnoreMouseEvents(!on, { forward: true }); });
  ipcMain.on('pet:drag-start', (e) => { if (fromPet(e)) startDrag(); });
  ipcMain.on('pet:drag-end', (e) => { if (fromPet(e)) endDrag(); });
  ipcMain.on('pet:walk', (e, d) => { if (fromPet(e) && d && Number.isFinite(d.dx) && Number.isFinite(d.ms)) walkBy(d.dx, d.ms); });
  ipcMain.on('pet:walk-stop', (e) => { if (fromPet(e)) { stopWalk(); settle(); } });
  ipcMain.on('pet:menu', (e) => { if (fromPet(e)) buildMenu().popup({ window: petWin }); });

  ipcMain.on('app:command', (e, type) => { if (fromApp(e)) { if (!store.get().visible) setVisible(true); send('command', { type: String(type) }); } });
  ipcMain.on('app:home', (e) => { if (fromApp(e)) openHome(); });
  ipcMain.on('app:visible', (e, v) => { if (fromApp(e)) setVisible(!!v); });
  ipcMain.on('app:reset-position', (e) => { if (fromApp(e)) resetPosition(); });
  ipcMain.on('app:quit', (e) => { if (fromApp(e)) quitApp(); });
}
