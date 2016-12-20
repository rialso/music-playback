/*

http://stackoverflow.com/questions/29948551/stream-mp4-video-with-node-fluent-ffmpeg

I believe that in order to seek within a mp4 or mp3, you need to let the browser know the length of that content. Try inserting this quick blurb before you make your call to ffmpeg. This should get the size of the video file and you can set the headers in the response accordingly before streaming the data.

INSERT BEFORE ffmpeg call

var fs = require('fs');
var stat = fs.statSync(pathToMovie);
res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': stat.size
});






*/
/* Global imports */

//var bodyParser  = require('body-parser');

'use strict';
var fs          = require('fs-extra');
var isThere     = require('is-there');
var callTrack   = require('../../calls/tracks');
var ffmpegRoot  = './server/lib/handlers/ffmpeg';

/* Public Methods */


exports.startPlayback = function(req, res) {
    var id = req.params.id;

    //console.log('::::::::::::', id)

    callTrack.trackById(id).then(function(data){
        //console.log('::::::::path: \n', path)

        var path = data.location;
        var time = data.duration;
        if (isThere(path)) {
            startTrackStreamingConvert( req, res, path, time );
        } else {
            console.error('Could not find file ' + path);
        }

    },function(err){
        reject({
            status: 200,
            message: err
        });
    });  
};

/* Private Methods */

function convert(hms) {
    var parts   = hms.split(':'),
        hour    = Number(parts[0]*60*60),
        minutes = Number(parts[1]*60),
        seconds = Number(parts[2]);
    return (hour + minutes + seconds).toFixed(0);
}

var getSize = function(time) {

        //var path = './music/01_Goin_Down.mp3';  // 9849208
        //var path = './music/3_Love_Me_Two_Times.flac';
        //var path = './music/test.m4a';  //5211426
        //var seconds = 2.21*60;

    /*
http://forums.ilounge.com/music-audio/68487-calculating-file-size-bitrate.html

For Constant Bit Rate files, absolutely...

kbps stands for kilobits per second, which means that for a 128kbps MP3/AAC file, each second of audio requires 128kilobits of data.

Remember as well that we're talking about kiloBITS here, not kilobytes (there are 8 bits in a byte).

So, you can calculate the size using the following formula:

x = length of song (in seconds)
y = bitrate (in kilobits per second)
z = resultant file size (in kilobytes)

(x * y) / 8

We're dividing by 8 above to get the result in bytes.

So if you have a 5 minute song, encoding at 128kbps, you would do this as follows:

5 minutes = 300 seconds
128kbps * 300 seconds = 38,400 kilobits of data
38,400 kilobits / 8 = 4,800 kb

To take this one step further, you can convert this into Megabytes by dividing by 1,024, so 4800/1024 = 4.6875 Mb

The same 5-minute song, encoded at 192kbps would result in:

(192 * 300) / 8 = 7,200 kb (or approx 7Mb).

(Keep in mind also that a kiloBYTE is 1,024 bytes, while a kiloBIT is 1,000 bits.)

This should give you an accurate idea of the filesize to the nearest kilobyte. The exact file size may differ since there other information is usually embedded in the file (tags for song, artist, album, artwork image, etc).

Note that the above formula will not work for variable bit rate files, since (as the name implies) the bit rate is varied throughout the file, so some sections may be 128kbps, and others may be 192kbps, for example.

*/

    //var path = './music/3_Love_Me_Two_Times.flac';

    //var path = './music/03_Firebirds.mp3';

    var seconds = convert(time)

    console.log('::::::::::::::::::::: seconds', seconds)

    var bitsPerSample = 8;
    var samplesPerSecond = 44100;
    var channels = 2;
    var duration = seconds;

    //The bitrate is the number of bits per second.
    //So in this case for stereo the bitrate is 8 * 44100 * 2 = 705,600kbps
    var bitrate = bitsPerSample * samplesPerSecond * channels

    console.log('::::::::::::::::::::: bitrate', bitrate)

    //To get the file size mutliply by the bitrate by the duration (in seconds), and divide by 8 (to get from bits to bytes):
    //So in this case 30 seconds of stereo will take up (8 * 44100 * 2 * 30) / 8 = 2,646,000
    //var fileSize = (bitsPerSample * samplesPerSecond * channels * duration) / 8 * 1024;

    //var fileSize = 160/8*seconds*1024;  // 2715648
    //var fileSize = (160/8*seconds)*1024;  // 2715648

    //var fileSize = (seconds*160)/8*1024;  // 2715648. -- de momento la que mas se acerca

    //var fileSize = (bitsPerSample*160*seconds)/8*1024;

    console.log('::::::::::::::::::::: xxxxxxxxxx', (bitsPerSample * samplesPerSecond * channels * duration) / 8 )

    console.log('::::::::::::::::::::: xxxxxxxxxx', bitsPerSample * samplesPerSecond * channels * duration )

    



    //bitrate/8*length(seconds)=size (in Bytes). Divide by 1024 for KB. Divide by 1024 again for MB. etc.
    //console.log('::::::::::::::::::::: xxxxxxxxxx', 160/8*196)

    console.log('::::::::::::::::::::: 160/8*seconds', 227/8*seconds*1024)

    var fileSize = 160/8*seconds*1024;

    //var fileSize = 5103040;



    console.log('::::::::::::::::::::: fileSize ---- ', fileSize)

    return fileSize;
}


var startTrackStreamingConvert = function(req, res, path, time) {
    
    console.log( '::::::::::::::::::::: xxxxxxxxxx path: ', path +' | '+ req.headers.range+' | '+ time )

    var bytes = getSize(time);
    //var bytes = fs.statSync(path).size; //3920000  4092008

    console.log( '……………######………………… bytes: ', bytes)
    console.log( '……………######………………… fs.statSync(path).size ', fs.statSync(path).size )



    var child_process = require("child_process");

    if (!!req.headers.range)  {
        var range       = req.headers.range;
        var ranges      = range.replace(/bytes=/, "").split("-");
        var rangeStart  = ranges[0];
        var rangeEnd    = ranges[1];
        var total       = bytes;

        console.log( '::::::::::: total: ', total +' | '+ range +' | '+ ranges )
        
        var start = parseInt(rangeStart, 10);
        var end   = rangeEnd ? parseInt(rangeEnd, 10) : total - 1;

        console.log('::::::::::: total bytes: ' + start + '-' + end + '/' + total)

        res.writeHead(206, {
            'Accept-Ranges': 'bytes',
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Content-Length': (end - start) + 1,
            'Content-Type': 'audio/mpeg',
            //'X-Content-Duration': 2054.53,
            //'Content-Duration': 2054.53
            //'Connection': 'close'
        });

        /*
        Some generic audio options:
        -f: the output file format (i.e container)
        -acodec: the codec to use for encoding
        -ab: the bitrate in bits per second (e.g. 64000, 64k, etc)
        -ar: the sampling rate in Hertz (e.g. 22000, 44100, etc)
        -ac: the number of channels (e.g. 1 for mono, 2 for stereo, etc)
        */

        /**
         *  Add ADTS header at the beginning of each and every AAC packet.
         *  This is needed as MediaCodec encoder generates a packet of raw
         *  AAC data.
         *
         *  Note the packetLen must count in the ADTS header itself.
         *  See: http://wiki.multimedia.cx/index.php?title=ADTS
         *  Also: http://wiki.multimedia.cx/index.php?title=MPEG-4_Audio#Channel_Configurations
         **/

        var ffmpeg = child_process.spawn(ffmpegRoot, [ ///usr/local/bin/ffmpeg   // "./ffmpeg"
            //'-re',
            //'-y',
            //'-i', 'pipe:0', // path
            
            //"-b:v" , "64k",         // bitrate to 64k
            //'-ss', '0',                 //starting time offset
            //"-bufsize", "64k",
            //'-f', 'wav', // File format
            //'-f', 'aac', 
            //'pipe:1' // Output to STDOUT
            //"-" 

            //'-i', path,    // Output to STDOUT
            //'-acodec', 'libfdk_aac',
            //'-f', 'mp4', // PCM 16bits, little-endian
            //'-ar', '44100', // Sampling rate
            //'-ac', 2, // Stereo
            //'-f', 'wav', // File format

            //'-i', 'pipe:0', // path


            // este funciona

            // '-i', path,    // Output to STDOUT
            // //'-acodec', 'flac',
            // //'-acodec', 'pcm_u8',
            // //'pcm_s32le',
            // //'-c:a', 2,
            // '-ar', '44100', // Sampling rate   -- 44.1 kHz (CD), 48 kHz, 88.2 kHz, or 96 kHz.
            // '-b:a', '160k', // bitrate to 64k
            // '-ac', 2, // Stereo
            // //"volume=1.5",
            // //'-vbr', 3, // Target a quality, rather than a specific bit rate. 1 is lowest quality and 5 is highest quality. Set the VBR level with the -vbr flag.
            // //'-sample_fmt','s32',
            // '-f', 'adts',
            // 'pipe:1'

            //http://superuser.com/questions/684955/converting-audio-to-aac-using-ffmpeg
            /*
            # using libfaac on Mac OS X 10.6.8
            # -vn : not copying video
            # -acodec : specify codec used in flv file
            # -ac : channels. 1 is for mono, 2 is for stereo
            # -ab : specify bitrate for output file (note that rate is not kbps but bps)
            # -ar : sampling frequency (Hz)
            # -threads: number of threads for encoding
            # "-strict experimental" is necessary to use libfaac
            */

            //https://trac.ffmpeg.org/wiki/Encode/AAC
            //http://blog.julien.org/2008/12/howto-quick-reference-on-audio-video.html
            //http://ffmpeg.org/ffmpeg.html#Audio-Options


            '-i', path,
            '-vn',
            '-threads', 4,
            //'-sample_fmt', 'u8',
            //'-strict', 'experimental',
            //'-codec:a', 'aac',
            //'-af',  'volume=3.3dB',  // funciona pero hay que verificarla
            '-c:a', 'aac',
            '-b:a', '160k',
            '-ar', '44100',
            '-ac', 2,
            // https://trac.ffmpeg.org/wiki/Encode/AAC
            '-movflags', '+faststart',
            '-f', 'adts',
            'pipe:1'
        ]);

    } else {

        console.log( '***********************@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@********************')  

        // un 200 causa crask in Firefox
        res.writeHead(206, {
            //'Content-Length': end,
            'Content-Type': 'audio/mpeg',
            //'Connection': 'close'
          });

        var ffmpeg = child_process.spawn(ffmpegRoot, [ ///usr/local/bin/ffmpeg   // "./ffmpeg"

            '-i', path,    // Output to STDOUT
            '-f', 'adts',
            //'-strict', '-2',
            'pipe:1'
        ]);
    }

    ffmpeg.stdout.pipe(res);

    ffmpeg.stderr.on('data', function(data) { 

        console.log('ffmpeg -- stderr: ' + data.toString());
    }) 


    res.on('close', function() {
        ffmpeg.kill();
    });

    //ffmpeg.stdout.pipe(res);
};
