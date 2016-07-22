

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
//http://stackoverflow.com/questions/25429522/q-promise-nodejs-how-to-resolve-in-loop
//http://www.html5rocks.com/en/tutorials/es6/promises/?redirect_from_locale=es


var bodyParser 	= require('body-parser');
var trck = require('../calls/c_tracks');


exports.all = function(req, res){
    trck.c_all().then(function(data){
        res.end(JSON.stringify(data) );
    },function(err){
        reject(err);
    });
};

exports.count = function(req, res){
    trck.c_count().then(function(data){
        res.end(JSON.stringify(data) );
    },function(err){
        reject(err);
    });
};


exports.artists = function(req, res){
    console.log('controler artists')
    trck.c_artists().then(function(data){
        res.end(JSON.stringify(data) );
    },function(err){
        reject(err);
    }); 
};

exports.albums = function(req, res){
    trck.c_albums().then(function(data){
        res.end(JSON.stringify(data) );
    },function(err){
        reject(err);
    }); 
};


exports.artist = function(req, res){
    var artist = req.params.artist;
    trck.c_artist(artist).then(function(data){
        res.end(JSON.stringify(data) );
    },function(err){
        reject(err);
    }); 
};

exports.artists_obj = function(req, res){
    trck.c_artists_obj().then(function(data){
        res.end(JSON.stringify(data) );
    },function(err){
        reject(err);
    });
};

exports.artist_album = function(req, res){
    var artist = req.params.artist;
    var album  = req.params.album;
    trck.c_artist_album(artist, album).then(function(data){
        res.end(JSON.stringify(data) );
    },function(err){
        reject(err);
    }); 
};




/***************************************************/

exports.tracks = function(req, res){
    trck.c_tracks().then(function(data){
        res.end(JSON.stringify(data) );
    },function(err){
        reject(err);
    });
};






exports.ArtistAlbum = function(req, res){
    var artist = req.params.artist;
    var album  = req.params.album;
    trck.c_ArtistAlbum(artist, album).then(function(data){
        res.end(JSON.stringify({
            status: 200,
            message: '',
            data : data
        }));
    },function(err){
        reject({
            status: 200,
            message: err
        });
    }); 
};










