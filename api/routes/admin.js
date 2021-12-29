const app = require('express').Router();
const adminController = require('../controller/admin-controller');

app.get('/:videoId/status', adminController.getVideoStatus);
app.post('/upload', adminController.upload);
app.delete('/:videoId/delete', adminController.deleteVideo);

module.exports = app;