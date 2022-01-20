const firebase = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const firebaseConfig = require("../firebase.js");
const { storage } = require("firebase-admin");
const path = require("path");
const fsPromises = require("fs").promises;

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: firebaseConfig.storageBucket,
});

const bucketStorage = firebase.storage().bucket();
const bucketBase = 'https://storage.googleapis.com/nodejs-streaming.appspot.com';

async function uploadRecursively(directory, destinationBase) {

    try {
        const files = await fsPromises.readdir(directory);
        
        for(const file of files){
            const currPath = `${directory}\\${file}`;
            const stat = await fsPromises.lstat(currPath);
            
            if(stat.isDirectory()){
                await uploadRecursively(currPath, `${destinationBase}/${file}`);
            }
            else {
                await bucketStorage.upload(currPath, { destination: `${destinationBase}/${file}` });
            }
        }
        
    } catch (error) {
        console.log(error);
    }
}

async function upload(sessionObj) {
    
    const uploadFolderPath = path.join(__dirname, `../uploads/${sessionObj.session}/baked`);
    const destinationBase = `uploads/${sessionObj.session}/${sessionObj.contentId}`;

    try {
        await uploadRecursively(uploadFolderPath, destinationBase);
        const manifestUrl = `${bucketBase}/${destinationBase}/manifest.mpd`;
        return manifestUrl;

    } catch (error) {
        console.log(error["errors"]);
        return error;
    }
}

/* Set CORS Config on Bucket*/
async function setBucketCors() {
    
    const corsConfiguration = [{
        "origin": ["*"],
        "method": ["GET"],
        "maxAgeSeconds": 3600
      }]; 
    bucketStorage.setCorsConfiguration(corsConfiguration).then(function(data) {
        const apiResponse = data[0];
        console.log(apiResponse.cors);
    });
}

/* Remove CORS Config from Bucket*/
async function removeBucketCors() {
    await bucketStorage.setCorsConfiguration([]);
  
    console.log(`Removed CORS configuration from bucket`);
} 

let firebaseService = {
    upload,
};

module.exports = firebaseService;