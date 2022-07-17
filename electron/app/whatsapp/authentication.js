const { ipcMain } = require("electron")
const { initialize } = require("./client")

const attachAuthEvents = () => {
    ipcMain.on('signing-in', (event, todo) => {
       // window.send('signing-in')
       initialize();
    })
}

module.exports = {
    attachAuthEvents
}