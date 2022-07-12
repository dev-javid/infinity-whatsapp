const fs = require('fs');
const path = require('path');
const { logLineError } = require('./logger');
const { LegacySessionAuth, NoAuth } = require('whatsapp-web.js');
const { SESSION_PATH } = require('./directoryInfo');
const SESSION_FILE_PATH = path.join(SESSION_PATH, 'session.json');


const AUTH_TYPE = process.env.AUTH_TYPE;
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    if (AUTH_TYPE && AUTH_TYPE == "LEGACY")
        sessionData = require(SESSION_FILE_PATH);
}

function getAuthStrategy() {
    if (AUTH_TYPE && AUTH_TYPE == "LEGACY") {
        return new LegacySessionAuth({
            session: sessionData
        });
    }
    return new NoAuth();
}


function setSession(session) {
    if (AUTH_TYPE && AUTH_TYPE == "LEGACY") {
        sessionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
            if (err) {
                logLineError(err);
            }
        });
    }
}


module.exports = {
    setSession: setSession,
    getAuthStrategy: getAuthStrategy
};

