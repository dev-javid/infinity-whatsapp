//var QRCode = require('qrcode');
const { ipcRenderer } = require('electron');
const QRCode = require('qrcode')

console.log('👋 **** This message is being logged by "renderer.js", included via webpack');





// on receive todos
ipcRenderer.on('qr', (event, qr) => {
    // get the todoList ul
    var canvas = document.getElementById('canvas');

    QRCode.toCanvas(canvas, qr, function (error) {
        if (error) console.error(error)
        console.log('success!');
    })

})