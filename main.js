const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const screenshot = require('screenshot-desktop');

let mainWindow;
let intervalId = null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: { nodeIntegration: true }
  });

  mainWindow.loadFile('index.html');

  ipcMain.on('start-capture', (event, { seconds, folder }) => {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      screenshot({ filename: path.join(folder, 'screenshot_${timestamp}.png') });
    }, seconds * 1000);
  });

  ipcMain.on('stop-capture', () => clearInterval(intervalId));
  ipcMain.handle('select-folder', () => dialog.showOpenDialog({ properties: ['openDirectory'] }));
});