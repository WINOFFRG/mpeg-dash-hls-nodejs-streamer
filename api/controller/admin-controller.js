const session = require('./session');
const { videoManager } = require('../../services/video-service');

const getVideoStatus = async (req, res) => {

    const requestId = (req.params.requestId).toString();
    const response = await session.getStaus(requestId);
    
    if(!response || !response.status) {
        next(response);
        return;
    }
    
    res.status(response.status).send(response.data);
};

const uploadVideo = async (req, res, next) => {

    req.locals = await session.generate();
    let contentHeader = req.headers["content-type"];

    if(!contentHeader.includes('multipart/form-data')) {
        res.status(400).send({
            message: 'Content-Type must be multipart/form-data',
            code: 'INVALID_CONTENT_TYPE',
        });
        return;
    }

    const response = await videoManager.uploadVideo(req, res);    

    if(!response || !response.status) {
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