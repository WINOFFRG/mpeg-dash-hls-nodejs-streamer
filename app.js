const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./loaders/logger');
const config = require('./config');
const routes = require('./api');
const bodyParser = require('body-parser');

const app = express();

/* Configuring Application */
app.use(bodyParser.urlencoded({
    extended: true
 }));
app.use(express.json());
app.use(cors());
app.set('x-powered-by', false);

/* Configuring Routes */
app.get('/status', (req,res) => {
    res.status(200).end();
})

app.head('/status', (req,res) => {
    res.status(200).end();
});

app.use(config.api.prefix, routes());

/* Error Handling */
app.use((err, req, res, next) => {
    logger.error(err, err.stack);
    res.status(500).send({error: "Internal Server Error!"});
    next;
});

process.on('unhandledRejection', err => {
    logger.error(err, err.stack);
    // logger.error(err.message, {err});
    throw err;
});

/* Start Server */
(async () => {
    await new Promise((resolve, reject) => {
        require('http')
            .createServer(app)
            .listen(config.port, resolve)
            .on('error', reject);
    });
    logger.info('🔰 Server started on port 3000 🔰');
})();