
const { app, BrowserWindow, ipcMain } = require('electron');

// squirrel events
if(require('electron-squirrel-startup'))
	app.quit();

// SINGLE INSTANCE
const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
   app.quit();
}

// window creation
function createWindow () {
	const win = new BrowserWindow({
		webPreferences: {
			preload: `${__dirname}/preload.js`,
			nodeIntegration: true,
			contextIsolation: false,
		}
	});

	win.maximize();
	win.loadURL(`file://${__dirname}/www/index.html`);
	win.resizable = false;

}

// app events
app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

// ipcMain events
ipcMain.handle('quit-app', () => {
  app.quit();
});