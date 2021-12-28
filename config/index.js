const dotenv = require('dotenv');

const envFound = dotenv.config({path:__dirname + '/../.env'});

if(envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
    port: parseInt(process.env.PORT || 3000),
    api: {
        prefix: "/api"
    },
};