const app = require('express').Router();

// app.get('/:file/manifest.mpd', (req, res) => {
//     console.log(req.params.file);
//     res.sendFile(path.join(__dirname, `../../uploads/${req.params.file}/baked/manifest.mpd`)); 
//     app.use(express.static(path.join(__dirname, `../../uploads/${req.params.file}/baked`)));
// });

module.exports = app;