const { app, ipcMain, safeStorage, BrowserWindow } = require('electron');
const path = require('node:path');

process.loadEnvFile();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
    icon: '/assets/images/logo.png',
    title: 'Athena PRM',
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('getAppDataDirectory', async () => {
  return app.getPath('appData');
});

ipcMain.handle('encrypt', async (_, string) => {
  return safeStorage.encryptString(string);
});

ipcMain.handle('decrypt', async (_, buffer) => {
  return safeStorage.decryptString(buffer);
});
