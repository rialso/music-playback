
call.artist().then(function(response) {
  //console.log("Success!", response);

  //artist( response );
  var albums = response.albums;
  prep.albums( albums ).then(function(response) {
  //console.log("Success! - prep.albums ", response);

  		artist( response );

  }, function(error) {
	console.error("0032 Failed! - call.artist", error);
  }); 


}, function(error) {
  console.error("0032 artists Failed!", error);
});

function artist( $obj ){
  	console.log('artist: ', $obj)
  
 	var albums = $obj;


  var elem = document.getElementById('content__middle');
  utilsTPL.mr({ 
	ns:'pb', 
	tpl:tpl_artist_content, 
	elem:elem,
	data:{albums: albums}
  });
  
  var trackCurrent = document.querySelector('[data-id="knHmtwlug0NcKOPQ"]');
  if(trackCurrent){
       trackCurrent.classList.add('selected')
  }

  
}