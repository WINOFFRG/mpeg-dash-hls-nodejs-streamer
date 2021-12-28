const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const filePath = path.join(__dirname, `../../uploads/${ Date.now() }`);
        await fs.mkdir(filePath, {recursive: true});
        cb(null, filePath);
    },

    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const createSession = (req, res, next) => {
    
};

const _uploadVideo = (req, res, next) => {
    // console.log(req.file.);
    res.send('This is Upload Video Route!');
};

// const uploadVideo = [upload.single(('avatar')), _uploadVideo];

module.exports = {
    upload
}