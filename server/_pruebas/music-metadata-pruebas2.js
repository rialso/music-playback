
/*

Answers
To use ffmpeg programmatically, I think you would have to call read_apic() in libavformat (which is part of ffmpeg).
From the commandline, you can apparently do this:
ffmpeg -i input.mp3 -an -vcodec copy cover.jpg
The commandline behaviour implies that the cover art image is seen as just another video stream (containing just one frame), so using libavformat in the usual way you would to demux the video part of a stream should produce that image.
Sample code for demuxing: ffmpeg/docs/examples/demuxing.c The first (and only) AVPacket that would be obtained from demuxing the video stream in an mp3 would contain the JPEG file (still encoded as JPEG, not decoded).
AVFormatContext* fmt_ctx;
// set up fmt_ctx to read first video stream
AVPacket pkt;
av_read_frame(fmt_ctx, &pkt);
FILE* image_file = fopen("image.jpg", "wb");
int result = fwrite(pkt.data, pkt.size, 1, image_file);
fclose(image_file);
If there are multiple images, I think they would be seen as separate video streams, rather than as separate packets in the same stream. The first stream would be the one with the largest resolution.
All this is probably implemented internally in terms of read_apic().
The ID3v2 spec allows for any image format, but recommends JPEG or PNG. In practice all images in ID3 are JPEG.
EDIT: Moved some of the less useful bits to postscript:
P.S. ffmpeg -i input.mp3 -f ffmetadata metadata.txt will produce an ini-like file containing the metadata, but the image is not even referred to in there, so that is not a useful approach.
P.S. There may be multiple images in an ID3v2 tag. You may have to handle the case when there is more than one image or more than one type of image present.
P.S. ffmpeg is probably not the best software for this. Use id3lib, TagLib, or one of the other implementations of ID3. These can be used either as libraries (callable from the language of your choice) or as commandline utilities. There is sample C++ code for TagLib here: How do I use TagLib to read/write coverart in different audio formats? and for id3lib here: How to get album art from audio files using id3lib.


*/


/* Global imports */

'use strict';
var isThere = require('is-there');
var config = require('../../config');

var ffmpegRoot  = './server/lib/handlers/ffmpeg';


exports.init = function(path) {

    var path = '/Users/rialso/Music/______nevera/01\ If That Don\'t Tell You.mp3';

    //var path = '/Users/rialso/Music/______nevera/02\ Paranoid.mp3';

    //var path = '/Users/rialso/Music/______nevera/Peter Bruntnell/2013 Retrospective/01 I Want You.mp3';
    //var path = '/Users/rialso/Music/______nevera/James Hunter Six/Hold On!/01 If That Don\'t Tell You.mp3';

    console.log( '::: metadata -> ', path )

    metadata_prb_2(path)

    //  Get Video File Information
    // Note: The -hide_banner option is used to hide a copyright notice shown my ffmpeg, 
    // such as build options and library versions. This option can be used to suppress printing this information.
    //$ ffmpeg -i video.flv -hide_banner

    //You can save media file metadata to a text file using -f ffmetadata option as the following:
    //ffmpeg -i input_video -f ffmetadata metadata.txt

    // return new Promise(function(resolve, reject) {

    //     if (isThere(path)) {

    //         var child_process = require("child_process");

    //         var ffmpeg_data = child_process.spawn(ffmpegRoot, [ ///usr/local/bin/ffmpeg   // "./ffmpeg"

    //             '-i', path,    // Output to STDOUT
    //             '-af', 'volumedetect',
    //             '-f', 'null',   // -f: the output file format (i.e container)
    //             '-y', 'null',
    //             '-hide_banner'

    //             //'-f', 'ffmetadata',
    //             //'pipe:1'
    //         ]);

    //         var metadata = '';

    //         ffmpeg_data.stderr.on('data', function (data) {
    //             //console.log('************************stderr: ' + data);

    //             metadata += data;
    //         });

    //         ffmpeg_data.on('exit', function(data){

    //             console.log('--------------------------------------------------------- \n', metadata)

    //             //var result = _getInformation('audio', metadata);

    //             // console.log('=========================================\n')
    //             // console.log(result)
    //             // console.log('=========================================\n')

                
    //             resolve( result );
    //         });
    //     } 
    //     else {
    //         reject('Could not find file ' + path);
    //     } 
    // });

    
}

/**
 * Calculate the duration in seconds from the string retrieved by the ffmpeg info
 */
var durationToSeconds = function(duration) {
    var parts = duration.substr(0,8).split(':');
    return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
};


//https://github.com/damianociarla/node-ffmpeg/blob/master/lib/ffmpeg.js

var _getInformation = function( type, stdout ){
    // Perse output for retrieve the file info
    var location        = /from \'(.*)\'/.exec(stdout) || []
      , title           = /(INAM|title)\s+:\s(.+)/.exec(stdout) || []
      , artist          = /artist\s+:\s(.+)/.exec(stdout) || []
      , album           = /album\s+:\s(.+)/.exec(stdout) || []
      , album_artist    = /album_artist\s+:\s(.+)/.exec(stdout) || []
      , track           = /track\s+:\s(.+)/.exec(stdout) || []
      , disc            = /disc\s+:\s(.+)/.exec(stdout) || []
      , date            = /date\s+:\s(.+)/.exec(stdout) || []
      , genre           = /genre\s+:\s(.+)/.exec(stdout) || []
      , publisher       = /publisher\s+:\s(.+)/.exec(stdout) || []
      , lyrics          = /lyrics.*\s:\s(.+)/.exec(stdout) || []         //lyrics.*\s:\s(.+)\n\s(.+)\n\s(.+). lyrics.*\s:\s(.+)(\n.*){8}
      , start           = /start:\s(.+),/.exec(stdout) || []
      , is_synched      = (/start: 0.000000/.exec(stdout) !== null)
      , duration        = /Duration: (([0-9]+):([0-9]{2}):([0-9]{2}).([0-9]+))/.exec(stdout) || []
      
      , container       = /Input #0, ([a-zA-Z0-9]+),/.exec(stdout) || []
      , video_bitrate   = /bitrate: ([0-9]+) kb\/s/.exec(stdout) || []
      , video_stream    = /Stream #([0-9\.]+)([a-z0-9\(\)\[\]]*)[:] Video/.exec(stdout) || []
      , video_codec     = /Video: ([\w]+)/.exec(stdout) || []
      , resolution      = /(([0-9]{2,5})x([0-9]{2,5}))/.exec(stdout) || []
      , pixel           = /[SP]AR ([0-9\:]+)/.exec(stdout) || []
      , aspect          = /DAR ([0-9\:]+)/.exec(stdout) || []
      , fps             = /([0-9\.]+) (fps|tb\(r\))/.exec(stdout) || []
      
      , audio_stream    = /Stream #([0-9\.]+)([a-z0-9\(\)\[\]]*)[:] Audio/.exec(stdout) || []
      , audio_codec     = /Audio: ([\w]+)/.exec(stdout) || []
      , sample_rate     = /([0-9]+) Hz/i.exec(stdout) || []
      , channels        = /Audio:.* (stereo|mono)/.exec(stdout) || []
      , audio_bitrate   = /Audio:.* ([0-9]+) kb\/s/.exec(stdout) || []
      , rotate          = /rotate[\s]+:[\s]([\d]{2,3})/.exec(stdout) || [];

    // Build return object
    var ret = { 
        location        : location[1] || ''
      , title           : title[2] || ''
      , artist          : artist[1] || ''
      , album           : album[1] || ''
      , track           : track[1] || ''
      , disc            : disc[1] || ''
      , genre           : genre[1] || ''
      , publisher       : publisher[1] || ''
      , date            : date[1] || ''
      , synched         : is_synched
      , duration        : {
            raw     : duration[1] || ''
          , seconds : duration[1] ? durationToSeconds(duration[1]) : 0
        }
      , audio         : {
            codec               : audio_codec[1] || ''
          , bitrate             : audio_bitrate[1] || ''
          , sample_rate         : sample_rate.length > 1 ? parseInt(sample_rate[1], 10) : 0
          , stream              : audio_stream.length > 1 ? parseFloat(audio_stream[1]) : 0.0
          , channels            : {
                raw     : channels[1] || ''
              , value   : (channels.length > 0) ? ({ stereo : 2, mono : 1 }[channels[1]] || 0) : ''
            }
        }
    };

    if (type == 'audio'){

        ret.album_artist    = album_artist[1] || ''
        ret.lyrics          = lyrics[1] || ''

    }


    if (type == 'video'){

        var video = {
                container           : container[1] || ''
              , bitrate             : (video_bitrate.length > 1) ? parseInt(video_bitrate[1], 10) : 0
              , stream              : video_stream.length > 1 ? parseFloat(video_stream[1]) : 0.0
              , codec               : video_codec[1] || ''
              , resolution          : {
                    w : resolution.length > 2 ? parseInt(resolution[2], 10) : 0
                  , h : resolution.length > 3 ? parseInt(resolution[3], 10) : 0
                }
              , resolutionSquare    : {}
              , aspect              : {}
              , rotate              : rotate.length > 1 ? parseInt(rotate[1], 10) : 0
              , fps                 : fps.length > 1 ? parseFloat(fps[1]) : 0.0
            }

        ret.video = video;
        
        // Check if exist aspect ratio
        if (aspect.length > 0) {
            var aspectValue = aspect[1].split(":");
            ret.video.aspect.x      = parseInt(aspectValue[0], 10);
            ret.video.aspect.y      = parseInt(aspectValue[1], 10);
            ret.video.aspect.string = aspect[1];
            ret.video.aspect.value  = parseFloat((ret.video.aspect.x / ret.video.aspect.y));
        } else {
            // If exists horizontal resolution then calculate aspect ratio
            if(ret.video.resolution.w > 0) {
                var gcdValue = utils.gcd(ret.video.resolution.w, ret.video.resolution.h);
                // Calculate aspect ratio
                ret.video.aspect.x      = ret.video.resolution.w / gcdValue;
                ret.video.aspect.y      = ret.video.resolution.h / gcdValue;
                ret.video.aspect.string = ret.video.aspect.x + ':' + ret.video.aspect.y;
                ret.video.aspect.value  = parseFloat((ret.video.aspect.x / ret.video.aspect.y));
            }
        }
        // Save pixel ratio for output size calculation
        if (pixel.length > 0) {
            ret.video.pixelString = pixel[1];
            var pixelValue = pixel[1].split(":");
            ret.video.pixel = parseFloat((parseInt(pixelValue[0], 10) / parseInt(pixelValue[1], 10)));
        } else {
            if (ret.video.resolution.w !== 0) {
                ret.video.pixelString = '1:1';
                ret.video.pixel = 1;
            } else {
                ret.video.pixelString = '';
                ret.video.pixel = 0.0;
            }
        }
        // Correct video.resolution when pixel aspectratio is not 1
        if (ret.video.pixel !== 1 || ret.video.pixel !== 0) {
            if( ret.video.pixel > 1 ) {
                ret.video.resolutionSquare.w = parseInt(ret.video.resolution.w * ret.video.pixel, 10);
                ret.video.resolutionSquare.h = ret.video.resolution.h;
            } else {
                ret.video.resolutionSquare.w = ret.video.resolution.w;
                ret.video.resolutionSquare.h = parseInt(ret.video.resolution.h / ret.video.pixel, 10);
            }
        }
    }
    // Returns the list of supported formats
    return ret;
};

/*

Output a single image

Example to skip 30 seconds and output one image:

ffmpeg -ss 30 -i input -frames:v 1 output.png
See the image file muxer documentation for more info.

*/


//https://github.com/reidransom/encloader/wiki/ffmbc-Usage

//ffmpeg -i input.mp3 -an -vcodec copy cover.jpg
//The commandline behaviour implies that the cover art image is seen as just another video stream (containing just one frame), 
//so using libavformat in the usual way you would to demux the video part of a stream should produce that image.

var metadata_prb_2 = function(path) {
    //ffmpeg -i input.mp3 -an -vcodec copy cover.jpg

    var child_process = require("child_process");
    var ffmpeg_data = child_process.spawn(ffmpegRoot, [

        // '-i', path,
        // '-an', '-vcodec',
        // 'copy', 'cover2.jpg'

        // '-i', path,
        // //'-an', '-vcodec',
        // '-codec:v', 'mjpeg',
        // //'pipe:1'
        // 'copy', 'bb.jpg'

        // '-i', path,
        // '-vf',
        // 'fps=30',
        // '-f',         //<<
        // 'image2pipe', //<<
        // '-vcodec',    //<<
        // 'png',        //<<
        // 'pipe:1'

        // '-i', path,
        // '-f', 'image2pipe',
        // '-vcodec', 'mjpeg',
        // 'pipe:1'


//ffmpeg -f video4linux2 -r 30 -s 640x480 -input_format mjpeg -i /dev/video0 -c
//copy http://localhost:8090/feed1.ffm

'-y',
//'-hide_banner',
//'-map', '0:1', 
//'-map', '1',
//'-c:V',
'-c:a:1',
'-map 0:1',
//'-nostdin',
//'-stats',
//'-r 1/5',
'-i', path,
'-f', 'image2pipe',
//'-s', '1080x720',
//'-b', '2000k',
'-r', '30',
'-vcodec', 'mjpeg',
//'-vsync', '2',
'pipe:1'


//ffmpeg -i stream.mp4 -f ffmetadata metadata.txt


// ffmpeg -i input.mp3 -i cover.jpg -map_metadata 0 -map 0 -map 1 output.mp3

//ffmpeg -i in.mp4 -vcodec copy -c:a copy -map 0 out.mp4


        //ffmpeg -y -f image2pipe -codec:v mjpeg -i - -codec copy image.jpg
    ]);

    var metadata = '';

    ffmpeg_data.stderr.on('data', function (data) {
        console.log('************************stderr: \n' + data);

        metadata += data;

//         var frame = new Buffer(data).toString('base64');

// console.log('::::::::metadata:::::::::::xxxxxxxx\n', frame)
    });

    ffmpeg_data.on('exit', function(data){

        var frame = new Buffer(metadata).toString('base64');

        console.log('::::::::metadata:::::::::::\n', data)

        console.log('::::::::metadata::::::::::::\n', metadata)

        console.log('::::::::metadata:::::::::::xxxxxxxx\n', frame)

    });


}

// http://jonhall.info/how_to/create_id3_tags_using_ffmpeg

//http://www.benfarrell.com/2012/07/23/injecting-metadata-with-ffmpeg-and-node-js/
//ffmpeg.exec(["-i", "myfile.mp3", "-y", "-acodec", "copy", "-metadata", "title=mytitle", "myfile.mp3"], callback);
//The “-y” flag forces the process into choosing yes to overwrite the file.

var metadata_prb = function(path) {

            var child_process = require("child_process");
            var ffmpeg_data = child_process.spawn(ffmpegRoot, [ ///usr/local/bin/ffmpeg   // "./ffmpeg"
            //var ffmpeg_data = child_process.spawn('./ffmpeg', [ ///usr/local/bin/ffmpeg   // "./ffmpeg"

                // '-i', path,    // Output to STDOUT
                // '-f', 'ffmetadata',
                // 'pipe:1'

                '-i', path,    // Output to STDOUT
                //-map 1:0
                'pipe:1'
            ]);



        //console.log( '*******************************************')

        var metadata = '';

        ffmpeg_data.stderr.on('data', function (data) {
            //console.log('************************stderr: ' + data);

            metadata += data;


        });

        ffmpeg_data.on('exit', function(data){

            console.log('::::::::metadata:::::::::::', data)

            console.log('::::::::metadata::::::::::::\n', metadata)

        });

        //console.log( '*******************************************')  
}

var metadata_prb_image = function(path) {

            var child_process = require("child_process");
            var ffmpeg_data = child_process.spawn(ffmpegRoot, [ ///usr/local/bin/ffmpeg   // "./ffmpeg"
            //var ffmpeg_data = child_process.spawn('./ffmpeg', [ ///usr/local/bin/ffmpeg   // "./ffmpeg"

                // '-i', path,    // Output to STDOUT
                // '-f', 'ffmetadata',
                // 'metadata.png'

                '-i', path,    // Output to STDOUT
                'metadata.jpg',

                
            ]);
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

                //'-af',  'volume=3.3dB',  // funciona pero hay que verificarla

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


        //console.log( '*******************************************')

        var metadata = '';

        ffmpeg_data.stderr.on('data', function (data) {
            //console.log('************************stderr: ' + data);

            metadata += data;


        });

        ffmpeg_data.on('exit', function(data){

            console.log('::::::::metadata:::::::::::', data)

            console.log('::::::::metadata::::::::::::\n', metadata)

        });

        /*

;FFMETADATA1
album=Paranoid (Original Album) Disc 1
artist=Black Sabbath
album_artist=Black Sabbath
comment=Ta2r0b - KAT - xTa2r0bx - TPB - 320kbps
genre=Heavy Metal
title=Paranoid
track=02
replaygain_track_gain=eplaygai
date=1970
encoder=Lavf57.56.100

*/

        //console.log( '*******************************************')  
}

/*

Last thing…since I’m simply adding metadata to an existing file, can’t we just use the same file? Can’t our in.mp3 be the same as our out.mp3? Yes, but it’s tricky. If you simply execute the command line FFMpeg option, you can use the same file for in and out. However, partway through this process, FFMpeg will ask if you’d like to overwrite the file. You hit “Y”, and it continues. Try to do the same thing in Node.js – well it hangs. The process locks up waiting for you to hit “Y”, with no way to continue. Bad news….

Good news is that you can use a “-y” flag!

ffmpeg.exec(["-i", "myfile.mp3", "-y", "-acodec", "copy", "-metadata", "title=mytitle", "myfile.mp3"], callback);

*/


function convert(source_file, destination_file) {

    console.log('oooooooo')

        //var destination_file = source_file.split('/').slice(-1)[0].replace('.flv', '.mp3');
    //var ffmpeg = 'ffmpeg -y -i '+ source_file +' -f mp3 -vn -acodec copy ' + destination_file;

    //var exec = require('child_process');

    //var ffmpeg = './ffmpeg -i '+ source_file +' -f ogg ' + destination_file;
    //var child = exec.spawn( ffmpeg ).pipe(res);

    //child.stdout.pipe(res);
            var child_process = require("child_process");
            var ffmpeg = child_process.spawn('./ffmpeg', [ ///usr/local/bin/ffmpeg   // "./ffmpeg"
                //'-re',
                //'-y',
                //'-i', 'pipe:0', // path
                
                //"-b:v" , "64k",         // bitrate to 64k
                '-ss', '0',                 //starting time offset
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
                '-i', '../music/3_Love_Me_Two_Times.flac',    // Output to STDOUT
                '-ar', '44100', // Sampling rate   -- 44.1 kHz (CD), 48 kHz, 88.2 kHz, or 96 kHz.
                '-b:a', '160k', // bitrate to 64k
                '-f', 'adts',
                //'-strict', '-2',
                '../music/3_Love_Me_Two_Times.m4a'
            ]);

     //var ffmpeg = require('child_process').exec("./ffmpeg -i "+ source_file +" -f ogg " + destination_file );

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

/*

Example video

=========================================

{ filename: '/Users/rialso/Music/______nevera/Peter Bruntnell/2013 Retrospective/01 I Want You.mp3',
  title: 'I Want You',
  artist: 'Peter Bruntnell',
  album: 'Retrospective',
  track: '1/17',
  date: '2013-06-22',
  synched: false,
  duration: { raw: '00:04:57.53', seconds: 297 },
  video: 
   { container: 'mp3',
     bitrate: 227,
     stream: 0,
     codec: '',
     resolution: { w: 0, h: 0 },
     resolutionSquare: { w: 0, h: NaN },
     aspect: {},
     rotate: 0,
     fps: 0,
     pixelString: '',
     pixel: 0 },
  audio: 
   { codec: 'mp3',
     bitrate: '227',
     sample_rate: 44100,
     stream: 0,
     channels: { raw: 'stereo', value: 2 } } }
=========================================

*/





/*





// var ffmpeg_info = metadata_split[0]+'\''+path+'\':\n';
                // console.log('\n -----------ffmpeg_info----------- \n' + ffmpeg_info + '\n -----------ffmpeg_info----------- \n')


                var volume_bundle_find = metadata.indexOf('\n[Parsed_volumedetect_0' );
                if(volume_bundle_find > 0){

                    //console.log('\n -----------------------@@@@@@---------------------------------- \n', volume_bundle_find)
                    var volume_bundle = metadata.substr(volume_bundle_find);
                    //console.log('\n -----------volume_bundle----------- \n' + volume_bundle +  '\n -----------volume_bundle----------- \n')

                    var lines_volume_bundle = volume_bundle.split('\n');
                    //for debugging purposes
                    for(var v = 0;v<lines_volume_bundle.length;v++) {
                        if( lines_volume_bundle[v].indexOf('mean_volume') > 0){
                            var vo = lines_volume_bundle[v].split(':');
                            result.volume = vo[1].trim();
                        }
                    }
                }

                var meta = metadata_split[1];
                //console.log('\n ---------meta-------- \n' +  meta + '\n ---------meta-------- \n')

                var Output_bundle_find = meta.indexOf('Output #0, null, to \'null\':' );

                if(Output_bundle_find){

                    var metadata_bundle = meta.substr(0, Output_bundle_find);
                    //console.log('\n -----------metadata_bundle FIND ----------- \n');
                }
                else{
                    var metadata_bundle = meta;
                    //console.log('\n -----------metadata_bundle TOTAL ----------- \n');
                }

                //console.log( metadata_bundle + '\n -----------metadata_bundle----------- \n');


                var lines = metadata_bundle.split('\n');

                //for debugging purposes
                for(var i = 0;i<lines.length;i++) {

                    //console.log('this is line: ' + i + ' @@@@@@ ----' + lines[i]);

                    if(lines[i].indexOf(':') >0){

                        var a = lines[i].split(':');

                        if(a[0]){

                            //result[a[0].trim()] = a[1].trim();

                            if( a[0].trim() == 'title'){
                                result.title = a[1].trim();
                            }
                            else if( a[0].trim() == 'artist'){
                                result.artist = a[1].trim();
                            }
                            else if( a[0].trim() == 'album_artist'){
                                result.album_artist = a[1].trim();
                            }
                            else if( a[0].trim() == 'composer'){
                                result.composer = a[1].trim();
                            }
                            else if( a[0].trim() == 'album'){
                                result.album = a[1].trim();
                            }
                            else if( a[0].trim() == 'genre'){
                                result.genre = a[1].trim();
                            }
                            else if( a[0].trim() == 'track'){
                                result.track = a[1].trim();
                            }
                            else if( a[0].trim() == 'disc'){
                                result.disc = a[1].trim();
                            }
                            else if( a[0].trim() == 'compilation'){
                                result.compilation = a[1].trim();
                            }
                            else if( a[0].trim() == 'gapless_playback'){
                                result.gapless_playback = a[1].trim();
                            }
                            else if( a[0].trim() == 'date'){
                                result.date = a[1].trim();
                            }
                            // else if( a[0].trim() == 'sort_name'){
                            //     result.sort_name = a[1].trim();
                            // }
                            // else if( a[0].trim() == 'sort_album'){
                            //     result.sort_album = a[1].trim();
                            // }
                            // else if( a[0].trim() == 'sort_artist'){
                            //     result.sort_artist = a[1].trim();
                            // }
                            // else if( a[0].trim() == 'sort_composer'){
                            //     result.sort_composer = a[1].trim();
                            // }
                            //else if( a[0].trim() == 'lyrics'){
                            else if(a[0].indexOf('lyrics') >= 0){
                                result.lyrics = a[1].trim();
                            }
                            else if( a[0].trim() == 'encoder'){
                                result.encoder = a[1].trim();
                            }
                            else if( a[0].trim() == 'Duration'){
                                var d = lines[i].split(',');
                                //console.log(d)

                                for(var u in d) {
                                    if( d.hasOwnProperty( u ) ) {
                                        var l = d[u].split(/:(.+)/); // hacemos split del 1 param - Duration: 00:03:16.48

                                        //duration[l[0].trim()] = l[1].trim();

                                        if( l[0].trim() == 'Duration'){
                                            result.duration = l[1].trim();
                                        }else if( l[0].trim() == 'start'){
                                            result.start = l[1].trim();
                                        }else if( l[0].trim() == 'bitrate'){
                                            result.bitrate = l[1].trim();
                                        }
                                    }
                                }
                            }
                            else if( a[0].trim() == 'Stream #0'){

                                if(lines[i].indexOf('Audio:') > 0){

                                    //console.log('this is line: ' + i + ' @@@@@@ ----' + lines[i]);

                                    var st = lines[i].split('Audio:');
                                    //console.log(st)
                                    if(st[0].indexOf('0') > 0){

                                        //console.log('this is line: ' + i + ' @@@@@@ ---- Audio --- | ' + st[1]);

                                        var au = st[1].trim().split(', ');
                                        //console.log(au);

                                        for(var s in au) {
                                            if( au.hasOwnProperty( s ) ) {
                                                var m = au[s];

                                                //console.log( m )

                                                if(m.indexOf('Hz') > 0){

                                                    // pasar a kHz

                                                    result.sample_rate = m;
                                                }
                                                else if(m.indexOf('kb/s') > 0){

                                                    // Definir

                                                    result.bit_rate = m;
                                                }
                                                else if(m.indexOf('stereo') >= 0){

                                                    // buscar mas opciones

                                                    result.channels = m;
                                                }
                                                else if(m.indexOf('aac') >= 0){

                                                    // reduce

                                                    result.kind = 'aac';
                                                }
                                                else if(m.indexOf('mp3') >= 0){

                                                    // reduce

                                                    result.kind = 'mp3';
                                                }
                                            }
                                        }
                                    }                                
                                }
                            }
                        }
                    }
                }



                */



                /*

                A.   Appendix A - Genre List from ID3v1

   The following genres is defined in ID3v1

      0.Blues
      1.Classic Rock
      2.Country
      3.Dance
      4.Disco
      5.Funk
      6.Grunge
      7.Hip-Hop
      8.Jazz
      9.Metal
     10.New Age
     11.Oldies
     12.Other
     13.Pop
     14.R&B
     15.Rap
     16.Reggae
     17.Rock
     18.Techno
     19.Industrial
     20.Alternative
     21.Ska
     22.Death Metal
     23.Pranks
     24.Soundtrack
     25.Euro-Techno
     26.Ambient
     27.Trip-Hop
     28.Vocal
     29.Jazz+Funk
     30.Fusion
     31.Trance
     32.Classical
     33.Instrumental
     34.Acid
     35.House
     36.Game
     37.Sound Clip
     38.Gospel
     39.Noise
     40.AlternRock
     41.Bass
     42.Soul
     43.Punk
     44.Space
     45.Meditative
     46.Instrumental Pop
     47.Instrumental Rock
     48.Ethnic
     49.Gothic
     50.Darkwave
     51.Techno-Industrial
     52.Electronic
     53.Pop-Folk
     54.Eurodance
     55.Dream
     56.Southern Rock
     57.Comedy
     58.Cult
     59.Gangsta
     60.Top 40
     61.Christian Rap
     62.Pop/Funk
     63.Jungle
     64.Native American
     65.Cabaret
     66.New Wave
     67.Psychedelic
     68.Rave
     69.Showtunes
     70.Trailer
     71.Lo-Fi
     72.Tribal
     73.Acid Punk
     74.Acid Jazz
     75.Polka
     76.Retro
     77.Musical
     78.Rock & Roll
     79.Hard Rock


*/
