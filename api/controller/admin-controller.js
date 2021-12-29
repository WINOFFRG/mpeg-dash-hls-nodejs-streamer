const session = require('./session');
const {videoManager, multerUpload} = require('../../services/video-service');
const { response } = require('express');
const getVideoStatus = async (req, res) => {

    const sessionObj = await session.restore();
    console.log(sessionObj);
};


const uploadVideo = async (req, res, next) => {
    
    req.locals = await session.generate();
    const response = await videoManager.uploadVideo(req, res);    
    
    if(!response.status) {
        next(response);
        return;
    }
    
    res.status(response.status).send(response.data);
};

const deleteVideo = async (req, res) => {
};

module.exports = {
    getVideoStatus,
    uploadVideo,
    deleteVideo,
}