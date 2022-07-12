const fs = require('fs');
const path = require('path');
const { TEXT_MESSAGE_PATH, ATTACHMENTS_PATH, RECIPIENTS_PATH } = require('./directoryInfo');
const {  logLineInfo } = require('./logger');


function getAttachments() {
    logLineInfo('Reading attachments to be sent.');
    return fs.readdirSync(ATTACHMENTS_PATH);
}


function getText() {
    logLineInfo('Reading text message to be sent.');
    return fs.readFileSync(TEXT_MESSAGE_PATH, 'utf8');
}


function getRecipients() {
    logLineInfo('Reading recipent numbers.');
    var recipients = fs.readFileSync(RECIPIENTS_PATH, 'utf8');
    recipients = recipients?.split(/\r?\n/) ?? [];
    return recipients.filter(x=> x);
}



module.exports = {
    getText: getText,
    getAttachments: getAttachments,
    getRecipients: getRecipients,
}