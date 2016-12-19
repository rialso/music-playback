
define(['utils', 'utilsTPL'], 
function(utils, utilsTPL) {
    'use strict';



    function albums ( $obj ){

        //console.log('----------', $obj)

        //playerHTML();

        return new Promise(function(resolve, reject) {

            //var playlist = [];

            var albums = $obj;

            for(var i=0;i<albums.length;i++){
                //console.log( albums[i] )
                albums[i].songs = 0;
                albums[i]._COVER = farm.r.noCover;
                albums[i].tracks = [];
                var disc = albums[i].disc
                for(var x=0;x<disc.length;x++){
                    
                    var tracks = disc[x].tracks;
                    //console.log('tracks.length: ', tracks.length)
                    var cover = false;
                    for(var c=0;c<tracks.length;c++){
                        if(tracks[c].cover){
                            if(tracks[c].cover){
                            tracks[c]._COVER = farm.r.server+tracks[c].cover;
                            }else{
                                tracks[c]._COVER = farm.r.noCover;
                            }
                            if(!cover){
                                cover = true;
                                albums[i]._COVER = farm.r.server+tracks[c].cover;  //"http://localhost:3023/"
                            }
                            // pasar duration segundos a minutos segundos
                            var time = tracks[c].duration.seconds;
                            var minutes = Math.floor(time / 60);
                            var seconds = time - minutes * 60;
                            seconds = (seconds < 10 ? "0" : "") + seconds;
                            tracks[c].duration._TIME = minutes+':'+seconds;
                        }
                        // clone obj para no incluir _DATA_TRACK
                        var nobj = {};
                        var obj = tracks[c];
                        for(var o in obj) {
                            if( obj.hasOwnProperty(o) ) {
                                nobj[o]=obj[o];
                            }
                        }
                        tracks[c]._DATA_TRACK = JSON.stringify( nobj );
                        //console.log(tracks[c])

                        albums[i].songs++
                        //playlist.push( tracks[c] );

                        albums[i].tracks.push( tracks[c] )
                    }
                }  
            }

            var a = {
                albums:albums,
                //playlist:playlist
            }

            //console.log('----------albums ', albums)

            resolve( albums )
        });
 

    }

    return {

        albums            :albums
    }
});








