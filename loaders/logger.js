const winston = require('winston');

const transports = [];

transports.push(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
        )
    })
);

const LoggerInstance = winston.createLogger({
    level: 'silly',
    levels: winston.config.npm.levels,
    format: winston.format.combine (
        winston.format.timestamp({
            format: "DD-MM-YYYY hh:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
    ),
    transports
});

module.exports = LoggerInstance;