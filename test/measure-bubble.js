/* Measures bubble anchor centering inside the pet window */
const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 340, height: 400, show: false,
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile(path.join(__dirname, '..', 'src', 'pet.html'), { query: { pet: 'mochi' } });
  win.webContents.once('did-finish-load', () => {
    setTimeout(() => {
      win.webContents.executeJavaScript(`
        (function () {
          var a = document.getElementById('bubble-anchor').getBoundingClientRect();
          var b = document.getElementById('bubble').getBoundingClientRect();
          return JSON.stringify({
            anchor: { x: a.x, w: a.width },
            bubble: { x: b.x, w: b.width, cx: b.x + b.width / 2 },
            winW: window.innerWidth
          });
        })()
      `).then((r) => { console.log('MEASURE', r); app.exit(0); });
    }, 1200);
  });
});
