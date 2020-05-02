var express = require('express'),
    router = express.Router(),
    SoxCommand = require('sox-audio'),
    fs = require('fs'),
    inputFile = '/tmp/src.mp3',
    defaultTime = 30;

function convertIntToTimeCode(i) {
    var minutes = Math.floor(i/60),
        seconds = i%60;
    var timecode = (minutes<10) ? "0"+minutes+":" : minutes+":";
    timecode += (seconds<10) ? "0"+seconds : seconds;
    return timecode;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SoX Streaming Server' });
});

/**
 * Spotify
 */
router.get('/spotify',function(req, res, next) {
    var cmd = SoxCommand()
                    .input('|sox -t raw -c 2 -r 44k -e signed-integer -L -b 16 ~/spotify/spotify.sock -t .wav -')
                    .output(res)
                    .outputFileType('mp3');
    cmd.on('start', function(commandLine) {
        console.log('Spawned sox with command ' + commandLine);
    });
    cmd.on('error', function(err, stdout, stderr) {
        console.log('Cannot process audio: ' + err.message);
        console.log('Sox Command Stdout: ', stdout);
        console.log('Sox Command Stderr: ', stderr);
        res.end();
    });
    cmd.on('end', function() {
        console.log('Sox command succeeded!');
        res.end();
    });
    cmd.run();
});

module.exports = router;