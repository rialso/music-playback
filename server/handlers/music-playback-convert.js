/*








*/
/* Global imports */

var fs = require('fs-extra');

var isThere = require('is-there');

var trck = require('../calls/c_tracks');
var bodyParser  = require('body-parser');

/* Public Methods */
/**
 * Starts the playback of the provided track.
 * @param response              The HTTP-Response
 * @param albumTitle            The album title
 * @param trackName             The name of the track
 */
exports.startPlayback = function(req, res) {

    var id = req.params.id;

    trck.c_TrackById(id).then(function(data){

        var path = data.Location;

        //console.log('path: ', path)
        console.log('::::::::::::::::::::: ', data)

        if (isThere(path)) {

            //var destination_file = "/Users/rtb/Sites/music-playback/music/The.madpix.project_-_Wish_You_Were_Here.ogg"
            //convert( path, destination_file )


            //startTrackStreaming( req, res, path );

            startTrackStreaming2( req, res, path );

        } else {
            console.error('Could not find file ' + path);
        }

/*
        res.end(JSON.stringify({
            status: 200,
            message: '',
            data : data
        }));
*/

    },function(err){
        reject({
            status: 200,
            message: err
        });
    });    
};

/* Private Methods */

var startTrackStreaming = function(req, res, path) {

    console.log( 'path: ', path +' | '+ req.headers.range )

    //if(typeof request.headers.range !== 'undefined')
    if (!!req.headers.range)  {
        var range       = req.headers.range;
        var ranges      = range.replace(/bytes=/, "").split("-");
        var rangeStart  = ranges[0];
        var rangeEnd    = ranges[1];
        var total       = fs.statSync(path).size;
        
        var start = parseInt(rangeStart, 10);
        var end   = rangeEnd ? parseInt(rangeEnd, 10) : total - 1;

        res.writeHead(206, {
            'Accept-Ranges': 'bytes',
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Content-Length': (end - start) + 1,
            'Content-Type': 'audio/mpeg',
            //'Connection': 'close'
          });
        
        var file = fs.createReadStream(path, {start: start, end: end});
    } else {

        // un 200 causa crask in Firefox
        res.writeHead(206, {
            //'Content-Length': end,
            'Content-Type': 'audio/mpeg',
            //'Connection': 'close'
          });

        var file = fs.createReadStream(path);
    }

    //res.end();

    file.pipe(res);
    file.on('close', function () {
        res.end(0);
    });
};

function convert(source_file, destination_file) {

    console.log('oooooooo')

        //var destination_file = source_file.split('/').slice(-1)[0].replace('.flv', '.mp3');
    //var ffmpeg = 'ffmpeg -y -i '+ source_file +' -f mp3 -vn -acodec copy ' + destination_file;

    //var exec = require('child_process');

    //var ffmpeg = './ffmpeg -i '+ source_file +' -f ogg ' + destination_file;
    //var child = exec.spawn( ffmpeg ).pipe(res);

    //child.stdout.pipe(res);

     var ffmpeg = require('child_process').exec("./ffmpeg -i "+ source_file +" -f ogg " + destination_file );

        ffmpeg.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        ffmpeg.stdout.on('data', function (data) {

            console.log('stdout: ' + data);

            //var file = fs.createReadStream(data, {start: start, end: end});

            //data(res);

            //var frame = new Buffer(data).toString('base64');

            var file = fs.createReadStream(data, {frame: start, end: end});

        });

        ffmpeg.stdout.pipe(output); // Write encoded chucks to the file system


}

var startTrackStreaming2 = function(req, res, path) {

    //path = '/Users/rtb/Music/___nevera/Eilen Jewell/2015 Sundown Over Ghost Town/02 Hallelujah Band.mp3'
    //path = 'input.mp3';
    //path = 'output.ogg';




        //convert2(path).pipe(res, {start: start, end: end});

        //var file = convert2(path);

        //var file = fs.createReadStream(path, {start: start, end: end});

        //var file = fs.createReadStream(convert2(path).stdout, {start: start, end: end});

        //convert2(path).file().pipe(res)


        var child_process = require("child_process");

        var ffmpeg = child_process.spawn("./ffmpeg", [
            //'-re',
            '-i', path, // path
            '-f', 'ogg', // File format
            'pipe:1' // Output to STDOUT
        ]);




        ffmpeg.on('error', function(err) {
            console.log('@@@@@@@ error', err);
        })
        ffmpeg.on('exit', function(err) {
            console.log('@@@@@@@ exit', err);
        })
        ffmpeg.on('close', function(code) {
            console.log('@@@@@@@ child process exited with code ' + code);
        });

        ffmpeg.stderr.on('data', function(data) { 

            //console.log('.')

            console.log('ffmpeg stderr: ' + data.toString());
        })

        ffmpeg.stdin.on('error', function() {});

        ffmpeg.stdout.on('data', function(data) { 
            //console.log('stdout: ' + data.toString() ); 

            //var buff = new Buffer(data);

        })

        ffmpeg.stdout.pipe(res);


        res.on('close', function() {
            ffmpeg.kill();
        });


        res.writeHead(200, {
            //'Accept-Ranges': 'bytes',
            //'Content-Range': 'bytes ',
            'Content-Type': 'audio/mpeg',
        });

   
};