const { initializeClient } = require('./whatsappClient');
const { initializeDirectories,printFilePaths } = require('./directoryInfo');
const {  logLineInfo,  startProgress} = require('./logger');

console.log("\x1b[0m");

startProgress();
initializeDirectories();
logLineInfo("Starting the process.")
printFilePaths();
initializeClient();