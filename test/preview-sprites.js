/* Screenshot harness: renders the sprite preview page and saves a PNG. */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', 'out');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1240, height: 1780,
    show: true,
    webPreferences: { contextIsolation: true }
  });
  win.webContents.on('console-message', (e, level, msg) => console.log('[page]', msg));
  await win.loadFile(path.join(__dirname, 'preview.html'));
  await new Promise(r => setTimeout(r, 700));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(OUT, 'sprites.png'), img.toPNG());
  console.log('saved', path.join(OUT, 'sprites.png'));
  app.exit(0);
}).catch(err => { console.error(err); app.exit(1); });
