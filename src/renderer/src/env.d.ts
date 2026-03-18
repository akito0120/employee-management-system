/// <reference types="vite/client" />

declare global {
  interface Window {
    electron: import('@electron-toolkit/preload').ElectronToolkit
  }
}
