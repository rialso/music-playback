
call.albums().then(function(response) {
  //console.log("Success!", response);

  albums( response );

}, function(error) {
  console.error("0032 artists Failed!", error);
});

function albums( $obj ){
  console.log("albums!", $obj);
 
        var albums = $obj;

  var elem = document.getElementById('albums-cover');
  utilsTPL.mr({ 
	ns:'pb', 
	tpl:tpl_albums_cover, 
	elem:elem,
	data:albums
  });
  
}