const { exec } = require('child_process');

const ls = exec('dir', { cwd: '../../Tools/Bento4-SDK' }, function (error, stdout, stderr) {

    if(error) {
        console.log(error.stack);
        console.log('Error Code: ' + error.code);
        console.log('Signal received: ' + error.signal);
    }

    console.log('Child Process STDOUT: ' + stdout);
    console.log('Child Process STDERR: ' + stderr);
});

ls.on('exit', function(code) {
    console.log('Child process exited with exit code ' + code);
});