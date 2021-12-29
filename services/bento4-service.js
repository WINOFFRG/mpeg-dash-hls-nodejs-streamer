const { exec } = require('child_process');

const execute = exec('dir', { cwd: '../Tools/Bento4-SDK' }, function (error, stdout, stderr) {

    if(error) {
        console.log(error.stack);
        console.log('Error Code: ' + error.code);
        console.log('Signal received: ' + error.signal);
    }

    console.log('Child Process STDOUT: ' + stdout);
    console.log('Child Process STDERR: ' + stderr);
});

// execute.on('exit', function(code) {
//     console.log('Child process exited with exit code ' + code);
// });

class Bento4 {
    
    static execute() {
        execute.stdout.on('')
        execute.stdout.on('data', function(data) {
            console.log(data);
        });
    }

    static getVideoInfo() {

    }

    //fragmentVideo()
    //convertVideo()
    //postConversion()
}

Bento4.execute();