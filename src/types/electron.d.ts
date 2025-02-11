export interface IElectronAPI {
  onUpdateAvailable: (callback: () => void) => void;
  onUpdateDownloaded: (callback: () => void) => void;
  removeAllListeners: (channel: string) => void;
  restartApp: () => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
