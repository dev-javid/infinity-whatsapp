const { ipcRenderer } = require('electron');
const QRCode = require('qrcode')
const shell = require('electron').shell;
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

$("#lnkHelp").on('click', function(event) {
    event.preventDefault();
    shell.openExternal("https://faq.whatsapp.com/web/download-and-installation/how-to-log-in-or-out?lang=en");
});