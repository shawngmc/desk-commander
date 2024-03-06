// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const exec = require("child_process").exec;
const path = require("path");
const isDev = import('electron-is-dev');

let mainWindow;
let child;


// Create the browser window.
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "gui.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://$(path.join(__dirname, 'build', 'index.html'))`

  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => (mainWindow = null));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
