const genuuid = require('uuid').v4;
const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');

async function generateSession() {

    const sessionObj = {
        session: genuuid(),
        contentId: Date.now(),
    }

    return sessionObj;
}

async function restoreSession() {

}

async function findSession(id) {
    
    const sessionPath = path.resolve(__dirname + '../../../uploads/' + id);
    const sessionExists = fs.existsSync(sessionPath);
    if(!sessionExists) {
        return {
            status: 404,
            data: {
                message: "The session is invalid or has expired",
            },
        }
    }
    const sessionObj = await fsPromise.readFile(sessionPath + `/status.json`, 'utf8');
    console.log(sessionObj);

    return {
        status: 200,
        data: JSON.parse(sessionObj),
    }
}

async function generateStatus(sessionObj) {
    
    let expiry = sessionObj.contentId;
    expiry = new Date(expiry);
    expiry = expiry.setDate(expiry.getDate() + 1);
    
    sessionObj['expiry'] = new Date(expiry).toLocaleDateString('en-IN', {
        hour: 'numeric',
        minute: 'numeric'
    });

   await fsPromise.writeFile(__dirname + `../../uploads/${ sessionObj.session }/status.json`, JSON.stringify(sessionObj));
}

const session = {
    generate: generateSession,
    restore: restoreSession,
    setStatus: generateStatus,
    getStaus: findSession,
}

module.exports = session;