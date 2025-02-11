import { app, BrowserWindow, ipcMain } from "electron";
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import path from "path";
import { isDev } from "./util.js";
import { pollResources } from "./resourceManager.js";
import { getPreLoadPath } from "./pathResolver.js";

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: getPreLoadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  pollResources();
};

app.whenReady().then(() => {
  createWindow();

  if (!isDev() && mainWindow) {
    autoUpdater.checkForUpdates();
  }
});

// Handle window controls
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Auto-updater events
autoUpdater.on("update-available", () => {
  if (mainWindow) {
    mainWindow.webContents.send("update_available");
  }
});

autoUpdater.on("update-downloaded", () => {
  if (mainWindow) {
    mainWindow.webContents.send("update_downloaded");
  }
});

// IPC handlers
ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
