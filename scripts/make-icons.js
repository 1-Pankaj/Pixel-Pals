'use strict';
/** npm run icons -> build/icon.ico, build/icon.png (used by electron-builder) + a preview of each pet icon. */
const fs = require('fs');
const path = require('path');
const Icons = require('../src/shared/icons');
const Pets = require('../src/shared/pets');

const out = path.join(__dirname, '..', 'build');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'icon.ico'), Icons.ico('mochi'));
fs.writeFileSync(path.join(out, 'icon.png'), Icons.png('mochi', 256));
for (const p of Pets.list) fs.writeFileSync(path.join(out, 'icon-' + p.id + '.png'), Icons.png(p.id, 128));
console.log('icons written to build/ (icon.ico, icon.png, icon-<pet>.png)');
