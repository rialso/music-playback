
/* Global imports */
// https://github.com/geekjuice/musicjson

'use strict';
var isThere = require('is-there');
var config = require('../../config');

var ffmpegRoot  = './server/lib/handlers/ffmpeg';


exports.init = function(path) {

    //var path = '/Users/rialso/Music/______nevera/Peter Bruntnell/2013 Retrospective/01 I Want You.mp3';
    //var path = '/Users/rialso/Music/______nevera/James Hunter Six/Hold On!/01 If That Don\'t Tell You.mp3';

    //console.log( '::: metadata -> ', path )

    //  Get Video File Information
    // Note: The -hide_banner option is used to hide a copyright notice shown my ffmpeg, 
    // such as build options and library versions. This option can be used to suppress printing this information.
    //$ ffmpeg -i video.flv -hide_banner

    //You can save media file metadata to a text file using -f ffmetadata option as the following:
    //ffmpeg -i input_video -f ffmetadata metadata.txt

    return new Promise(function(resolve, reject) {

        if (isThere(path)) {

            var child_process = require("child_process");

            var ffmpeg_data = child_process.spawn(ffmpegRoot, [ ///usr/local/bin/ffmpeg   // "./ffmpeg"
                '-hide_banner',
                '-nostdin',
                '-i', path,    // Output to STDOUT
                '-af', 'volumedetect',
                '-f', 'null',   // -f: the output file format (i.e container)
                '-y', 'null'
            ]);

            var metadata = '';

            ffmpeg_data.stderr.on('data', function (data) {
                //console.log('************************stderr: ' + data);

                metadata += data;
            });

            ffmpeg_data.on('exit', function(data){

                //console.log('--------------------------------------------------------- \n', metadata)

                // var result = _getInformation('audio', metadata);

                // // console.log('=========================================\n')
                // // console.log(result)
                // // console.log('=========================================\n')

                
                // resolve( result );

                _getInformation('audio', metadata).then(function(meta){
                    // // para saber si hay cover art
                    var cover = /Video:\s\mjpeg,\s(.+)/.exec(metadata) || [];

                    //console.log('::::::::cover::::::::::::\n', cover[0])

                    if(cover[0]){

                        getImage(meta).then(function(obj){

                            resolve( obj );
                            
                        },function(error){
                            console.log('getImage !Failed: ', error)
                            reject(error);
                        });

                    }else{

                        meta.cover = '';
                        resolve( meta );
                    }

                    //resolve( meta );
                    
                },function(error){
                    console.log('_getInformation !Failed: ', error)
                    reject(error);
                }); 
            });
        } 
        else {
            reject('Could not find file ' + path);
        } 
    });

    
}


var getImage = function(metadata) {
    return new Promise(function(resolve, reject) {

        //console.log(metadata)

        var path = metadata.location;

        //var root = path.substr(0, path.lastIndexOf('/'));

        var name = 'sin titulo';

        if(metadata.artist && metadata.album){
            name = metadata.artist +' - '+ metadata.album;
        }
        else if(metadata.artist && metadata.title){
            name = metadata.artist +' - '+ metadata.title;
        }

        var cover = name+'.jpg';

        //var pathname = root+'/'+name+'.jpg';
        var pathname = 'covers/'+cover;

        //metadata.cover = pathname;
        //resolve(metadata)


        var child_process = require("child_process");
        var ffmpeg_data = child_process.spawn(ffmpegRoot, [ ///usr/local/bin/ffmpeg   // "./ffmpeg"
            '-y',
            '-i', path,    // Output to STDOUT
            pathname,
            '-nostdin',
            //'-report'
        ]);

        // -loglevel panic 
        // -nostdin -report

        metadata.cover = pathname;
        resolve(metadata)


        // var mtdt = '';
        // ffmpeg_data.stderr.on('data', function (data) {
        //     console.log('.....', data)
        //     mtdt += data;
        // });
        // ffmpeg_data.on('exit', function(data){

        //     console.log('::::::::metadata::::::::::::\n', data)

        //     metadata.cover = pathname;
        //     resolve(metadata)

        //     // console.log('::::::::metadata::::::::::::\n', metadata)
        // });
    });
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
    return new Promise(function(resolve, reject) {
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

            ret.album_artist    = album_artist[1] || '';
            //ret.lyrics          = lyrics[1] || '';

            //, lyrics          = /lyrics.*\s:\s(.+)/.exec(stdout) || []         //lyrics.*\s:\s(.+)\n\s(.+)\n\s(.+). lyrics.*\s:\s(.+)(\n.*){8}
            //, lyrics          = /lyrics.*\s:/.exec(stdout) || []
          
            var lyrics   = /lyrics.*\s:/.exec(stdout) || [];
          
            if(lyrics[0]){
                var meta  = stdout.split(lyrics[0]);
                var lines = meta[1].split('\n');
                var l = '';
                for(var i = 0;i<lines.length;i++) {
                    if(i==0){ l+= lines[0].trim(); }
                    if(lines[i].indexOf(':') >0){
                        var a = lines[i].split(':');
                        if(a[0].trim() == ''){
                            l+= a[1];
                        }else{
                            break
                        }           
                    }
                }
                ret.lyrics = l;
            }else{
                ret.lyrics = '';
            }
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
        //return ret;
        resolve(ret);
    });
};

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
