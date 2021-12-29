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
        cb(null, `${ Date.now() + path.extname(file.originalname) }`);
    }
});

const multerUpload = multer({ 
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 },
}).single('file');

class videoManager {

    static async uploadVideo(req, res) {

        let response = {
            status: '',
            data: {},
        }

        multerUpload(req, res, function (err) {

            if(err) {
                logger.error(err, {err});

                if(err instanceof multer.MulterError) {
                    response.status = 400;
                    response.data = {
                        error: err.message,
                    }
                }

                videoManager.cleanUp(req);
                return;
            }
            //ye kaam asyc ho nahi raha phir bhi response khaali print ho rha hai

            response.status = 200;
            response.data = req.locals;
        });

        console.log(response);
        return response;
    }

    static async cleanUp(req) {
        const filePath = path.join(__dirname, `../uploads/${ req.locals.id }`);
        await fs.rm(filePath, {recursive: true});
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