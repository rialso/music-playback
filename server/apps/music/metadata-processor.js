

var metadata  = require('../../lib/handlers/music-metadata');

//exports.valid_filetypes = /(m4a|mp3|flac)$/gi;
exports.valid_filetypes = /(m4a|mp3)$/gi;


exports.processFile = function (file) {

    return new Promise(function(resolve, reject) {

    	//console.log('@@@@@@@@@@@@@ processFile: -------- ',file)

        metadata.init( file ).then(function(meta){

            meta.location = file;

            var tn ={no:0,of:0};
            if(meta.track){
                if(meta.track.indexOf('/')){
                    var a = meta.track.split('/');
                    if(a[0]){tn.no=Number(a[0])};
                    if(a[1]){tn.of=Number(a[1])};
                }else{
                    tn.no=metadata.track;
                }
            }
            meta.track = tn;

            var dn ={no:0,of:0};
            if(meta.disc){
                if(meta.disc.indexOf('/')){
                    var a = meta.disc.split('/');
                    if(a[0]){dn.no=Number(a[0])};
                    if(a[1]){dn.of=Number(a[1])};
                }else{
                    dn.no=meta.disk;
                }
            }
            meta.disc = dn;

            resolve(meta);

        },function(error){
            console.log('metadata.init Error --> ', err);
            reject(error)
        });
    });
}


 //    ffmetadata.read(file, function(err, metadata) {
 //        if (err){
 //        	callback(err)
 //        	console.error("Error reading metadata", err);
 //        }
 //        else {
 //        	//console.log(metadata);

 //            //if( metadata['lyrics-XXX']){ console.log('lyrics-XXX', metadata['lyrics-XXX']) }

 //            var track = {
 //                Name            : metadata.title         ? metadata.title.replace(/\\/g, '')          : 'Unknown Title',
 //                Artist          : metadata.artist        ? metadata.artist.replace(/\\/g, '')         : 'Unknown Artist',
 //                Album_Artist    : metadata.album_artist  ? metadata.album_artist.replace(/\\/g, '')   : '',
 //                Album           : metadata.album         ? metadata.album.replace(/\\/g, '')          : 'Unknown Album',
 //                Year            : metadata.date          ? metadata.date.replace(/\\/g, '')           : '',
 //                Genre           : metadata.genre         ? metadata.genre.replace(/\\/g, '')          : '',
 //                Track_Number    : '',
 //                Disc_Number     : '',
 //                Total_Time      : metadata.duration      ? metadata.duration.replace(/\\/g, '')       : 0,
 //                Location        : file
 //            }

 //            var tn ={no:0,of:0};
 //            if(metadata.track){
 //                if(metadata.track.indexOf('/')){
 //                    var a = metadata.track.split('/');
 //                    if(a[0]){tn.no=Number(a[0])};
 //                    if(a[1]){tn.of=Number(a[1])};
 //                }else{
 //                    tn.no=metadata.track;
 //                }
 //            }
 //            track.Track_Number = tn;

 //            var dn ={no:0,of:0};
 //            if(metadata.disk){
 //                if(metadata.disk.indexOf('/')){
 //                    var a = metadata.disk.split('/');
 //                    if(a[0]){dn.no=Number(a[0])};
 //                    if(a[1]){dn.of=Number(a[1])};
 //                }else{
 //                    dn.no=metadata.disk;
 //                }
 //            }
 //            track.Disc_Number = dn;

 //        	callback( err, track);
 //        }
 //    });


/*
stdout: { 
  album: 'From a Basement on the Hill',
  composer: 'Elliott Smith',
  genre: 'Alternative',
  title: 'Don\'t Go Down',
  artist: 'Elliott Smith',
  album_artist: 'Elliott Smith',
  track: '4/15',
  publisher: 'Anti',
  date: '2004',
  encoder: 'Lavf56.40.101' }

stdout: { 
  title: 'Place In My Heart',
  album: 'The Ghosts Of Highway 20',
  encoded_by: '.:WRE:.',
  publisher: 'Highway 20 Records',
  language: 'English',
  genre: 'Pop',
  disc: '1/2',
  artist: 'Lucinda Williams',
  Catalog: 'H2003',
  date: '2016',
  Media: 'CD',
  'Release Type': 'Retail',
  'Retail Date': '2016-00-00',
  'Rip Date': '2016-01-24',
  'Ripping Tool': 'EAC',
  Supplier: '.:WRE:.',
  track: '4/7',
  encoder: 'Lavf56.40.101' }

stdout: { 
  album: 'Hold On!',
  artist: 'The James Hunter Six',
  album_artist: 'The James Hunter Six',
  encoded_by: 'exy',
  genre: 'Soul',
  title: 'If That Don\'t Tell You',
  track: '1',
  'lyrics-XXX': 'Time says nothing but I told you so\r\\',
  'And laughs at all the foolish things we say\r': 'And laughs at all the foolish things we say\r\\',
  'If I could tell you I would let you know\r': 'If I could tell you I would let you know\r\\',
  'I\'d let you know\r': 'I\'d let you know\r\\',
  '\r': '\r\\',
  'It never says that you could stay awhile\r': 'It never says that you could stay awhile\r\\',
  'In a place where you feel at home\r': 'In a place where you feel at home\r\\',
  'And when it comes to moving on again\r': 'And when it comes to moving on again\r\\',
  'You just smile\r': 'You just smile\r\\',
  '\'Til each ex-lover forgets your face\r': '\'Til each ex-lover forgets your face\r\\',
  'And the end has not justified the means\r': 'And the end has not justified the means\r\\',
  'Nothing unexpected as you know\r': 'Nothing unexpected as you know\r\\',
  'Just not so soo': 'Just not so soon',
  date: '2016',
  encoder: 'Lavf56.40.101' }
*/


/*

var mm = require('musicmetadata');

exports.processFile_NO = function (file, callback) {

   var parser = mm(fs.createReadStream(file),  { duration: true }, function (err, metadata) {
        if (err){
        	callback(err)
        	//console.error("-------Error reading metadata", err);
        }
        else{

        	var track = {
        		Name 			: metadata.title 			? metadata.title.replace(/\\/g, '') 			: 'Unknown Title',
        		Artist 			: metadata.artist[0] 		? metadata.artist[0].replace(/\\/g, '') 		: 'Unknown Artist',
        		Album_Artist 	: metadata.albumartist[0] 	? metadata.albumartist[0].replace(/\\/g, '') 	: '',
				Album 			: metadata.album 			? metadata.album.replace(/\\/g, '') 			: 'Unknown Album',
				Year 			: metadata.year 			? metadata.year.replace(/\\/g, '') 				: '',
				Track_Number 	: metadata.track,
				Genre 			: metadata.genre[0] 		? metadata.genre[0].replace(/\\/g, '') 			: '',
				Disc_Number 	: metadata.disk,
				Total_Time 		: metadata.duration,
				Location 		: file
        	}

	        callback( null, track);
        }
    });
}

*/

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
{ volume: '-19.0 dB',
  title: 'Aged Pain',
  artist: 'James Carter Organ Trio',
  album_artist: 'James Carter Organ Trio',
  album: 'At The Crossroads',
  genre: 'Jazz',
  track: '3/12',
  date: '2011',
  encoder: 'X Lossless Decoder 20141129, QuickTime 7.7.3, True VBR Quality 127',
  duration: '00:05:26.38',
  start: '0.000000',
  bitrate: '314 kb/s',
  kind: 'AAC',
  sample_rate: '44100 Hz',
  channels: 'stereo',
  bit_rate: '309 kb/s (default)' }
  */

