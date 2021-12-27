const express = require('express');
const cors = require('cors');
const winston = require('winston');
const path = require('path');

const app = express();

/* Configuring Application */
app.use(express.json());
app.use(cors());
app.set('x-powered-by', false);

/* Configuring Logger */
winston.add(
    new winston.transports.Console({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(winston.format.colorize({level: true}), winston.format.simple()),
    })
);

/* Start Server */
(async () => {
    await new Promise((resolve, reject) => {
        require('http')
            .createServer(app)
            .listen(3000, resolve)
            .on('error', reject);
    });
    winston.info('🔰 Server started on port 3000 🔰');
})();