/* Probes whether synthetic DOM events + petAPI work in the pet window */
const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 340, height: 400, x: 200, y: 200, show: true, frame: false, transparent: true,
    webPreferences: { preload: path.join(__dirname, '..', 'preload.js'), contextIsolation: true, nodeIntegration: false, backgroundThrottling: false }
  });
  win.loadFile(path.join(__dirname, '..', 'src', 'pet.html'), { query: { pet: 'mochi' } });
  win.webContents.once('did-finish-load', () => {
    setTimeout(() => {
      (async () => {
        const api = await win.webContents.executeJavaScript("typeof window.petAPI + '/' + typeof window.dispatchEvent");
        console.log('PROBE api:', api);
        await win.webContents.executeJavaScript(
          "window.__evts=[];['mousedown','mousemove','mouseup'].forEach(function(t){window.addEventListener(t,function(e){window.__evts.push(t+':'+Math.round(e.clientX||0)+','+Math.round(e.clientY||0))})});'armed'"
        );
        await win.webContents.executeJavaScript("window.dispatchEvent(new MouseEvent('mousedown',{button:0,clientX:170,clientY:300,bubbles:true}));1");
        await new Promise(r => setTimeout(r, 150));
        await win.webContents.executeJavaScript("window.dispatchEvent(new MouseEvent('mousemove',{clientX:190,clientY:290,bubbles:true}));1");
        await new Promise(r => setTimeout(r, 300));
        const evts = await win.webContents.executeJavaScript("JSON.stringify(window.__evts)");
        console.log('PROBE events:', evts);
        const hover = await win.webContents.executeJavaScript("window.__probeDrag === undefined ? 'n/a' : window.__probeDrag");
        app.exit(0);
      })().catch(e => { console.error('PROBE error', e.message); app.exit(1); });
    }, 1500);
  });
});
