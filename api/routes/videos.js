const app = require('express').Router();

app.get('/', (req, res) => {
    res.send('Hello World from video route!');
});

module.exports = app;