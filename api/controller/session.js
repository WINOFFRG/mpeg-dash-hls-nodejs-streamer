const genuuid = require('uuid').v4;

async function generateSession() {

    const sessionObj = {
        id: genuuid(),
        time: Date.now(),
    }

    return sessionObj;
}

async function restoreSession() {

}

const session = {
    generate: generateSession,
    restore: restoreSession,
}

module.exports = session;