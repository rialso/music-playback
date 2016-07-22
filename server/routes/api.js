


var express = require('express'),

	handle  = require('./main'),
	echo 	 = require('./echo'); // simple echo service (ip address, date/time)



//var music = require('../handlers/music-playback');
var music = require('../handlers/music-playback-convert');



module.exports = (function() {
    'use strict';
    var api = express.Router();

    api.use(function(req, res, next) {
	    // do logging
	    //console.log('Something is happening.');
	    console.log('api Time:', Date.now(), req.method, req.url );
	    next(); // make sure we go to the next routes and don't stop here
	});

	api.get('/', function(req, res) {
	  	res.send('Welcome');
	});



	api.get('/login', function(req, res) {
		console.log('Welcome login');
	  	res.send('Welcome login');
	});

	api.get('/echo', echo.list);


	//api.get('/user/:user', echo.list);

/*
	// datos de prueba
	api.get('/datos' 	 ,handle.findAll);
	api.get('/datos/:id' ,handle.findById);


	// database stuff
	//api.get( '/database/test', db_test.get);
	//api.post('/database/test', db_test.post);
	
	api.route('/database/test')
		.get( db_test.get )
		.post(function(req, res) {
			res.send('Add a book');
		})
		.put(function(req, res) {
			res.send('Update the book');
		});
*/	

	api.get('/music/:id', music.startPlayback );


	// api.get ('/tracks', 						tracks.tracks);
	// api.get ('/albums', 						tracks.albums);
	// api.get ('/artists', 						tracks.artists);
	// api.get ('/artist/:artist', 				tracks.artist);
	// api.get ('/artist/:artist/album/:album', 	tracks.ArtistAlbum);








    return api;
})();