import { app, BrowserWindow, dialog, ipcMain } from "electron";
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import log from "electron-log";
import { getPreLoadPath } from "./pathResolver.js";

log.transports.file.level = "info";
autoUpdater.logger = log;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreLoadPath(),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("http://localhost:5173");
  setupAutoUpdater();
}

function setupAutoUpdater() {
  // Yangilanish tekshiruvi
  autoUpdater.checkForUpdates();

  // Yangi versiya topilganda
  autoUpdater.on("update-available", () => {
    mainWindow?.webContents.send("update_available");
    dialog.showMessageBox({
      type: "info",
      title: "Yangilanish Mavjud",
      message: "Yangi versiya topildi. Yuklanmoqda...",
    });
  });

  // Yangilanish yuklab bo'linganda
  autoUpdater.on("update-downloaded", () => {
    mainWindow?.webContents.send("update_downloaded");
    dialog
      .showMessageBox({
        type: "info",
        title: "Yangilanish Tayyor",
        message:
          "Yangilanish yuklandi. Ilovani qayta ishga tushirishni xohlaysizmi?",
        buttons: ["Ha", "Yo'q"],
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });

  // Xato yuz berganda
  autoUpdater.on("error", (err) => {
    log.error("AutoUpdater xatosi:", err);
    dialog.showErrorBox(
      "Xato",
      "Yangilanishni tekshirishda xatolik yuz berdi. Iltimos, internetga ulanishni tekshiring."
    );
  });
}

// IPC handler for app restart
ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
