const fs = require('fs');
const path = require('path');
const { logLineInfo, setLogPath, logInfo,stopProgress } = require('./logger');


const SECURE_DATA_PATH = path.join(path.resolve(__dirname, '..'), "secure-data");
const MESSAGE_CONENT_PATH = path.join(SECURE_DATA_PATH, "message-content");
const SESSION_PATH = path.join(SECURE_DATA_PATH, "session");
const RECIPIENTS_PATH = path.join(MESSAGE_CONENT_PATH, "recipients.txt");
const TEXT_MESSAGE_PATH = path.join(MESSAGE_CONENT_PATH, "text-message.txt");
const ATTACHMENTS_PATH = path.join(MESSAGE_CONENT_PATH, "attachments");

let current_datetime = new Date();
let dateDirectory = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear();
let timeDirectory = current_datetime.getHours() + "-" + current_datetime.getMinutes();
const REPORT_DIRECTORY_FOR_DAY = path.join(SECURE_DATA_PATH, "reports", dateDirectory);
const REPORT_DIRECTORY_PATH = path.join(REPORT_DIRECTORY_FOR_DAY,  timeDirectory);
const REPORT_FILE_PATH = path.join(REPORT_DIRECTORY_PATH, "status.json");
const LOG_FILE_PATH = path.join(REPORT_DIRECTORY_PATH, "log.txt");


const reportData = {
    delivered: [],
    undelivered: []
}

function initializeDirectories() {
    setLogPath(LOG_FILE_PATH);
    if (!fs.existsSync(REPORT_DIRECTORY_FOR_DAY)) {
        fs.mkdirSync(REPORT_DIRECTORY_FOR_DAY);
    }     
    if (!fs.existsSync(REPORT_DIRECTORY_PATH)) {
        fs.mkdirSync(REPORT_DIRECTORY_PATH);
    }
    if (!fs.existsSync(SESSION_PATH)) {
        fs.mkdirSync(SESSION_PATH);
    }

    fs.writeFile(REPORT_FILE_PATH, JSON.stringify(reportData), function (err) {
        if (err) {
            logLineError('Error occured while initializing report file .', REPORT_FILE_PATH);
            throw err;
        }
    });
    fs.writeFile(LOG_FILE_PATH, "", function (err) {
        if (err) {
            logLineError('Error occured while initializing log file .', LOG_FILE_PATH);
            throw err;
        }
    });
}


function printFilePaths() {
    logLineInfo(`Recipient numbers will be read from '${RECIPIENTS_PATH}'`)
    logInfo(`Text message to be sent will be read from '${TEXT_MESSAGE_PATH}'`)
    logInfo(`Any attachments(files, pictures, audio & video etc) to be sent will be read from '${ATTACHMENTS_PATH}'`)
    logLineInfo(`Once the process is completed report will be generated to '${REPORT_FILE_PATH}'`)
    logInfo(`Once the process is completed you can find the logs at '${LOG_FILE_PATH}'`)
}



function generateReport(reportData) {
    logLineInfo("Generating report.")
    fs.writeFile(REPORT_FILE_PATH, JSON.stringify(reportData), function (err) {
        if (err) {
            logLineError('Error occured while generating report file .', REPORT_FILE_PATH);
            throw err;
        }
        logLineInfo("Report generated to.", REPORT_FILE_PATH);
        stopProgress();
        logLineInfo("Process completed.")
        console.log("\x1b[0m");
    });
}



function getLogFile() {
    return LOG_FILE_PATH;
}

module.exports = {
    printFilePaths: printFilePaths,
    initializeDirectories: initializeDirectories,
    getLogFile: getLogFile,
    generateReport: generateReport,
    SESSION_PATH: SESSION_PATH,
    RECIPIENTS_PATH: RECIPIENTS_PATH,
    TEXT_MESSAGE_PATH: TEXT_MESSAGE_PATH,
    ATTACHMENTS_PATH: ATTACHMENTS_PATH,
    REPORT_DIRECTORY_PATH: REPORT_DIRECTORY_PATH,
    REPORT_FILE_PATH: REPORT_FILE_PATH
}