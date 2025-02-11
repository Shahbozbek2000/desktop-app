// src/electron/preload.ts
import { contextBridge, ipcRenderer } from "electron";

// IPC wrapper
const electronHandler = {
  onUpdateAvailable: (callback: () => void) => {
    ipcRenderer.on("update_available", () => callback());
  },
  onUpdateDownloaded: (callback: () => void) => {
    ipcRenderer.on("update_downloaded", () => callback());
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
  restartApp: () => {
    ipcRenderer.send("restart_app");
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronHandler);
