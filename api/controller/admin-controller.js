const multer = require('multer');

const uploadVideo = (req, res, next) => {

    res.send('This is Upload Video Route!');
};

module.exports = {
    uploadVideo
}