const { exec } = require('child_process');
const { type } = require('os');
const binaryPath = "./Tools/Bento4-SDK/bin";
const relativePath = "../../../uploads/";

// const execute = async (command) => exec(command, { cwd: binaryPath, shell: process.env.ComSpec }, function(error, stdout, stderr) {
    
//     if(stdout) {
//         return stdout;   
//     }
//     if (error) {
//         console.log(error);
//     }
// });

async function execute(command) {

        return new Promise((resolve, reject) => {
            exec(command, { cwd: binaryPath, shell: process.env.ComSpec }, function(error, stdout, stderr) {
                if(stdout) {
                    resolve(stdout);
                }
                if (error) {
                    reject(error);
                }
            });
        });
}
class Bento4 {
    
    static getVideoInfo() {

    }

    static async checkFragments(sessionObj) {

        try {
            const file = `${relativePath}${sessionObj.session}/${sessionObj.contentId}.mp4`;
            const data = await execute(`mp4info.exe ${file}`);                
            const lines = data.split('\n');

            for (const line in lines) {
                
                let lineData = lines[line].toString();
                
                if( lineData.includes("fragments:  yes")) {
                    // console.log(lineData);
                    return true;
                }
                
                if( lineData.includes("fragments:  no")) {
                    return false;
                }

                if( lineData.includes("No movie found in the file")) {
                    return new Error("No movie found in the file");
                }
            }

        } catch (error) {
            
        }
    }

    //fragmentVideo()
    //convertVideo()
    //postConversion()
}

let sessionObj = {
	"session": "d393c612-9741-48b5-b211-839e5bab1370",
	"contentId": 1640890969096,
	"expiry": "1/1/2022, 12:32 am"
};

// Bento4.checkFragments(sessionObj);

module.exports = Bento4;