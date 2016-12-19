
/*
Devuelve un objeto

"Santana": {
      "artist": "Santana",
      "albums": {
			"Santana": {
		          "title": "Santana",
		          "disc": {
		            "0": {
		              "tracks": [
		                {
		                  "title": "You Just Don't Care",
		                  "artist": "Santana",
		                  "album": "Santana",
		                  .....
*/
exports.artist_OBJ = function( doc ){

	return new Promise(function(resolve, reject) {
		var count = doc.length, ca = {};
		for (var i = count - 1; i >= 0; i--) {

			// console.log('-----------------\n',doc[i])
			// console.log('-----------------')

			var AR = doc[i].artist; 
			var AB = doc[i].album; 
			var DN = doc[i].disc.no; 
            var TN = doc[i].track.no;

       //      var objData = {
		     //    'title': doc[i].title, 
    			// 'artist':doc[i].artist,
    			// 'album':doc[i].album,
    			// 'album_artist':doc[i].album_artist,
    			// 'track': doc[i].track,
    			// 'disc': doc[i].disc, 
    			// //'total_time': doc[i].Total_Time,
    			// 'genre':doc[i].genre,
    			// //'year':doc[i].year,
    			// //'location': doc[i].location,
    			// 'id': doc[i]._id
       //      }

       		doc[i].id = doc[i]._id
       		delete doc[i]._id;
       		delete doc[i].location;


       		var objData = doc[i];

            if (ca[AR] == undefined) {
			    ca[AR] = { 'artist': doc[i].artist, 'albums':{}}

				if (ca[AR].albums[AB] == undefined) {
			    	ca[AR].albums[AB] = { 'title': doc[i].album, 'disc':{}}

			    	if (ca[AR].albums[AB].disc[DN] == undefined){
	            		ca[AR].albums[AB].disc[DN] = { 'tracks': []}

	            		ca[AR].albums[AB].disc[DN].tracks.push(objData)
	            	}else{
	            		ca[AR].albums[AB].disc[DN].tracks.push(objData)
	            	}
	            }
	            else{

	            	if (ca[AR].albums[AB].disc[DN] == undefined){
	            		ca[AR].albums[AB].disc[DN] = { 'tracks': []}

	            		ca[AR].albums[AB].disc[DN].tracks.push(objData)
	            	}else{
	            		ca[AR].albums[AB].disc[DN].tracks.push(objData)
	            	}
	            }
	        }
	        else{

				if (ca[AR].albums[AB] == undefined) {
			    	ca[AR].albums[AB] = { 'title': doc[i].album, 'disc':{}}

			    	if (ca[AR].albums[AB].disc[DN] == undefined){
	            		ca[AR].albums[AB].disc[DN] = { 'tracks': []}

	            		ca[AR].albums[AB].disc[DN].tracks.push(objData)
	            	}else{
	            		ca[AR].albums[AB].disc[DN].tracks.push(objData)
	            	}
	            }
	            else{

	            	if (ca[AR].albums[AB].disc[DN] == undefined){
	            		ca[AR].albums[AB].disc[DN] = { 'tracks': []}

	            		ca[AR].albums[AB].disc[DN].tracks.push(objData)
	            	}else{
	            		ca[AR].albums[AB].disc[DN].tracks.push(objData)
	            	}
	            }
	        }
        }
        resolve( ca );
    });
}

exports.artist_ARR = function( doc ){

	return new Promise(function(resolve, reject) {
        var ca = doc, artist = [];
        for (var i in ca) {
            if (ca.hasOwnProperty(i)) {

            	var al = ca[i].albums,
            		albums = [],
            		total_albums = 0;
            		
            	for (var a in al) {
            		if (al.hasOwnProperty(a)) {

            			total_albums++;

            			//console.log('-------,',  al[a])

            			var dn = al[a].disc,
            				disc = [],
            				total_tracks = 0;
            		
            			for (var d in dn) {
	                		if (dn.hasOwnProperty(d)) {
	                			// para ordenar los tracks
	                			dn[d].tracks.sort(function(a, b) {
								    return parseFloat(a.track.no) - parseFloat(b.track.no);
								});
	                			disc.push(  {'tracks': dn[d].tracks })

	                			var tr = dn[d].tracks, yr ={};
	                			for (var t in tr) {
			                		if (tr.hasOwnProperty(t)) {
			                			total_tracks++;
			                			if(tr[t].year){
				                			yr[tr[t].year] = tr[t].year;
				                		}
			                		}
			                	}
	                			//console.log('-------,',  dn[d].tracks)
	                		}
	                	}
	                	if( Object.keys(yr).length == 1 ){
	                		var key = Object.keys(yr)[0];
	                		var year = yr[key];
	                		//console.log(year)  myObject[Object.keys(myObject)[0]]

	                	}else{

	                		//var year = undefined;
	                		var year = '';
	                	}
	                	//console.log( Object.keys(yr).length +' --- '+ year )

	                	albums.push({
	                		'title' : al[a].title,
	                		'total_tracks': total_tracks,
	                		'year' : year,
		            		'disc': disc 
		            	})
            		}	
            	}
            	artist.push({
					'title' : ca[i].artist,
					'total_albums': total_albums,
					'albums': albums
				});
            }
        }
        resolve( artist );
    });
}







// el que habia en prepare_artists
exports.artists_RESUME = function( doc ){

	return new Promise(function(resolve, reject) {
		var ca = doc, artist = [];
        for (var i in ca) {
            if (ca.hasOwnProperty(i)) {

            	var al = ca[i].albums,
            		albums = [],
            		total_albums = 0;
            		all_tracks = 0;
            		
            	for (var a in al) {
            		if (al.hasOwnProperty(a)) {

            			total_albums++;

            			//console.log('-------,',  al[a])
            	
            			var dn = al[a].disc,
            				disc = [],
            				total_tracks = 0;
            		
            			for (var d in dn) {
	                		if (dn.hasOwnProperty(d)) {
	                			// para ordenar los tracks
	       //          			dn[d].tracks.sort(function(a, b) {
								//     return parseFloat(a.track_number.no) - parseFloat(b.track_number.no);
								// });
	       //          			disk.push(  {'tracks': dn[d].tracks })

	                			var tr = dn[d].tracks, yr ={};
	                			for (var t in tr) {
			                		if (tr.hasOwnProperty(t)) {
			                			total_tracks++;
			                			all_tracks++;
			                			if(tr[t].year){
				                			yr[tr[t].year] = tr[t].year;
				                		}
			                		}
			                	}
	                			//console.log('-------,',  dn[d].tracks)
	                		}
	                	}
	                	if( Object.keys(yr).length == 1 ){
	                		var key = Object.keys(yr)[0];
	                		var year = yr[key];
	                		//console.log(year)  myObject[Object.keys(myObject)[0]]

	                	}else{

	                		//var year = undefined;
	                		var year = '';
	                	}
	                	//console.log( Object.keys(yr).length +' --- '+ year )
	                	/*
	                	albums.push({
	                		'title' : al[a].title,
	                		'total_tracks': total_tracks,
	                		'year' : year,
		            		//'disc': disc 
		            	})
						*/
            		}	
            	}
            	artist.push({
					'title' : ca[i].artist,
					'total_albums': total_albums,
					'total_tracks': all_tracks,
					//'albums': albums
				});
            }
        }
        resolve( artist );
    });
}




/*

exports.c_artist_2 = function( artist ){

	return new Promise(function(resolve, reject) {

		// Find all documents in the collection
		db.songs.find({Artist:artist}, function (err, doc) {

			var count = doc.length, albums = [], ca = {};

			for (var i = count - 1; i >= 0; i--) {

				if (ca [doc[i].Album] == undefined) {
			    	ca [doc[i].Album] = doc[i].Album;

			    	albums.push( {
			    		Name: doc[i].Album,
			    		Year: doc[i].Year
			    	} )
	            }
	        }
	        resolve( albums );
		});
    });
}

exports.c_artist_3 = function( artist ){

	return new Promise(function(resolve, reject) {

		// Find all documents in the collection
		db.songs.find({Artist:artist}, function (err, doc) {

			var count = doc.length, albums = [], ca = {};

			for (var i = count - 1; i >= 0; i--) {

				var current = doc[i].Album;

				if (ca [doc[i].Album] == undefined) {
			    	//ca [doc[i].Album] = doc[i].Album;
			    	ca [doc[i].Album] = { 'Artist': doc[i].Artist, 'Album': doc[i].Album, 'Songs':[]}
	            }
	            else{

	            	ca [doc[i].Album].Songs.push( { 
	            		'Name': doc[i].Name, 
	            		'Track_Number': doc[i].Track_Number,  
	            	} )
	            }
	        }
	        resolve( ca );
		});
    });
}

exports.c_artist_obj = function( artist ){

	return new Promise(function(resolve, reject) {

		// Find all documents in the collection
		db.songs.find({Artist:artist}, function (err, doc) {

			var count = doc.length, albums = [], ca = {};

			for (var i = count - 1; i >= 0; i--) {

				var AB = doc[i].Album; 
				var DN = doc[i].disk_Number.no; 
	            var TN = doc[i].Track_Number.no;


				if (ca[AB] == undefined) {
			    	ca[AB] = { 'Artist': doc[i].Artist, 'Album': doc[i].Album, 'disk':{}}

			    	console.log ('-----------', doc[i])

			    	if (ca[AB].disk[DN] == undefined){
	            		ca[AB].disk[DN] = { 'Track': {}}

	            		ca[AB].disk[DN].Track[TN] = { 'Name': doc[i].Name }
	            	}else{
	            		ca[AB].disk[DN].Track[TN] = { 'Name': doc[i].Name }
	            	}
	            }
	            else{
	            	if (ca[AB].disk[DN] == undefined){
	            		ca[AB].disk[DN] = { 'Track': {}}

	            		ca[AB].disk[DN].Track[TN] = { 'Name': doc[i].Name }
	            	}else{
	            		ca[AB].disk[DN].Track[TN] = { 'Name': doc[i].Name }
	            	}
	            }
	        }
	        resolve( ca );
		});
    });
}

exports.c_artist_pre = function( artist ){

	return new Promise(function(resolve, reject) {

		// Find all documents in the collection
		db.songs.find({Artist:artist}, function (err, doc) {

			var count = doc.length, albums = [], ca = {};

			for (var i = count - 1; i >= 0; i--) {

				var AB = doc[i].Album; 
				var DN = doc[i].disk_Number.no; 
	            var TN = doc[i].Track_Number.no;


				if (ca[AB] == undefined) {
			    	ca[AB] = { 'Artist': doc[i].Artist, 'Album': doc[i].Album, 'disk':{}}

			    	console.log ('-----------', doc[i])

			    	if (ca[AB].disk[DN] == undefined){
	            		ca[AB].disk[DN] = { 'Tracks': []}

	            		ca[AB].disk[DN].Track.push( { 'Name': doc[i].Name, 'Track_Number': doc[i].Track_Number } )
	            	}else{
	            		ca[AB].disk[DN].Track.push( { 'Name': doc[i].Name, 'Track_Number': doc[i].Track_Number } )
	            	}
	            }
	            else{
	            	if (ca[AB].disk[DN] == undefined){
	            		ca[AB].disk[DN] = { 'Tracks': []}

	            		ca[AB].disk[DN].Track.push( { 'Name': doc[i].Name, 'Track_Number': doc[i].Track_Number } )
	            	}else{
	            		ca[AB].disk[DN].Track.push( { 'Name': doc[i].Name, 'Track_Number': doc[i].Track_Number } )
	            	}
	            }
	        }
	        resolve( ca );
		});
    });
}

*/