const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const printHandler = require('./printHandler');

let win;
function createWindow() {
  win = new BrowserWindow({
    icon: './images/visa.png',
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false, // Disable context isolation
    },
  });
  win.removeMenu();
  win.loadFile('index.html');
  win.on('closed', () => {
    mainWindow = null;
  });
  win.on('before-quit', (event) => {
    event.preventDefault();
  });
  win.on('resize', () => {
    const [width] = win.getSize();
    if (width < 750) {
      win.setSize(750, win.getSize()[1]); // Set minimum width to 400px
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('print-report', (event, cardData) => {
  console.log('Received card data in the main process:', cardData);
  printHandler.printReport(cardData, win);
});
