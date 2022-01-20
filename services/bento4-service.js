const { exec } = require('child_process');
const binaryPath = "./Tools/Bento4-SDK/bin";
const relativePath = "../../../uploads/";

async function execute(command) {

        return new Promise((resolve, reject) => {
            exec(command, { cwd: binaryPath, shell: process.env.ComSpec }, function(error, stdout, stderr) {
                if(stderr) {
                    reject(stderr);
                }
                if (error) {
                    reject(error);
                }
                resolve(stdout);
            });
        });
}
class Bento4 {

    static async checkFragments(sessionObj) {

        try {
            const file = `${relativePath}${sessionObj.session}/${sessionObj.contentId}.mp4`;
            const execRes = await execute(`mp4info.exe ${file}`);                
            const lines = execRes.split('\n');

            for (const line in lines) {
                
                let lineData = lines[line].toString();
                
                if( lineData.includes("fragments:  yes")) {
                    return false;
                }
                
                if( lineData.includes("fragments:  no")) {
                    return true;
                }

                if( lineData.includes("No movie found in the file")) {
                    let functionalError = new Error("No movie found in the file");
                    functionalError.name = "functional";
                    return functionalError;
                }
            }

        } catch (error) {
            throw error;
        }
    }

    static async fragmentVideo(sessionObj) {
        
        try {
            const file = `${relativePath}${sessionObj.session}/${sessionObj.contentId}${sessionObj.fileType}`;
            const outputFile = `${relativePath}${sessionObj.session}/${sessionObj.contentId}_fragmented${sessionObj.fileType}`;
            const execRes = await execute(`mp4fragment.exe --fragment-duration 4000 ${file} ${outputFile}`);
            const lines = execRes.split('\n');
            
            for (const line in lines) {
                
                let lineData = lines[line].toString();
                
                if(lineData.includes("ERROR")) {
                    let functionalError = new Error("An Error Occured while Fragmenting the Video");
                    functionalError.name = "functional";
                    throw functionalError;
                }
            }
            
            return;

        } catch (error) {
            throw error;
        }
    }

    static async processVideo(sessionObj) {
        
        try {
            // const file = `${relativePath}${sessionObj.session}/${sessionObj.contentId}_fragmented.mp4`;
            const fileName = `${relativePath}${sessionObj.session}/${sessionObj.contentId}_fragmented${sessionObj.fileType}`;
            const outputDir = `${relativePath}${sessionObj.session}/baked`;
            const execRes = await execute(`mp4dash.bat  --mpd-name manifest.mpd ${fileName} -o ${outputDir} --use-segment-timeline`);
            const lines = execRes.split('\n');

            for (const line in lines) {
                
                let lineData = lines[line].toString();
                
                if(lineData.includes("ERROR")) {
                    let functionalError = new Error("An Error Occured while Fragmenting the Video");
                    functionalError.name = "functional";
                    throw functionalError;
                }
            }

            return;
        } catch (error) {
            throw error;
        }
    }

    //convertVideo()
    //postConversion()
}

module.exports = Bento4;