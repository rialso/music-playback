call.artists().then(function(response) {
  //console.log("Success!", response);

  artists( response );

}, function(error) {
  console.error("0032 artists Failed!", error);
});

function artists( $obj ){  
  	console.log('artist: ', $obj)
	var arts = $obj;
  
  

var elem = document.getElementById('content');
  utilsTPL.mr({ 
	ns:'pb', 
	tpl:tpl_artists_mini, 
	elem:elem,
	data:arts
  });
  
}