/* Generates assets/icon.png + assets/tray-<pet>.png via an offscreen Electron page. */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const ASSETS = path.join(__dirname, '..', 'assets');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 400, height: 300, show: false,
    webPreferences: { contextIsolation: true }
  });
  await win.loadFile(path.join(__dirname, 'asset-gen.html'));
  const result = await win.webContents.executeJavaScript('window.GEN_ASSETS()');

  const save = (name, dataUrl) => {
    const b64 = dataUrl.split(',')[1];
    fs.writeFileSync(path.join(ASSETS, name), Buffer.from(b64, 'base64'));
    console.log('wrote', name);
  };

  save('icon.png', result.icon);
  save('tray-mochi.png', result.tray_mochi);
  save('tray-biscuit.png', result.tray_biscuit);
  save('tray-pudding.png', result.tray_pudding);
  save('tray-luna.png', result.tray_luna);
  save('tray-clover.png', result.tray_clover);
  save('tray-miso.png', result.tray_miso);

  app.exit(0);
}).catch(err => { console.error(err); app.exit(1); });
