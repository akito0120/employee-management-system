import 'reflect-metadata';

import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow, shell } from 'electron';
import { createIPCHandler } from 'electron-trpc/main';
import { join } from 'path';
import { container } from 'tsyringe';

import { db, migrateDB } from './db';
import seedDB from './db/seed';
import { AuditLogService } from './modules/audit-logs/audit-log.service';
import { SessionInfo } from './modules/auth/session-info';
import { appRouter } from './router';

container.register('Database', { useValue: db });
container.registerSingleton(SessionInfo);
container.registerSingleton(AuditLogService);

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  });

  createIPCHandler({
    router: appRouter,
    windows: [mainWindow]
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.maximize();

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  migrateDB();
  await seedDB();
  electronApp.setAppUserModelId('com.electron');

  const mainWindow = createWindow();
  if (mainWindow) {
    optimizer.watchWindowShortcuts(mainWindow);
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.disableHardwareAcceleration();
