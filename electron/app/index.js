const { ipcRenderer } = require('electron');
const QRCode = require('qrcode')
let $ = jQuery = require('jquery');

ipcRenderer.on('qr', (event, qr) => {
    var canvas = document.getElementById('canvas');
    QRCode.toCanvas(canvas, qr, function (error) {
        if (error) console.error(error)
        {
            console.log('success!');
            $("#divWelcome").hide();
            $("#divQR").removeClass("d-none");
            $("#divStaySignedin").removeClass("d-none");
        }
    })
})

$("#btnSignin").on("click", (event) => {
    $("#btnSignin span").removeClass("d-none");
    $("#btnSignin").attr("disabled","disabled");
    ipcRenderer.send("signing-in")
});