const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// Path setup

var X1 = Math.random();
var X2 = Math.random();

var t = 0;
var dt = 0.010;
var k = 2;
var a = 200;

var pathDim = 250;

// TODO: fix process error on window close!
var timerHandle = null;

function update_path(k, a) {
  var val = a * (Math.sin(k*t+2*Math.PI*X1)+Math.sin(2*k*t+2*Math.PI*X2));
  t += dt;
  //console.log(val.toString() + '\n');
  if (mainWindow.webContents) {
    mainWindow.webContents.send('new-path-data', val.toString());
  }
  return;
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.

  // scaling down the window in line with plot scale down
  mainWindow = new BrowserWindow({width: 800, height: 600});

  //mainWindow.maximize();
  //mainWindow.setFullScreen(true);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
//  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-finish-load', function() {
    var i;
    for (i=0; i<pathDim; i++) {
      update_path(k, a);
    }
    mainWindow.webContents.send('ready-to-draw', true);
    setInterval(update_path, 5, k, a);
  });

  // Emitted when the window is closed.
  mainWindow.webContents.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
