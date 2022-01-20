const multer = require('multer');
const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const logger = require('../loaders/logger');
const session = require('../api/controller/session');
const ffmpeg = require('./fluent-ffmpeg');
const bento4 = require('./bento4-service');
const firebaseService = require('./firebase-storage');
const glob = require('glob');
const rimraf = require('rimraf');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const filePath = path.join(__dirname, `../uploads/${ req.locals.session }`);

        /*
            File object can be accessed via file
            console.log(file);
        */

        /* Multer by default doesn't makes file if doesn't exisst, so use FSPromise*/
        await fsPromise.mkdir(filePath, {
            recursive: true
        });
        cb(null, filePath);
    },

    filename: (req, file, cb) => {
        cb(null, `${ req.locals.contentId + path.extname(file.originalname).toLowerCase() }`);
    },
});

const multerUpload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {

        req.locals.fileType = path.extname(file.originalname).toLowerCase();

        const allowedTypes = ['.mp4', '.webm', '.mkv', '.avi', '.mpeg'];

        if (!allowedTypes.includes(path.extname(file.originalname).toLowerCase())) {
            return cb(
                new multer.MulterError('CUSTOM', {
                    message: 'File type not allowed',
                    code: 'FILE_TYPE_NOT_ALLOWED',
                })
            );
        }

        cb(null, true);
    }
}).single('file');

/*
    .single('file') defines the name of the file input field
*/

const multerPromise = (req, res) => {

    return new Promise((resolve, reject) => {

        multerUpload(req, res, function (err) {

            if (err) {
                reject(err);
            }

            resolve(req.file);
        });
    });
};

class videoManager {

    static async uploadVideo(req, res) {

        try {
            await multerPromise(req, res);

            videoManager.processVideo(req.locals);

            return {
                status: 200,
                data: req.locals,
            };

        } catch (error) {

            if (error instanceof multer.MulterError) {

                if (!error.message) error.message = error.field.message;

                return {
                    status: 400,
                    data: {
                        message: "Request failed to process.",
                        error: error.message || error.field.message,
                    },
                }
            };

            await videoManager.preCleanUp(req);
            return error;
        }
    }

    static async processVideo(sessionObj) {

        let currentSession = {};

        try {
            await session.setStatus(sessionObj);

            currentSession = await session.getStaus(sessionObj.session);
            currentSession = currentSession['data'];
            currentSession['data'] = {
                'type': 'timeline',
                'status': 'processing',
                'jobs': {
                    health: '',
                    fragments: '',
                    converting: '',
                    uploading: '',
                    cleaning: '',
                }
            }

            let jobs = currentSession['data']['jobs'];
            await session.updateSession(currentSession);

            logger.info("🔰 1/5 | Video Health");
            // await ffmpeg.checkVideoHealth();
            jobs['health'] = 'success';
            await session.updateSession(currentSession);

            logger.info("🔰 2/5 | Checking Video");
            const fragmentationRequired = await bento4.checkFragments(sessionObj);

            logger.info("🔰 2/5 | Fragmenting Video");
            if (fragmentationRequired) {
                const response = await bento4.fragmentVideo(sessionObj);
                jobs['fragments'] = 'success';

                if (response instanceof Error) {
                    jobs['fragments'] = 'failed';
                    await session.updateSession(currentSession);
                    throw res;
                }
            } else {
                jobs['fragments'] = 'skipped';

                const fileExt = sessionObj.fileType;
                const oldFileName = path.join(__dirname, `../uploads/${sessionObj.session}/${sessionObj.contentId}${fileExt}`);
                const newFileName = path.join(__dirname, `../uploads/${sessionObj.session}/${sessionObj.contentId}_fragmented${fileExt}`);
                await fsPromise.rename(oldFileName, newFileName);
            }
            await session.updateSession(currentSession);

            logger.info("🔰 3/5 | Processing Video");
            await bento4.processVideo(sessionObj);
            jobs['converting'] = 'success';
            await session.updateSession(currentSession);

            logger.info("🔰 4/5 | Uploading Video");
            const url = await firebaseService.upload(sessionObj);
            jobs['uploading'] = 'success';
            currentSession['publicURL'] = url;
            await session.updateSession(currentSession);

            logger.info("🔰 5/5 | Cleaning Up");
            const dirPath = path.join(__dirname, `../uploads/${sessionObj.session}`);
            await videoManager.postCleanUp(dirPath);
            jobs['cleaning'] = 'success';
            currentSession['data']['status'] = 'complete';
            await session.updateSession(currentSession);

            //scheduleJobs()
        } catch (error) {

            console.log("Fallback in Catch");
            logger.error(error);

            if (error.name === 'functional') {
                currentSession["data"]["status"] = "failed";
                await session.updateSession(currentSession);
            }

            return error;
        }
    }

    //todo solve sessionObj
    static async preCleanUp(sessionObj) {

        try {
            const filePath = path.join(__dirname, `../uploads/${sessionObj.session}`);

            await fsPromise.rm(filePath, {
                recursive: true
            });

        } catch (error) {
            console.log(error);
        }

        return;
    }

    static async postCleanUp(path) {

        const files = await fsPromise.readdir(path);

        try {
            for(const file of files) {     
                
                if(file == 'status.json') continue;

                const currPath = `${path}\\${file}`;
   
                await fsPromise.rm(currPath, {
                    recursive: true
                });
            }            

        } catch (error) {
            logger.error(error);
            return error;
        }
    }

}

module.exports = {
    videoManager,
    multerUpload,
};