/* ============================================================
 * PIXEL PALS — preview app harness
 * ------------------------------------------------------------
 * Launches the adopt-a-buddy picker window in an interactive
 * developer preview session.
 * ============================================================ */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let previewWin = null;

app.whenReady().then(() => {
  previewWin = new BrowserWindow({
    width: 560,
    height: 860,
    title: 'Pixel Pals — Preview',
    transparent: true,
    frame: false,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  previewWin.loadFile(path.join(__dirname, '..', 'src', 'picker.html'), { query: { pet: 'mochi' } });

  ipcMain.on('adopt', (e, petId) => {
    console.log(`[preview] Selected pet for adoption: ${petId}`);
  });

  ipcMain.on('tray-face', () => {});
  ipcMain.on('settings-update', () => {});

  previewWin.on('closed', () => {
    previewWin = null;
    app.quit();
  });
});
