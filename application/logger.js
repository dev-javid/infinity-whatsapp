const fs = require('fs');
var Spinner = require('cli-spinner').Spinner;

let LOG_FILE_PATH;

let spinner = new Spinner();
spinner.setSpinnerString('|/-\\');


function logLineInfo(message, arg1 = "", arg2 = "") {
    console.info("\r");
    console.info('\x1b[0m', message, arg1, arg2);
  
    if (arg1)
        message += arg1;
    if (arg2)
        message += arg1;

    fs.appendFile(LOG_FILE_PATH, "\r" + message, function (error) {
        if (error) {
            console.log('\x1b[31m', `Error logging`, error);
        }
    });
}


function logInfo(message, arg1 = "", arg2 = "") {
    console.log('\x1b[0m', message, arg1, arg2);
  
    if (arg1)
        message += arg1;
    if (arg2)
        message += arg1;

    fs.appendFile(LOG_FILE_PATH, "\r" + message, function (error) {
        if (error) {
            console.info('\x1b[31m', `Error logging`, error);
        }
    });
}


function logLineError(message, arg1 = "", arg2 = "") {
    console.log("\r");
    console.error('\x1b[31m', message, arg1, arg2);
  
    if (arg1)
        message += arg1;
    if (arg2)
        message += arg1;
        
    fs.appendFile(LOG_FILE_PATH, "\r" + message, function (error) {
        if (error) {
            console.log('\x1b[31m', `Error logging`, error);
        }
    });
}


function logError(message, arg1 = "", arg2 = "") {
    console.error('\x1b[31m', message, arg1, arg2);
  
    if (arg1)
        message += arg1;
    if (arg2)
        message += arg1;
        
    fs.appendFile(LOG_FILE_PATH, "\r" + message, function (error) {
        if (error) {
            console.log('\x1b[31m', `Error logging`, error);
        }
    });
}



function logLineSuccess(message, arg1 = "", arg2 = "") {
    console.info("\r");
    console.info('\x1b[32m', message, arg1, arg2);
  
    if (arg1)
        message += arg1;
    if (arg2)
        message += arg1;

    fs.appendFile(LOG_FILE_PATH, "\r" + message, function (error) {
        if (error) {
            console.log('\x1b[31m', `Error logging`, error);
        }
    });
}

function startProgress() {
    spinner.start();
}


function stopProgress() {
    spinner.stop();
}


function setLogPath(path) {
    LOG_FILE_PATH = path;
}



module.exports = {
    startProgress: startProgress,
    stopProgress: stopProgress,
    logLineInfo: logLineInfo,
    logInfo: logInfo,
    logLineError: logLineError,
    logError: logError,
    setLogPath: setLogPath
}