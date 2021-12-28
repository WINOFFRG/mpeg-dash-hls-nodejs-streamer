const express = require('express');
const admin = require('./routes/admin');
const videos = require('./routes/videos');

module.exports = () => {

    const app = express.Router();

    app.use('/admin', admin);
    app.use('/videos', videos);

    return app;
}