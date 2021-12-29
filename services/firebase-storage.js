const firebase = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const firebaseConfig = require("../firebase.js");
const { storage } = require("firebase-admin");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: firebaseConfig.storageBucket,
});

const bucketStorage = firebase.storage().bucket();

module.exports = bucketStorage;