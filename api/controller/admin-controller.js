const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const filePath = path.join(__dirname, `../../uploads/${ Date.now() }`);
        
        /* Multer by default doesn't makes file if doesn't exisst, so use FS*/
        await fs.mkdir(filePath, {recursive: true});
        cb(null, filePath);
    },

    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const getVideoStatus = async (req, res) => {
    const videoId = req.params.videoId;
    res.send(videoId);
};

const uploadVideo = async (req, res) => {
    const file = req.body.file;
    console.log(file);
    res.send("Ok File!");
};

const deleteVideo = async (req, res) => {
    const videoId = req.params.videoId;
    res.send(videoId);
};

// const createSession = (req, res, next) => {
    
// };

// app.post('/upload', upload.single('file'), (req, res) => {
//     console.log(req.file);
//     console.log(Math.floor(req.file.size/1024/1024) + "MB");
//     res.send('This is Upload Video Route!');
// });

// const _uploadVideo = (req, res, next) => {
//     // console.log(req.file.);
//     res.send('This is Upload Video Route!');
// };

// const uploadVideo = [upload.single(('avatar')), _uploadVideo];

module.exports = {
    getVideoStatus,
    uploadVideo,
    deleteVideo,
}