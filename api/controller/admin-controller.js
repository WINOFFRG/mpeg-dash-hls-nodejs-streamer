const session = require('./session');
const { videoManager } = require('../../services/video-service');

const getVideoStatus = async (req, res) => {

    const requestId = (req.params.requestId).toString();
    const response = await session.getStaus(requestId);
    
    if(!response.status) {
        next(response);
        return;
    }
    
    res.status(response.status).send(response.data);
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