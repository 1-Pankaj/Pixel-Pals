/* Fires every new command through the real IPC path and checks for renderer errors */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(() => {
  if (!fs.existsSync(path.join(__dirname, '..', 'out'))) fs.mkdirSync(path.join(__dirname, '..', 'out'));

  const win = new BrowserWindow({
    width: 340, height: 400, x: 100, y: 100, show: true, frame: false, transparent: true,
    webPreferences: { preload: path.join(__dirname, '..', 'preload.js'), contextIsolation: true, nodeIntegration: false, backgroundThrottling: false }
  });

  const errors = [];
  win.webContents.on('console-message', (e, level, msg) => {
    if (level >= 2) errors.push(msg);
  });

  win.loadFile(path.join(__dirname, '..', 'src', 'pet.html'), { query: { pet: 'miso' } });

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const send = (type, extra) => win.webContents.send('cmd', Object.assign({ type }, extra || {}));

  win.webContents.once('did-finish-load', () => {
    setTimeout(async () => {
      try {
        const shots = [];
        const cap = (name) => win.webContents.capturePage().then(img => {
          fs.writeFileSync(path.join(__dirname, '..', 'out', `ex-${name}.png`), img.toPNG());
          shots.push(name);
        });

        // trivia question + correct-answer path
        send('ask-yesno'); await sleep(1500); await cap('yesno');
        send('choice', { index: 0 }); await sleep(1600);

        send('ask-trivia'); await sleep(1500); await cap('trivia');
        send('choice', { index: 1 }); await sleep(900);

        send('ask-feelings'); await sleep(1400); await cap('feelings');
        send('choice', { index: 0 }); await sleep(900);

        send('ask-coin'); await sleep(1200);
        send('choice', { index: 0 }); await sleep(2600); await cap('coin');

        send('ask-8ball'); await sleep(1200);
        send('choice', { index: 0 }); await sleep(3400); await cap('8ball');

        send('ask-knock'); await sleep(1200); await cap('knock1');
        // knock steps now chain after each line fully displays (calm pacing)
        send('choice', { index: 0 }); await sleep(3000); await cap('knock2');
        send('choice', { index: 0 }); await sleep(5200);
        send('choice', { index: 0 }); await sleep(1200); await cap('knock3');

        
        send('breathe'); await sleep(2300); await cap('breathe');
        send('dismiss'); await sleep(600);

        send('story'); await sleep(4500); await cap('story');

        send('ask-snack'); await sleep(1300); await cap('snackq');
        send('choice', { index: 2 }); await sleep(3200); await cap('snack-eat');

        send('stats'); await sleep(1000);
        send('countdown-set', { minutes: 1 }); await sleep(900); await cap('countdown');
        send('countdown-done', { minutes: 1 }); await sleep(900); await cap('alarm');
        send('wake'); await sleep(600);
        send('time'); await sleep(900);

        // question timeout path
        send('ask'); await sleep(47000); await cap('timeout');

        console.log('EXERCISE done. shots:', shots.join(','));
        console.log('EXERCISE renderer errors:', errors.length ? errors.join(' | ') : 'NONE');
        app.exit(0);
      } catch (e) {
        console.error('EXERCISE fatal:', e.message);
        app.exit(1);
      }
    }, 2200);
  });
});
