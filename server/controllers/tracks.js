

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
//http://stackoverflow.com/questions/25429522/q-promise-nodejs-how-to-resolve-in-loop
//http://www.html5rocks.com/en/tutorials/es6/promises/?redirect_from_locale=es


//var bodyParser 	= require('body-parser');

var trck = require('../calls/tracks');

var resp = {
    error: function(res,msg){
        res.status(401).json({ 
            status  :401,
            success :false,
            message :'Error - '+msg
        });
    },
    ok: function(res,data){
       res.status(200).json({
            status  :200,
            success :true,
            data    :data
        });     
    }
};

///////////////////////////



/////////////////////////

var mtdata = require('../lib/handlers/music-metadata');

exports.metadata = function(req, res){
    mtdata.init().then(function(data){
        resp.ok(res, data);
        //res.end(JSON.stringify(data) );
    },function(error){
        console.error("metadata Failed!", error);
        resp.error(res, error);
    });
};

var loadData = require('../lib/utils/load-data');

exports.metadataLoad = function(req, res){
    loadData.init().then(function(data){
        resp.ok(res, data);
        //res.end(JSON.stringify(data) );
    },function(error){
        console.error("metadataLoad Failed!", error);
        resp.error(res, error);
    });
};



////////////////////////////////////////////////////////


exports.tracks = function(req, res){
    trck.tracks().then(function(data){
        resp.ok(res, data);
        //res.end(JSON.stringify(data) );
    },function(error){
        console.error("tracks Failed!", error);
        resp.error(res, error);
    });
};

exports.tracksCount = function(req, res){
    trck.tracksCount().then(function(data){
        resp.ok(res, data);
    },function(error){
        console.error("tracksCount Failed!", error);
        resp.error(res, error);
    });
};

exports.artists = function(req, res){
    trck.artists().then(function(data){
        resp.ok(res, data);
    },function(error){
        console.error("artists Failed!", error);
        resp.error(res, error);
    });
};

exports.albums = function(req, res){
    trck.albums().then(function(data){
        resp.ok(res, data);
    },function(error){
        console.error("albums Failed!", error);
        resp.error(res, error);
    });
};

exports.artist = function(req, res){
    var artist = req.params.artist;
    trck.artist(artist).then(function(data){
        resp.ok(res, data);
    },function(error){
        console.error("artist Failed!", error);
        resp.error(res, error);
    });
};

exports.artistAlbum = function(req, res){
    var artist = req.params.artist;
    var album  = req.params.album;
    trck.artistAlbum(artist, album).then(function(data){
        resp.ok(res, data);
    },function(error){
        console.error("artist Failed!", error);
        resp.error(res, error);
    });
};

exports.artistsResume = function(req, res){
    trck.artist_OBJ().then(function(data){
        resp.ok(res, data);
    },function(error){
        console.error("artistsResume Failed!", error);
        resp.error(res, error);
    });
};


