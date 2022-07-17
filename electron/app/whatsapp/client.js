
const { Client, MessageMedia } = require('whatsapp-web.js');
const { mainWindow, getMainWindow } = require('../windows');
const client = new Client({
    //authStrategy: getAuthStrategy()
});

function initialize() {
    //logLineInfo('Initializing whatsapp client.');
    client.initialize();
}


client.on('authenticated', async (session) => {
    // setSession(session);
    await sendMessageAsync(9990976815, "sample msg");
});


client.on('qr', async qr => {
    getMainWindow().webContents.send("qr", qr);
    console.log("qr", qr);
    //logLineInfo("Please scan the qr code using whatsapp application.");
    //    var qr= qrcode.generate(qr, { small: true });
});


async function sendMessageAsync(number, text) {
    //await sleep(3000);
    const COUNTRY_CODE = "91";
    const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
    const final_number = `${COUNTRY_CODE}${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India

    const number_details = await client.getNumberId(final_number); // get mobile number details

    if (number_details) {
        await sendTextAsync(number_details, text, number);
    }
    else {
        logLineError(`Error sending message to ${number}`, "Mobile number is not registered.");
        saveStatus(false, number, null, null, null, "Mobile number is not registered.");
    }
}


async function sendTextAsync(number_details, text, number) {
    try {
        const sendMessageData = await client.sendMessage(number_details._serialized, text); // send message
    } catch (error) {
    }
}

module.exports = {
    initialize
}