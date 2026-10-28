'use strict';
/** The only bridge between the pages and the main process. Nothing else is exposed. */
const { contextBridge, ipcRenderer } = require('electron');

const on = (channel, cb) => {
  const handler = (_event, data) => cb(data);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
};

contextBridge.exposeInMainWorld('petAPI', {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (patch) => ipcRenderer.send('settings:update', patch),
  onSettings: (cb) => on('settings', cb),
  onCursor: (cb) => on('cursor', cb),
  onCommand: (cb) => on('command', cb),
  onDrag: (cb) => on('drag', cb),
  onWalkDone: (cb) => on('walk-done', cb),

  setInteractive: (v) => ipcRenderer.send('pet:interactive', !!v),
  dragStart: () => ipcRenderer.send('pet:drag-start'),
  dragEnd: () => ipcRenderer.send('pet:drag-end'),
  walk: (dx, ms) => ipcRenderer.send('pet:walk', { dx, ms }),
  walkStop: () => ipcRenderer.send('pet:walk-stop'),
  showMenu: () => ipcRenderer.send('pet:menu'),

  command: (type) => ipcRenderer.send('app:command', String(type)),
  openHome: () => ipcRenderer.send('app:home'),
  setVisible: (v) => ipcRenderer.send('app:visible', !!v),
  resetPosition: () => ipcRenderer.send('app:reset-position'),
  quit: () => ipcRenderer.send('app:quit'),
});
