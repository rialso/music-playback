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

            startTrackStreaming5( req, res, path );

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


var startTrackStreaming1 = function(req, res, path) {

        //path = '/Users/rtb/Music/___nevera/Eilen Jewell/2015 Sundown Over Ghost Town/02 Hallelujah Band.mp3'
        //path = 'input.mp3';
        //path = 'output.ogg';

        var file = fs.createReadStream(path);

        console.log( 'path: ', path +' | '+ req.headers.range )


        var child_process = require("child_process");

        var ffmpeg = child_process.spawn("./ffmpeg", [
            //'-re',
            '-i', path, // path
            '-f', 'ogg', // File format
            'pipe:1' // Output to STDOUT
        ]);

        res.writeHead(200, {
            //'Accept-Ranges': 'bytes',
            //'Content-Range': 'bytes ',
            'Content-Type': 'audio/mpeg',
        });

        ffmpeg.stdout.pipe(res);
};


var child_process = require('child_process');
        
var spawn = child_process.spawn;

var startTrackStreaming2 = function(req, res, path) {

        //path = '/Users/rtb/Music/___nevera/Eilen Jewell/2015 Sundown Over Ghost Town/02 Hallelujah Band.mp3'
        //path = 'input.mp3';
        //path = 'output.ogg';

        console.log( 'path: ', path +' | '+ req.headers.range )
        console.log( 'req.headers: ', req.headers  )


        res.writeHead(200, {'Content-Type': 'audio/mpeg'});
    
        var ffmpeg = spawnFfmpeg(path, 
          function (code) { // exit
              console.log('------ child process exited with code ' + code);
                res.end();
          });
          
        ffmpeg.stdout.pipe(res)
        

        res.pipe(ffmpeg.stdin)
  
};




function spawnFfmpeg(path, exitCallback) {
    //var args = ['-i', 'pipe:0', '-f', 'mp3', '-ac', '2', '-ab', '128k', '-acodec', 'libmp3lame', 'pipe:1']

    var args = [
            //'-re',
            '-i', path, // path
            '-f', 'ogg', // File format
            'pipe:1' // Output to STDOUT
        ];
                                            
    var ffmpeg = spawn("./ffmpeg", args);
                                        
    console.log('Spawning ffmpeg ' + args.join(' '));

    ffmpeg.on('exit', exitCallback);

    ffmpeg.stderr.on('data', function (data) {
        console.log('grep stderr: ' + data);
    });
    
    return ffmpeg;
}

var startTrackStreaming3 = function(req, res, path) {

        //path = '/Users/rtb/Music/___nevera/Eilen Jewell/2015 Sundown Over Ghost Town/02 Hallelujah Band.mp3'
        //path = 'input.mp3';
        //path = 'output.ogg';

        var file = fs.createReadStream(path);

        console.log( 'path: ', path +' | '+ req.headers.range )


        var child_process = require("child_process");

        var ffmpeg = child_process.spawn("./ffmpeg", [
            //'-re',
            '-i', path, // path
            '-f', 'ogg', // File format
            'pipe:1' // Output to STDOUT
        ]);


        // req.setEncoding('utf-8');
        // req.on('data', function (data) {

            


        // });


        //file.pipe(ffmpeg.stdin);


        ffmpeg.stdout.pipe(res)


        // req.on('end', function() {
        //     //writeStream.end();
        //     res.statusCode = 200;
        //     //res.end(&quot;OK&quot;);
            
        // });  

        ffmpeg.stderr.on('data', function(data) { 

            //console.log('.')

            //res.write(data);

            //ffmpeg.stdout.pipe(res)

            // ffmpeg.stdin.setEncoding('utf8');
            // ffmpeg.stdin.write(res);

            

            //data.pipe(res)

            console.log('ffmpeg stderr: ' + data.toString());
        }) 

        res.writeHead(200, {
            //'Accept-Ranges': 'bytes',
            //'Content-Range': 'bytes ',
            'Content-Type': 'audio/mpeg',
        }); 

        //ffmpeg.stdout.pipe(res);
};
var startTrackStreaming3_5 = function(req, res, path) {

        //path = '/Users/rtb/Music/___nevera/Eilen Jewell/2015 Sundown Over Ghost Town/02 Hallelujah Band.mp3'
        //path = 'input.mp3';
        //path = 'output.ogg';

        var stream = fs.createReadStream(path);

        console.log( 'path: ', path +' | '+ req.headers.range )


        var child_process = require("child_process");

        var ffmpeg = child_process.spawn("./ffmpeg", [
            //'-re',
            //'-y',
            '-i', 'pipe:0', // path
            '-ss', '0',                 //starting time offset
            //"-bufsize", "64k",
            '-f', 'ogg', // File format
            'pipe:1' // Output to STDOUT
        ]);
        stream
            .on('data', function(chunk) {
                //console.log(chunk)
            })
            .on('end', function() {
                console.log(':::::::::finished...');
            });

        stream.pipe(ffmpeg.stdin);

        //ffmpeg.stderr.pipe(stream.stdout);

        ffmpeg.stdout.pipe(res)

        ffmpeg.stderr.on('data', function(data) { 

            console.log('ffmpeg stderr: ' + data.toString());
        }) 

        res.writeHead(200, {
            //'Accept-Ranges': 'bytes',
            //'Content-Range': 'bytes ',
            'Content-Type': 'audio/mpeg',
        }); 

        res.on('close', function() {
            ffmpeg.kill();
        });

        //ffmpeg.stdout.pipe(res);
};

var startTrackStreaming4 = function(req, res, path) {

        //path = '/Users/rtb/Music/___nevera/Eilen Jewell/2015 Sundown Over Ghost Town/02 Hallelujah Band.mp3'
        //path = 'input.mp3';
        //path = 'output.ogg';

        //var file = fs.createReadStream(path);
        //var stream = fs.createReadStream(path, { bufferSize: 1 * 512 });
        var stream = fs.createReadStream(path, { bufferSize: 4 * 1024 });
        //stream.pipe(response);

        console.log( 'path: ', path +' | '+ req.headers.range )


        // var child_process = require("child_process");

        // var ffmpeg = child_process.spawn("./ffmpeg", [
        //     //'-re',
        //     '-i', 'pipe:0', // path
        //     '-f', 'ogg', // File format
        //     'pipe:1' // Output to STDOUT
        // ]);

        stream
          .on('data', function(chunk) {
            //console.log(chunk)
          })
          .on('end', function() {
            console.log('finished...');
          });


        var ffmpeg = spawnFfmpeg2( function (code) { // exit

            console.log('child process exited with code ' + code);
            res.end();
        });
        ffmpeg.stdout.pipe(res);



        stream.pipe(ffmpeg.stdin);


        




        res.writeHead(200, {
            //'Accept-Ranges': 'bytes',
            //'Content-Range': 'bytes ',
            'Content-Type': 'audio/mpeg',
        }); 

        //ffmpeg.stdout.pipe(res);
};

function spawnFfmpeg2(exitCallback) {
    //var args = ['-i', 'pipe:0', '-f', 'mp3', '-ac', '2', '-ab', '128k', '-acodec', 'libmp3lame', 'pipe:1']


    var child_process = require('child_process');
        
    var spawn = child_process.spawn;

    var args = [
            //'-re',
            //"-y",
            '-i', 'pipe:0', // path
            //'-ss', '0',                 //starting time offset
            //"-preset",
            //"ultrafast",
            // '-c',
            // 'copy',
            '-f', 'ogg', // File format
            'pipe:1' // Output to STDOUT
        ];
                                            
    var ffmpeg = spawn("./ffmpeg", args);
                                        
    console.log('Spawning ffmpeg ' + args.join(' '));

    ffmpeg.on('exit', exitCallback);

    ffmpeg.stderr.on('data', function (data) {
        console.log('grep stderr: ' + data);
    });
    
    return ffmpeg;
}

//https://gist.github.com/cobookman/c1a9856a4588496b021a

var startTrackStreaming5 = function(req, res, path) {

        //path = '/Users/rtb/Music/___nevera/Eilen Jewell/2015 Sundown Over Ghost Town/02 Hallelujah Band.mp3'
        //path = 'input.mp3';
        //path = 'output.ogg';

        var stream = fs.createReadStream(path);

        console.log( 'path: ', path +' | '+ req.headers.range )


        var childProcess = require("child_process");

        

        res.writeHead(200, {
            //'Accept-Ranges': 'bytes',
            //'Content-Range': 'bytes ',
            'Content-Type': 'audio/mpeg',
        }); 

        //var audioConv = childProcess.spawn(__dirname + '/audioConv.sh',[
            //params.location,  //first parameter is the file's location relative to the bash script

        var audioConv = childProcess.spawn('./audioConv.sh',[
            path,
            0,                //second parameter specifies a start time offset
            3,                //third parameter specifies which variable encoding to use 0-9, with 0 being the best 9 the worst
        ]);
        audioConv.stdout.pipe(res);
        res.on('close', function() {
          audioConv.kill();
        });
        audioConv.stderr.on('data', function(d) {
           console.log('grep stderr: ' +d.toString());
        });

};

/*

var input_file = fs.createReadStream(path);
input_file.on('error', function(err) {
    console.log(err);
});

var output_path = 'tmp/output.mp4';
var output_stream = fs.createWriteStream('tmp/output.mp4');

var ffmpeg = child_process.spawn('ffmpeg', ['-i', 'pipe:0', '-f', 'mp4', '-movflags', 'frag_keyframe', 'pipe:1']);
input_file.pipe(ffmpeg.stdin);
ffmpeg.stdout.pipe(output_stream);

ffmpeg.stderr.on('data', function (data) {
    console.log(data.toString());
});

ffmpeg.stderr.on('end', function () {
    console.log('file has been converted succesfully');
});

ffmpeg.stderr.on('exit', function () {
    console.log('child process exited');
});

ffmpeg.stderr.on('close', function() {
    console.log('...closing time! bye');
});

*/


        // req.setEncoding('utf-8');
        // req.on('data', function (data) {

        // });

        // stream.on('data', function(data) {

        //     console.log('file.on: ' + data.toString() );

        //         //response.write(data);

        //         ffmpeg.stdout.pipe(data.toString())


        // });

        // req.on('end', function() {
        //     //writeStream.end();
        //     res.statusCode = 200;
        //     //res.end(&quot;OK&quot;);
            
        // });  

        // ffmpeg.stderr.on('data', function(data) { 

        //     //console.log('.')

        //     res.write(data);

            

        //     //data.pipe(res)

        //     console.log('ffmpeg stderr: ' + data.toString());
        // }) 

