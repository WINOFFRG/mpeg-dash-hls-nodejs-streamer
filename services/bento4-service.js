const { exec } = require('child_process');

const execute = exec(`mp4info.exe ../../../uploads/90bfdcdb-6028-4b2c-b39c-ee5fc96cee24/1640852288054.mp4`, { cwd: '../Tools/Bento4-SDK/bin' });

// execute.on('exit', function(code) {
//     console.log('Child process exited with exit code ' + code);
// });

//modify logger to push log output in log file

class Bento4 {
    
    static execute() {
        execute.stdout.on('data', function(data) {
            
            let lines = data.toString().split('\n');
            lines.forEach(line => {
                // if(line.includes('fragments:')) {
                    console.log(line);
                    // return;
                // }
            });
        });

        execute.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });

    }

    static getVideoInfo() {

    }

    //fragmentVideo()
    //convertVideo()
    //postConversion()
}

Bento4.execute();

/*
    startSessionLogger()

    {
        type: 'progress',
        status: '',
        jobs: {
            health: '',
            preCheck: '',
            fragments: '',
            converting: '',
            cleanUp: '',
            uploading: '',
        }
    },

    {
        type: 'success',
        status: '',
        playbackUrl: '',
        
    }
*/