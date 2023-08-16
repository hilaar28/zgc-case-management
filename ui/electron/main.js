
const { app, BrowserWindow } = require('electron');

// SINGLE INSTANCE
const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
   return app.quit();
}

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
	window.resizable = false;

}

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