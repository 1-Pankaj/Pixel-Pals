/* Generates assets/pals-banner.png: all 6 pets side-by-side with labels */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 220,
    show: false,
    webPreferences: { contextIsolation: true }
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @font-face {
          font-family: 'Pixelify Sans';
          src: url('../assets/fonts/pixelify-sans-latin-700-normal.woff2') format('woff2');
        }
        body {
          margin: 0;
          background: #181825;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          height: 100vh;
          font-family: 'Pixelify Sans', monospace;
          color: #cdd6f4;
          box-sizing: border-box;
          padding: 10px 20px;
        }
        .card {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #1e1e2e;
          border: 1.5px solid #313244;
          border-radius: 12px;
          padding: 12px 14px 10px;
          width: 105px;
        }
        canvas {
          image-rendering: pixelated;
          width: 64px;
          height: 64px;
        }
        .name {
          font-size: 13px;
          font-weight: bold;
          margin-top: 8px;
          color: #fab387;
          letter-spacing: 0.5px;
        }
        .species {
          font-size: 9px;
          color: #a6adc8;
          margin-top: 2px;
        }
      </style>
    </head>
    <body>
      <div id="root" style="display:flex; width:100%; justify-content:space-between;"></div>
      <script src="../src/sprites.js"></script>
      <script>
        const root = document.getElementById('root');
        const list = [
          { id: 'mochi', name: 'Mochi', species: 'Cat', color: '#fab387' },
          { id: 'biscuit', name: 'Biscuit', species: 'Dog', color: '#f9e2af' },
          { id: 'pudding', name: 'Pudding', species: 'Slime', color: '#a6e3a1' },
          { id: 'luna', name: 'Luna', species: 'Ghost', color: '#cba6f7' },
          { id: 'clover', name: 'Clover', species: 'Bunny', color: '#f5c2e7' },
          { id: 'miso', name: 'Miso', species: 'Axolotl', color: '#eba0ac' }
        ];

        list.forEach(item => {
          const pet = PIXEL_PALS.build(item.id);
          const card = document.createElement('div');
          card.className = 'card';

          const c = pet.renderToCanvas(2, { face: 'open', mouth: 'idle', tail: 0, sprout: 0 });
          const name = document.createElement('div');
          name.className = 'name';
          name.textContent = item.name;
          name.style.color = item.color;

          const spec = document.createElement('div');
          spec.className = 'species';
          spec.textContent = item.species;

          card.appendChild(c);
          card.appendChild(name);
          card.appendChild(spec);
          root.appendChild(card);
        });
      </script>
    </body>
    </html>
  `;

  const tmpHtml = path.join(__dirname, 'tmp-banner.html');
  fs.writeFileSync(tmpHtml, html, 'utf8');

  await win.loadFile(tmpHtml);
  await new Promise(r => setTimeout(r, 600));

  const img = await win.webContents.capturePage();
  const outPath = path.join(__dirname, '..', 'assets', 'pals-banner.png');
  fs.writeFileSync(outPath, img.toPNG());
  console.log('Saved banner to', outPath);

  try { fs.unlinkSync(tmpHtml); } catch (e) {}
  app.exit(0);
});
