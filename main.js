const { 
    app, 
    BrowserWindow, 
} = require('electron');

const path = require('path');
const os = require('os');
const fs = require('fs');

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1264,
      height: 712,
      autoHideMenuBar: true,
      minWidth: 813,
      minHeight: 488,
      icon: __dirname + '/src/images/logo.ico',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
  
    win.loadFile(path.join(__dirname, 'src/index.html'));

    // win.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
  