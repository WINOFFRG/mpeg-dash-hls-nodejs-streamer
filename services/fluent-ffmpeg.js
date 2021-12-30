class ffmpeg {

    static checkVideoHealth() {
        console.log("Video Health Checker has been called!");
        return new Promise((resolve, reject) => {

            if(Math.random() > 0.5) {
                resolve();
            } else {
                reject(new Error("Video is not healthy!"));
            }
        });
    }
}

module.exports = ffmpeg;