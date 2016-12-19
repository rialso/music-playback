
// Type 3: Persistent datastore with automatic loading
//var Datastore = require('nedb')


//  , db = new Datastore({ filename: 'lib/database/todo.db', autoload: true });  //filename: __dirname + '/db.json'
// You can issue commands right away


//var prepare_artists = require('../calls/prepare_artists');

var prepare = require('../calls/prepare');

var Datastore = require('nedb'),
  	db = {};
  	db.songs = new Datastore({ filename: 'server/lib/database/todo.db', autoload: true });
  //app.db.playlists = new Datastore({ filename: app.get('configDir') + '/dbs/playlists.db', autoload: true });
  //app.db.settings = new Datastore({ filename: app.get('configDir') + '/dbs/settings.db', autoload: true });


//var app.db = {};
//app.db.songs = new Datastore({ filename: 'lib/database/todo.db', autoload: true });

exports.trackById = function( id ){
	return new Promise(function(resolve, reject) {
		db.songs.findOne({ _id: id }, function (error, doc) {
		// If no document is found, doc is null
			resolve( doc );
		});
    });
};

exports.trackVerify = function( location ){
	return new Promise(function(resolve, reject) {
		db.songs.find({location:location}, function (error, doc) {
			resolve( doc );
		});
    });
};

exports.trackInsert = function( data ){

	//console.log('::::::::: data: ', data)

	return new Promise(function(resolve, reject) {
		// insert document in the collection
    	db.songs.insert(data, function (error, doc) {   // Callback is optional
		  	// newDoc is the newly inserted document, including its _id
		  	// newDoc has no key called notToBeSaved since its value was undefined

		  	resolve( doc );
		});
    });
};

exports.trackVerifyInsert = function( data ){
	return new Promise(function(resolve, reject) {

		//console.log('::::::::: data: \n', data)

		db.songs.find({location:data.location}, function (error, doc) {

	        //res.end(JSON.stringify(data) );

	        if(doc.length==0){

	        		// insert document in the collection
		    	db.songs.insert(data, function (error, doc) {   // Callback is optional
				  	// newDoc is the newly inserted document, including its _id
				  	// newDoc has no key called notToBeSaved since its value was undefined

				  	resolve( doc );
				});
			}else{
				console.error("trackVerify Failed!", error);
			}

	    });
    });
};


exports.tracks = function(){
	return new Promise(function(resolve, reject) {
		// Find all documents in the collection
		db.songs.find({}, function (error, docs) {
		    //console.log(docs)
		    resolve( docs );
		});
    });
};

exports.tracksCount = function(){
    return new Promise(function(resolve, reject) {
		// Count all documents in the datastore
		db.songs.count({}, function (error, count) {
		    //console.log(count)
		    resolve( count );
		});
    });
};


exports.artists = function(){
	return new Promise(function(resolve, reject) {
		// Find all documents in the collection
		db.songs.find({}, function (error, doc) {
		    //console.log(doc)
		    //resolve( doc );

		    var count = doc.length, arr = [], obj = {};

		    //console.log('count: ', count)

		    var d = new Date();
		    var LOOPS = 1000;

		    	for (var i = count - 1; i >= 0; i--) {
					obj[doc[i].artist] = { artist: doc[i].artist }
				};
			    for (var key in obj) {
			        arr.push( { "artist": obj[key].artist } );
			        //arr.push( obj[key].artist );
			    }
			    var arr_length = arr.length;

				resolve({ 
					cant: arr_length,
					artists: arr
				});
		});
    });
};

exports.albums = function(){
	return new Promise(function(resolve, reject) {
		// Find all documents in the collection
		db.songs.find({}, function (error, doc) {
		    //console.log(doc)
		    //resolve( doc );

		    var count = doc.length, arr = [], obj = {};

		    //console.log('count: ', count)

		    var d = new Date();
		    var LOOPS = 1000;

		    	for (var i = count - 1; i >= 0; i--) {
					obj[doc[i].artist+doc[i].album] = { 'artist': doc[i].artist, 'album': doc[i].album }
				};
			    for (var key in obj) {
			        arr.push( {
			        	"artist": obj[key].artist, 
			        	"album": obj[key].album 
			        } );
			    }
			    var arr_length = arr.length;

				resolve({ 
					cant: arr_length,
					albums:arr
				});
		});
    });
};

exports.artist = function( artist ){
	return new Promise(function(resolve, reject) {
		// Find all documents in the collection
		db.songs.find({artist:artist}, function (error, doc) {
			prepare.artist_OBJ(doc).then(function(data){

				// console.log('**************\n', data)
				// console.log('**************\n')

				prepare.artist_ARR(data).then(function(dta){
					resolve( dta );
			    },function(error){
			        reject(error);
			    });
		    },function(error){
		        reject(error);
		    });
		});
    });
}

exports.artistAlbum = function( artist, album ){
	return new Promise(function(resolve, reject) {
		// Find all documents in the collection
		db.songs.find({artist:artist, album:album}, function (error, doc) {
			prepare.artist_OBJ(doc).then(function(data){
				prepare.artist_ARR(data).then(function(dta){
					resolve( dta );
			    },function(error){
			        reject(error);
			    });
		    },function(error){
		        reject(error);
		    });
		});
    });
}

exports.artist_OBJ = function( artist ){
	return new Promise(function(resolve, reject) {
		// Find all documents in the collection
		db.songs.find({}, function (error, doc) {
			prepare.artist_OBJ(doc).then(function(data){
				prepare.artists_RESUME(data).then(function(dta){
					resolve( dta );
			    },function(error){
			        reject(error);
			    });
		    },function(error){
		        reject(error);
		    });
		});
    });
}

