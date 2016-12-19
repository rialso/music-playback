call.track().then(function(response) {
  //console.log("Success!", response);

  track( response );

}, function(error) {
  console.error("0032 artists Failed!", error);
});

function track( $obj ){
  
  console.log("track!", $obj);
  
  var playlist = [];
  playlist.push($obj);
  
  var audio = {};
  audio.pos = 0;
  
var elem = document.getElementById('current-track');
  utilsTPL.mr({ 
	ns:'pb', 
	tpl:tpl_player, 
	elem:elem,
	data:{track: $obj}
  });
  
          var x = document.getElementById('player-info');

        x.getElementsByTagName("h3")[0].innerHTML = playlist[audio.pos].title;
        x.getElementsByTagName("p")[0].innerHTML  = playlist[audio.pos].artist +' - '+playlist[audio.pos].album;
  
}
