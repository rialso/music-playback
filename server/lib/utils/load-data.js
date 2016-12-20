//http://jlunaquiroga.blogspot.com.es/2014/03/creating-processes-in-nodejs.html


//var musicpath = '/Users/rtb/Music/___nevera/_Jazz/Ben Webster';
//var musicpath = '/Users/rtb/Music/___nevera/_Jazz';
//var musicpath = '/Users/rtb/Music/___nevera';
//var musicpath = '/Users/rtb/Music';
//var musicpath = '/Volumes/Untitled/______nevera';
//var musicpath = '/Users/rialso/Music/______nevera';


var metadataPro     = require('../../apps/music/metadata-processor');
var fileUtils       = require('../../lib/utils/file-utils');
var track           = require('../../calls/tracks');
var config          = require('../../config');
var musicpath       = config.musicpath;


//http://ejohn.org/blog/javascript-array-remove/
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from; 
    return this.push.apply(this, rest); 
};

exports.init = function(path) {

    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ load_data @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

    return new Promise(function(resolve, reject) {

        findTracks(path).then(function(files){

            //console.log('getFiles: ---------------------\n ', files)

            if(files.length>0){

                /*
                    insertFiles(s).then(function(data){

                        console.log('@@@@@@@@@@@@@ END FILES @@@@@@@@@@@@@@@')
                        resolve('end files')
                    });
                */

                var s = '';
                var m = false;
                function _recursive(array) {
                    console.log('--------- array length: ',array.length)
                    if (array == 0){

                        console.log('@@@@@@@@@@@@@ END FILES @@@@@@@@@@@@@@@')
                        resolve('end files')

                    }else{

                        if(array.length>10){
                            s = array.slice(0,10); 
                            array.remove(0,9)
                        }else{
                            m = true
                            s = array;
                        }

                        //console.log('------b----------------', array.length)
                        
                        return insertFiles(s, m).then(function(data){

                            //console.log('@@@@@@@@@@@@@ END 10 FILES @@@@@@@@@@@@@@@', data)
                            //console.log('@@@@@@@@@@@@@ END 10 FILES @@@@@@@@@@@@@@@', files.length)
                            //resolve('end 10 files')

                            if(m){
                                _recursive(0);
                            }else{
                                _recursive(array);
                            }
                        });
                    }
                }
                _recursive(files);        
            }
            else{
                console.log('@@@@@@@@@@@@@ END FILES 0 @@@@@@@@@@@@@@@')
                resolve('end files 0')
            }
        });
    });
};


var findTracks = function(path) {

   return new Promise(function(resolve, reject) {

        fileUtils.getLocalFiles_p(musicpath, metadataPro.valid_filetypes, function (err, files) {

            //console.log('total getLocalFiles: ', files.length)

            var i;
            var all = files.length;
            var count = 0;

            var totalFiles = [];

            //for(var i=0; i < all; i++)(function(i){
            for(i = all - 1; i >= 0; i--)(function(i){

                //console.log(':::::: load-data: ', i+' | '+files[i]);

                track.trackVerify(files[i]).then(function(data){

                    //console.log(':::::: load-data: ', i+' | '+ data.length +' | '+files[i]);

                    if(data.length == 0){

                        //console.log(':::::: load-data: ', i+' | '+ data.length +' | '+files[i]);

                        totalFiles.push( files[i] )
                    }
                    else{

                        var trk = data[0];
                        //console.log(count+' | '+i+' | EXISTE | ', trk.artist +' - '+ trk.album +' - '+ trk.title);
                    }

                    if(i==0){
                        //console.log('@@@@@@@@@@@@ NO DATA - end totalFiles \n', totalFiles)
                        resolve(totalFiles)
                    }

                },function(error){
                    console.log(':::::: load-data ERROR: ', i+' | '+files[i]);
                    reject(error);
                });

            })(i);
        });
    });
}

var insertFiles = function(files) {
    return new Promise(function(resolve, reject) {
        var i;
        var all = files.length;
        var count = 0;

        //console.log(':::::: load-data ERROR: ', i+' | \n'+files);

        for(i = all - 1; i >= 0; i--)(function(i){

            metadataPro.processFile(files[i]).then(function(file){

                //track.trackInsert(file).then(function(dobj){
                track.trackVerifyInsert(file).then(function(dobj){

                    //console.log( count+' | '+i+' | INSERT | '+ dobj.location);

                    console.log('-----count-----', count +' - '+(all-1))
             

                    if(count>=(all-1)){ 
                        //console.log('@@@@@@@@@@@@ terminado processFile');

                        resolve('processFile finished in '+ count +' files')
                    }
                    count++;
                    
                },function(err){
                    reject(err);
                    count++
                }); 

            },function(error){
                //console.log('metadataPro.processFile ERROR: ', i+' | '+files[i]);

                console.error(count+' | '+i+' | Error reading metadata', error +' | '+ files[i]);
                count++;

                reject(error);
            });
        })(i);
    });
}



exports.extraer_cover = function(path) {

//             var cp = './covers/'+ dobj.Artist +' - '+ dobj.Album +'.jpg';
//             var coverPath = cp.replace(/\s/g, '').replace(/&/g, '');
//             // console.log('coverPath: ', coverPath);
//             // console.log('data.Location: ', file.Location)

//             if (isThere(coverPath)) {

//                 console.error('Could not find file ' + coverPath);

//             } else {
//                 //console.log('coverPath: ', coverPath);

//                 //require('child_process').exec('./ffmpeg -i '+ dobj.Location +' '+ coverPath)

//                 child.spawn('./ffmpeg', [
//                     '-i', dobj.Location,
//                     coverPath
//                  ]);
//             }


}





/*

{ title: 'Autumn Leaves',
  artist: [ 'Ben Webster' ],
  albumartist: [],
  album: 'There Is No Greater Love',
  year: '1965',
  track: { no: 8, of: 8 },
  genre: [ 'Jazz' ],
  disk: { no: 0, of: 0 },
  picture: [ { format: 'jpg', data: [Object] } ],
  duration: 321.09775,
  _id: 'J7BvauaAfit8raoC' }

*/


/*

    fileUtils.getLocalFiles_1(musicpath, music_metadata.valid_filetypes, function (err, files) {

        console.log('total getLocalFiles_1: ', files.length)

        //console.log('total getLocalFiles_1: ', files[1254])

        var i, all = files.length;

        var count = 0;

        for(i=0; i < all; i++)(function(i){

            //console.log(i+' | '+files[i]);

            track.c_verify_track(files[i]).then(function(data){

                if(data.length == 0){

                    music_metadata.processFile(files[i], function (err, file) {

                        if(err){

                            console.error(count+' | '+i+' | Error reading metadata', err +' | '+ files[i]);
                            count++;
                        }
                        else{

                            //console.log(err)

                            //console.log(count+' | '+i+' | ', file);

                            //track.c_insert_track(file).then(function(data){
                            track.c_insert_track(file).then(function(data){
                                
                                //console.log(data);
                                console.log(count+' | '+i+' | ', data.Artist +' - '+ data.Album +' - '+ data.Name);

                                //console.log(data)

                                if(count>=(all-1)){

                                    console.log('@@@@@@@@@@@@ terminado processFile')
                                }
                                count++;
                                
                            },function(err){
                                reject(err);
                            });
                        }
                        
                    })
                }
                else{
                    //console.log('----| '+count+' | '+i+' | ', files[i]);
                    if(count>=(all-1)){

                        console.log('@@@@@@@@@@@@ terminado processFile')
                    }
                    count++;
                }

             },function(err){
                reject(err);
            });    
        })(i);
    });


*/
