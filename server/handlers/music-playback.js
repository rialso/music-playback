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

            startTrackStreaming( req, res, path );

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


