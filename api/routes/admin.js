const app = require('express').Router();
const adminController = require('../controller/admin-controller');
const upload = adminController.upload;
const path = require('path');

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    console.log(path.extname(req.file.originalname));
    res.send('This is Upload Video Route!');
});

module.exports = app;