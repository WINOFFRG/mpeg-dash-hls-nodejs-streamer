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

    return {
        status: 200,
        data: JSON.parse(sessionObj),
    }
}

async function updateSession(sessionData) {
    const sessionPath = path.resolve(__dirname + `../../../uploads/${ sessionData.session }/status.json`);
    await fsPromise.writeFile(sessionPath, JSON.stringify(sessionData));
}

async function generateStatus(sessionObj) {
    
    try {
        let expiry = sessionObj.contentId;
        expiry = new Date(expiry);
        expiry = expiry.setDate(expiry.getDate() + 1);
        
        sessionObj['expiry'] = new Date(expiry).toLocaleDateString('en-IN', {
            hour: 'numeric',
            minute: 'numeric'
        });
    
        const sessionPath = path.resolve(__dirname + `../../../uploads/${ sessionObj.session }/status.json`);
        await fsPromise.writeFile(sessionPath, JSON.stringify(sessionObj));
        
    } catch (error) {
        console.log(error);
    }
}

const session = {
    generate: generateSession,
    setStatus: generateStatus,
    getStaus: findSession,
    updateSession,
}

module.exports = session;