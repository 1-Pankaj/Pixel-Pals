/* ============================================================
 * PIXEL PALS — GIF recorder harness
 * ------------------------------------------------------------
 * Captures an orchestrated demo sequence of the pet in action:
 * 1. Eye tracking (cursor sweeps, eyes follow)
 * 2. Petting interaction (hearts burst, happy face)
 * 3. Snack time (cookie drops, munching bites with crumbs)
 * 4. Dance party (wiggle + music notes)
 * 5. Interactive choice bubble ("Cats or dogs? -> Both!")
 *
 * Saves frames and compiles to assets/demo.gif using ffmpeg.
 * ============================================================ */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const WIDTH = 340;
const HEIGHT = 400;
const FRAMES_DIR = path.join(__dirname, '..', 'out', 'gif-frames');
const OUTPUT_GIF = path.join(__dirname, '..', 'assets', 'demo.gif');

if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
} else {
  // clean up any old frames
  fs.readdirSync(FRAMES_DIR).forEach(f => {
    if (f.endsWith('.png')) fs.unlinkSync(path.join(FRAMES_DIR, f));
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    show: true,
    frame: false,
    transparent: false,
    backgroundColor: '#1e1e2e', // Cozy dark background to avoid 1-bit GIF transparency artifacts
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });

  // Handle IPC calls from the renderer so it doesn't fail
  ipcMain.on('drag-start', () => {});
  ipcMain.on('drag-end', () => {});
  ipcMain.on('hover', () => {});
  ipcMain.on('context-menu', () => {});
  ipcMain.on('open-picker', () => {});
  ipcMain.on('adopt', () => {});
  ipcMain.on('settings-update', () => {});
  ipcMain.on('hop-move', () => {});
  ipcMain.on('tray-face', () => {});

  await win.loadFile(path.join(__dirname, '..', 'src', 'pet.html'), { query: { pet: 'mochi' } });

  // Inject a visible pixel cursor overlay
  await win.webContents.executeJavaScript(`
    (function () {
      document.body.style.background = '#1e1e2e';
      const c = document.createElement('div');
      c.id = 'demo-cursor';
      c.style.position = 'absolute';
      c.style.width = '18px';
      c.style.height = '24px';
      c.style.zIndex = '99999';
      c.style.pointerEvents = 'none';
      c.style.transform = 'translate(-2px, -2px)';
      c.style.transition = 'none';
      c.innerHTML = '<svg width="18" height="24" viewBox="0 0 18 24" fill="none"><path d="M1 1L7 22L11 14L17 12L1 1Z" fill="#ffffff" stroke="#11111b" stroke-width="2" stroke-linejoin="round"/></svg>';
      document.body.appendChild(c);
      window.__setDemoCursor = function(x, y) {
        c.style.left = x + 'px';
        c.style.top = y + 'px';
      };
    })()
  `);

  console.log('Window loaded, starting choreographed sequence...');
  await sleep(1200); // let pet finish greeting and settle

  let frameIndex = 0;
  async function captureFrame(cursorX, cursorY) {
    if (cursorX !== undefined && cursorY !== undefined) {
      await win.webContents.executeJavaScript(`window.__setDemoCursor(${cursorX}, ${cursorY})`);
      win.webContents.send('cursor', { x: cursorX, y: cursorY, wx: 0, wy: 0 });
    }
    const img = await win.webContents.capturePage();
    const pad = String(frameIndex).padStart(4, '0');
    fs.writeFileSync(path.join(FRAMES_DIR, `frame_${pad}.png`), img.toPNG());
    frameIndex++;
  }

  // --- ACT 1: Mouse movement & Eye tracking (24 frames) ---
  console.log('Act 1: Eye tracking...');
  for (let i = 0; i < 24; i++) {
    const t = i / 24;
    // Sweep cursor from top-left (40, 60) across in an arc to (290, 110)
    const cx = 40 + t * 250;
    const cy = 80 - Math.sin(t * Math.PI) * 40;
    await captureFrame(cx, cy);
    await sleep(45);
  }

  // --- ACT 2: Petting (Click to pet, hearts burst) (22 frames) ---
  console.log('Act 2: Petting...');
  // Move cursor down to pet head (170, 230)
  for (let i = 0; i < 8; i++) {
    const t = i / 8;
    const cx = 290 - t * 120;
    const cy = 110 + t * 120;
    await captureFrame(cx, cy);
    await sleep(40);
  }

  // Trigger pet interaction
  win.webContents.send('cmd', { type: 'pet' });
  for (let i = 0; i < 16; i++) {
    await captureFrame(170, 230);
    await sleep(55);
  }

  // --- ACT 3: Feeding a snack (28 frames) ---
  console.log('Act 3: Snack time...');
  win.webContents.send('cmd', { type: 'feed', kind: 'cookie' });
  for (let i = 0; i < 28; i++) {
    // move cursor slightly away to watch pet eat
    const cx = 170 + (i / 28) * 80;
    const cy = 230 - (i / 28) * 90;
    await captureFrame(cx, cy);
    await sleep(65);
  }

  // --- ACT 4: Dance party! (26 frames) ---
  console.log('Act 4: Dance party...');
  win.webContents.send('cmd', { type: 'dance' });
  for (let i = 0; i < 26; i++) {
    const cx = 250 - (i / 26) * 160;
    const cy = 140 + Math.sin(i * 0.5) * 15;
    await captureFrame(cx, cy);
    await sleep(55);
  }

  // --- ACT 5: Question with Choice Buttons (30 frames) ---
  console.log('Act 5: Question & choice...');
  win.webContents.send('cmd', { type: 'ask-rps' });
  for (let i = 0; i < 16; i++) {
    await captureFrame(120, 160);
    await sleep(70);
  }

  // Click the choice button (Rock)
  await win.webContents.executeJavaScript(`
    (function () {
      const btn = document.querySelector('#bubble-choices button');
      if (btn) btn.click();
    })()
  `);
  for (let i = 0; i < 18; i++) {
    await captureFrame(170, 300);
    await sleep(70);
  }

  console.log(`Captured ${frameIndex} frames. Compiling GIF with ffmpeg...`);

  // Compile using ffmpeg two-pass palette optimization for crisp pixel art
  try {
    const palettePath = path.join(FRAMES_DIR, 'palette.png');
    // Generate high quality custom 256-color palette
    execSync(
      `ffmpeg -y -framerate 16 -i "${FRAMES_DIR}/frame_%04d.png" -vf "fps=16,scale=${WIDTH}:-1:flags=lanczos,palettegen=stats_mode=diff" "${palettePath}"`,
      { stdio: 'inherit' }
    );
    // Render final GIF using the palette
    execSync(
      `ffmpeg -y -framerate 16 -i "${FRAMES_DIR}/frame_%04d.png" -i "${palettePath}" -lavfi "fps=16,scale=${WIDTH}:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3" "${OUTPUT_GIF}"`,
      { stdio: 'inherit' }
    );
    console.log(`\nSUCCESS: Generated ${OUTPUT_GIF}`);
  } catch (err) {
    console.error('FFmpeg error:', err.message);
  }

  app.quit();
});
