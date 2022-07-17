const { BrowserWindow } = require('electron');

let mainWindow = null;
const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.loadFile('app/index.html')
    mainWindow.webContents.openDevTools();
};

const getMainWindow = () => mainWindow;

module.exports = {
    createMainWindow,
    getMainWindow
}