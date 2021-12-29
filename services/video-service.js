const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../loaders/logger');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const filePath = path.join(__dirname, `../uploads/${ req.locals.id }`);

        /* Multer by default doesn't makes file if doesn't exisst, so use FS*/
        await fs.mkdir(filePath, {recursive: true});
        cb(null, filePath);
    },

    filename: (req, file, cb) => {
        cb(null, `${ Date.now() + path.extname(file.originalname).toLowerCase() }`);
    },
});

const multerUpload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {

        const allowedTypes = ['.mp4', '.webm', '.mkv', '.avi', '.mpeg'];

        if(!allowedTypes.includes(path.extname(file.originalname).toLowerCase())) {    
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

const multerPromise = (req, res) => {

    return new Promise((resolve, reject) => {
        multerUpload(req, res, function (err) {
        
            if(err) {
                reject(err);
            }

            resolve(req.file);
        });
    });
};
class videoManager {

    static async uploadVideo(req, res) {

        try {
            // await multerFileFilter(req, res);
            await multerPromise(req, res);
            videoManager.processVideo(req.local);

            return {
                status: 200,
                data: req.locals,
            };

        } catch (error) {

            videoManager.preCleanUp(req);

            if(error instanceof multer.MulterError) {

                if(!error.message) error.message = error.field.message;

                return {
                    status: 400,
                    data: {
                        message: "Request failed to process.",
                        error: error.message || error.field.message,
                    }, 
                }
            };

            return error;
        }
    }

    static async processVideo(req) {

        try {
            //checkVideoCorrupt()
            //processVideo()
            //postCleanUp()
            //uploadVideo()
            //scheduleJobs()
        } catch (error) {
            //prepareError()
        }
    }

    static async preCleanUp(req) {
        const filePath = path.join(__dirname, `../uploads/${ req.locals.id }`);
        
        try {
            await fs.rm(filePath, {recursive: true});
        } catch (error) {
        
        }
    }

    // getVideoStatus();
    // deleteVideo();
    // scheduleDeleteJob();
    // fileValidations();
    // afterJob()
}

module.exports = {
    videoManager,
    multerUpload,
};