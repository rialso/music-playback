
call.artist().then(function(response) {
  //console.log("Success!", response);

  artist( response );

}, function(error) {
  console.error("0032 artists Failed!", error);
});

function artist( $obj ){
  
  	var playlist = [];
  
	var albums = $obj.albums;

	for(var i=0;i<albums.length;i++){
	  albums[i].songs = 0;
	  albums[i].tracks = [];
	  var disc = albums[i].disc
	  for(var x=0;x<disc.length;x++){

		var tracks = disc[x].tracks;
		console.log('tracks.length: ', tracks.length)
		for(var c=0;c<tracks.length;c++){
		  albums[i].songs++
		  playlist.push( tracks[c] );

		  albums[i].tracks.push( tracks[c] )
		}
	  }

	}



  var elem = document.getElementById('content__middle');
  utilsTPL.mr({ 
	ns:'pb', 
	tpl:tpl_artist_content, 
	elem:elem,
	data:{albums: albums}
  });

  
}