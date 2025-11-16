// Preload script for secure IPC
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  setPosition: (x: number, y: number) => {
    ipcRenderer.send('set-position', x, y);
  },
  moveWindow: (deltaX: number, deltaY: number) => {
    ipcRenderer.send('move-window', deltaX, deltaY);
  }
});
