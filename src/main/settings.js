'use strict';
/** Tiny JSON settings store in the user's app-data folder (atomic writes, always sanitised). */
const fs = require('fs');
const path = require('path');
const Pets = require('../shared/pets');

const DEFAULTS = {
  pet: 'mochi',
  scale: 4,                 // 3 small, 4 medium, 5 large
  chatty: 'normal',         // silent | quiet | normal | chatty
  alwaysOnTop: true,
  roam: true,
  lookAtCursor: true,
  sleepWhenIdle: true,
  sound: false,
  reminders: true,
  funContent: true,
  launchAtLogin: false,
  visible: true,
  pos: null,                // { x, y } of the pet window
  firstRun: true,
};

const BOOLS = ['alwaysOnTop', 'roam', 'lookAtCursor', 'sleepWhenIdle', 'sound', 'reminders', 'funContent', 'launchAtLogin', 'visible', 'firstRun'];

function sanitize(input) {
  const o = Object.assign({}, DEFAULTS, input);
  if (!Pets.PETS[o.pet]) o.pet = DEFAULTS.pet;
  o.scale = [3, 4, 5].includes(Number(o.scale)) ? Number(o.scale) : DEFAULTS.scale;
  if (!['silent', 'quiet', 'normal', 'chatty'].includes(o.chatty)) o.chatty = DEFAULTS.chatty;
  for (const k of BOOLS) o[k] = !!o[k];
  const p = o.pos;
  o.pos = p && Number.isFinite(p.x) && Number.isFinite(p.y) ? { x: Math.round(p.x), y: Math.round(p.y) } : null;
  return o;
}

class Store {
  constructor(dir) {
    this.dir = dir;
    this.file = path.join(dir, 'settings.json');
    this.data = sanitize(this.read());
  }
  read() { try { return JSON.parse(fs.readFileSync(this.file, 'utf8')); } catch (e) { return {}; } }
  get() { return this.data; }
  update(patch) { this.data = sanitize(Object.assign({}, this.data, patch)); this.save(); return this.data; }
  save() {
    try {
      fs.mkdirSync(this.dir, { recursive: true });
      const tmp = this.file + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2));
      fs.renameSync(tmp, this.file);
    } catch (e) { console.error('could not save settings', e); }
  }
}

module.exports = { Store, DEFAULTS, sanitize };
