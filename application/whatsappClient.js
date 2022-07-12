const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
require('dotenv').config();
const { Client,  MessageMedia } = require('whatsapp-web.js');
const { getRecipients, getAttachments, getText } = require('./dataLoader');
const { ATTACHMENTS_PATH } = require('./directoryInfo');
const { generateReport } = require('./directoryInfo');
const { setSession,getAuthStrategy } = require('./authentication');
const { logLineError, logInfo, logLineInfo } = require('./logger');


const TEXT_MESSAGE = "TEXT_MESSAGE";
const ATTACHMENT_MESSAGE = "ATTACHMENT_MESSAGE";
const COUNTRY_CODE = process.env.COUNTRY_CODE;


let reportData = {
    delivered: [],
    undelivered: []
}


const client = new Client({
    authStrategy: getAuthStrategy()
});

function initializeClient() {
    logLineInfo('Initializing whatsapp client.');
    client.initialize();
}


client.on('authenticated', (session) => {
    setSession(session);
});


client.on('qr', async qr => {

    logLineInfo("Please scan the qr code using whatsapp application.");

    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {

    logLineInfo('Whatsapp client is ready!');
    var text = getText();
    var attachments = getAttachments();
    var recipients = getRecipients();


    logInfo('Total recipients:', recipients.length);
    logInfo('attachments count:', attachments.length);

    let completed = 0;
    for (let index = 0; index < recipients.length; index++) {
        var waitTime = (index + 1) * 5000;
        setTimeout(() => {
            sendMessageAsync(recipients[index], text, attachments).
                then(() => {
                    completed++;
                }).catch(() => {
                    completed++;
                });
        }, waitTime);
    }

    var intervalId = setInterval(() => {
        if (completed >= recipients.length) {
            generateReport(reportData);
            clearInterval(intervalId);
        }
    }, 300);
});

async function sendMessageAsync(number, text, attachments) {
    //await sleep(3000);
    const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
    const final_number = `${COUNTRY_CODE}${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India

    const number_details = await client.getNumberId(final_number); // get mobile number details

    if (number_details) {
        await sendTextAsync(number_details, text, number);
        await sendAttachmentsAsync(number_details, attachments, number);
    }
    else {
        logLineError(`Error sending message to ${number}`, "Mobile number is not registered.");
        saveStatus(false, number, null, null, null, "Mobile number is not registered.");
    }
}

async function sendTextAsync(number_details, text, number) {
    try {
        logLineInfo(`Sending text message to ${number}`);
        const sendMessageData = await client.sendMessage(number_details._serialized, text); // send message
        saveStatus(true, number, TEXT_MESSAGE, text, null, null);
    } catch (error) {
        logLineError(`Error sending text message to ${number}`, error);
        saveStatus(false, number, TEXT_MESSAGE, text, null, error.message + ". " + error.stack);
    }
}


async function sendAttachmentsAsync(number_details, attachments, number) {
    attachments.forEach(async (fileName) => {
        const filePath = path.join(ATTACHMENTS_PATH, fileName);
        try {

            logLineInfo(`Sending attachment to ${number}`, filePath);
            const attachment = MessageMedia.fromFilePath(filePath);
            await client.sendMessage(number_details._serialized, attachment);
            saveStatus(true, number, ATTACHMENT_MESSAGE, null, filePath, null);
        } catch (error) {

            logLineError(`Error sending attachment to ${number}`, filePath, error);
            saveStatus(false, number, ATTACHMENT_MESSAGE, null, filePath, error.message + ". " + error.stack);
        }
    });
}


function saveStatus(messageSent, number, messageType, message, attachmentPath, error) {
    if (messageSent) {
        var item = {
            number: number,
            messageType: messageType,
            message: message,
            attachmentPath: attachmentPath
        }
        reportData.delivered.push(item);
    }
    else {
        var item = {
            number: number,
            messageType: messageType,
            attachmentPath: attachmentPath,
            message: message,
            error: error
        }
        reportData.undelivered.push(item);
    }
}

module.exports = {
    initializeClient: initializeClient,
    sendMessageAsync: sendMessageAsync
};  