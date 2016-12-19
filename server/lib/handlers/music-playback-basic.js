/*




*/
/* Global imports */

'use strict';
var fs          = require('fs-extra');
var isThere     = require('is-there');
var callTrack   = require('../../calls/tracks');

/* Public Methods */

exports.startPlayback = function(req, res) {
    var id = req.params.id;

    console.log(':::::::: music-playback-basic ::::', id)

    callTrack.trackById(id).then(function(data){
        //console.log('::::::::path: \n', path)

        var path = data.location;
        if (isThere(path)) {
            startTrackStreaming( req, res, path );
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

        console.log('::::::: total bytes ' + start + '-' + end + '/' + total)

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

