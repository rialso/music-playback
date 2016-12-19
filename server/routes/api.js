

'use strict';

var express = require('express'),

	handle  = require('./main'),
	echo 	= require('./echo'); // simple echo service (ip address, date/time)

var sse = require('./sse');


var tracks = require('../controllers/tracks');



// para procesar ficheros
//var process = require('../lib/utils/process');
// process.call_load_data();

//var load_data = require('../lib/utils/load-data');


var music = require('../lib/handlers/music-playback-basic');
//var music = require('../lib/handlers/music-playback');


// module.exports = (function() {
    
    var api = express.Router();

    api.use(function(req, res, next) {
	    // do logging
	    //console.log('Something is happening.');
	    console.log('api Time:', Date.now(), req.method, req.url );
	    next(); // make sure we go to the next routes and don't stop here
	});


	api.use(sse);


	api.get('/', function(req, res) {
	  	res.send('Welcome');
	});



	api.get('/login', function(req, res) {
		console.log('Welcome login');
	  	res.send('Welcome login');
	});

	api.get('/echo', echo.list);


	api.get ('/tracks', 						tracks.tracks);
	api.get ('/tracks/count', 					tracks.tracksCount);
	api.get ('/artists', 						tracks.artists);

	api.get ('/albums', 						tracks.albums);
	api.get ('/artist/:artist', 				tracks.artist);

	api.get ('/artist/:artist/album/:album', 	tracks.artistAlbum);


	api.get ('/artists/resume', 				tracks.artistsResume);

	// api.get('/scan_music', load_data.init );

	// //api.get('/scan_music', process.call_load_data );

	api.get('/track/:id',  						music.startPlayback );
	api.get('/metadata',  						tracks.metadata );
	api.get('/metadata-load',  					tracks.metadataLoad );


	// var loadData = require('../lib/utils/load-data');
	// api.get('/metadata-load', function(req, res) {
	// 	loadData.init().then(function(data){

	// 		sseSend(data)

	//         res.status(200).json({
	//             status  :200,
	//             success :true,
	//             data    :data
	//         }); 
	//         //res.end(JSON.stringify(data) );
	//     },function(error){
	//         console.error("metadata-load-pruebas Failed!", error);
	//         res.status(401).json({ 
	//             status  :401,
	//             success :false,
	//             message :'Error - '+error
	//         });
	//     });
	// })



	// api.get('/metadata-load-data', function(req, res) {
	//   res.sseSetup()
	//   res.sseSend(tracks.metadataLoad)
	//   //connections.push(res)
	// })



	var mtdata_prb = require('../_pruebas/music-metadata-pruebas');
	api.get('/metadata-load-pruebas', function(req, res) {
		mtdata_prb.init().then(function(data){
	        res.status(200).json({
	            status  :200,
	            success :true,
	            data    :data
	        }); 
	        //res.end(JSON.stringify(data) );
	    },function(error){
	        console.error("metadata-load-pruebas Failed!", error);
	        res.status(401).json({ 
	            status  :401,
	            success :false,
	            message :'Error - '+error
	        });
	    });
	});





//     return api;
// })();

module.exports = api;


