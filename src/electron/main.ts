import { app, BrowserWindow, dialog } from "electron";
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import log from "electron-log";
import { getPreLoadPath } from "./pathResolver.js";

log.transports.file.level = "info";
autoUpdater.logger = log;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreLoadPath(),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL("http://localhost:5173");
  autoUpdater.checkForUpdatesAndNotify();
}

// AutoUpdater hodisalari
autoUpdater.on("update-available", () => {
  dialog.showMessageBox({
    type: "info",
    title: "Yangilanish Mavjud",
    message: "Yangi versiya topildi. Yuklanmoqda...",
  });
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Yangilanish Tayyor",
      message:
        "Yangilanish yuklandi. Ilovani qayta ishga tushirishni xohlaysizmi?",
      buttons: ["Ha", "Yo‘q"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
});

app.whenReady().then(createWindow);
