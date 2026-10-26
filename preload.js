/* Pixel Pals — preload: safe bridge between main and renderer */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('petAPI', {
  // main -> renderer
  onCursor: (cb) => ipcRenderer.on('cursor', (e, p) => cb(p)),
  onState: (cb) => ipcRenderer.on('state', (e, s) => cb(s)),
  onCommand: (cb) => ipcRenderer.on('cmd', (e, c) => cb(c)),

  // renderer -> main
  dragStart: () => ipcRenderer.send('drag-start'),
  dragEnd: () => ipcRenderer.send('drag-end'),
  hover: (h) => ipcRenderer.send('hover', h),
  contextMenu: () => ipcRenderer.send('context-menu'),
  openPicker: () => ipcRenderer.send('open-picker'),
  adopt: (petId) => ipcRenderer.send('adopt', petId),
  settingsUpdate: (patch) => ipcRenderer.send('settings-update', patch),
  hopMove: (dx, dy) => ipcRenderer.send('hop-move', { dx, dy }),
  quit: () => ipcRenderer.send('request-quit'),
  trayFace: (dataUrl) => ipcRenderer.send('tray-face', dataUrl)
});
