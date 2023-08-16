
const { ipcRenderer } = require('electron');

// making react know were running on electron
window.electron = true;

// quit function
window.quit = () => {
   ipcRenderer.invoke('quit-app');
}
