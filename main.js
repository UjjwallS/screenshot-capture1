const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const screenshot = require('screenshot-desktop')

let mainWindow
let captureInterval = null

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true, // Required for minimal setup
      contextIsolation: false // Disabled for simplicity
    }
  })

  mainWindow.loadFile('index.html')

  // IPC Handlers
  ipcMain.on('start-capture', (event, interval) => {
    clearInterval(captureInterval)
    captureInterval = setInterval(() => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      screenshot({ filename: path.join(app.getPath('desktop'), 'screenshot_${timestamp}.png') })
    }, interval * 1000)
  })

  ipcMain.on('stop-capture', () => clearInterval(captureInterval))
})
