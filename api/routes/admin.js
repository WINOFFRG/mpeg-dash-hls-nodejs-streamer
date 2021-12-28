const app = require('express').Router();
const adminController = require('../controller/admin-controller');

app.post('/upload', adminController.uploadVideo)

module.exports = app;