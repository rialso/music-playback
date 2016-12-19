
define(['utils', 'utilsTPL', 'call', 'prep'], 
function(utils, utilsTPL, call, prep) {
    'use strict';

    function init (params){

        var ar = utils.decodeHTMLEntities( params.artist );

        call.artist( ar ).then(function(response) {
            //console.log("Success! - call.artist", response);

            //artist( response.data );

            var albums = response.data[0].albums;

            prep.albums( albums ).then(function(response) {
            //console.log("Success! - prep.albums ", response);

                artist( response );

            }, function(error) {
                console.error("0032 Failed! - call.artist", error);
            }); 



        }, function(error) {
            console.error("0032 Failed! - call.artist", error);
        }); 
    }

    function artist ( $data ){

        console.log('----------', $data)

        var albums = $data;


        //var playlist = $data.playlist;

        //playerHTML();

        // var playlist = [];

        // var albums = $obj[0].albums;

        // for(var i=0;i<albums.length;i++){
        //     console.log( albums[i] )
        //     albums[i].songs = 0;
        //     albums[i]._COVER = farm.r.noCover;
        //     albums[i].tracks = [];
        //     var disc = albums[i].disc
        //     for(var x=0;x<disc.length;x++){
                
        //         var tracks = disc[x].tracks;
        //         console.log('tracks.length: ', tracks.length)
        //         var cover = false;
        //         for(var c=0;c<tracks.length;c++){
        //             if(tracks[c].cover){
        //                 if(tracks[c].cover){
        //                 tracks[c]._COVER = farm.r.server+tracks[c].cover;
        //                 }else{
        //                     tracks[c]._COVER = farm.r.noCover;
        //                 }
        //                 if(!cover){
        //                     cover = true;
        //                     albums[i]._COVER = farm.r.server+tracks[c].cover;  //"http://localhost:3023/"
        //                 }
        //             }
        //             albums[i].songs++
        //             playlist.push( tracks[c] );

        //             albums[i].tracks.push( tracks[c] )
        //         }
        //     }  
        // }

        //console.log('----------albums ', albums)

        var elem = document.getElementById('content__main');
        utilsTPL.mr({ 
            ns:'pb', 
            tpl:tpl_artist_content, 
            elem:elem,
            data:{albums: albums}
        });




        // var elem_page = document.getElementById("header");
        // utilsTPL.mr({ 
        //     ns:'mlm', 
        //     tpl:tpl_player, 
        //     elem:elem_page 
        // });


        // var plist = document.querySelectorAll(".list_tracks > li")
        // for(var i=0;i<plist.length;i++){

        //     plist[i].addEventListener('click', function(event) {
        //         event.preventDefault();

        //         //console.log('---------- this list_tracks', this)

        //         var id = this.getAttribute('data-id')
        //         var ix = this.getAttribute('data-index')

        //         //audio.pos = ix;

        //         AudioPlayer.pos( ix );

        //         //console.log( 'indexOf: ', ix)

        //         AudioPlayer.thisTrack();
        //     });
        // }

        // AudioPlayer.init();

        // AudioPlayer.list( playlist );
        // AudioPlayer.player_info();




            // document.querySelector('input[type=range]').addEventListener('input', function() {
            //   this.setAttribute('value', this.value);
            // }, false);



// if (!!window.EventSource) {
//   var source = new EventSource('/metadata-load-data') //'http://localhost:3023/metadata-load-data'

//   source.addEventListener('message', function(e) {
//     console.log("Connection message", e.data)
//   }, false)

//   source.addEventListener('open', function(e) {
//     console.log("Connection was opened")
//   }, false)

//   source.addEventListener('error', function(e) {
//     if (e.readyState == EventSource.CLOSED) {
//       console.log("Connection was closed")
//     }
//     else if (e.target.readyState == EventSource.CONNECTING) {
//       console.log("Connecting...")
//     }
//   }, false)
// } else {
//     console.log("Your browser doesn't support SSE")
// }


    }

    return {

        init            :init
    }
});








