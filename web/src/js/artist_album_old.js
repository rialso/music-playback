


define(['utils', 'call', 'AudioPlayer'], 
function(utils, call, AudioPlayer) {
    'use strict';

    function decodeHTMLEntities (str) {

        /*

            var element = document.createElement('div');

            if(str && typeof str === 'string') {
              // strip script/html tags
              str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
              str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
              element.innerHTML = str;
              str = element.textContent;
              element.textContent = '';
            }

            return str;
      */   

            str = str.replace(/%20/gmi, ' ');

            return str;
    }

    function init ( artist, album ){

        artist = decodeHTMLEntities( artist );
        album = decodeHTMLEntities( album )

        console.log('artist-album: ', artist +' | '+album)

        call.artist_album( artist, album ).then(function(response) {
            console.log("Success!", response);

            //printList_artists( response );

            /*
            sas_player({
                server: 'http://localhost:3005/api/music/',
                playlist : response
            });
            */

            var disk = response[0].albums[0].disck


            var playlist = [];

            for(var i=0;i<disk.length;i++){


                //console.log("Success!", disk[i]);

                var tracks = disk[i].tracks;

                for(var x=0;x<tracks.length;x++){


                    //console.log("Success!", tracks[x]);

                    playlist.push( tracks[x] );
                }
            }

            //console.log("Success!", playlist);

            var player;

            player =    '<div class="player">';

            player +=    '<button id="prevbtn" class="btn__prev">Prev</button>';
            player +=    '    <button id="playpausebtn" class="btn__play">Play/Pause</button>';
            player +=    '    <button id="nextbtn" class="btn__next">Next</button>';
                
            player +=    '    <div id="player-info" class="player-info">';
            player +=    '        <h3>&nbsp;</h3>';
            player +=    '        <p>&nbsp;</p>';
            player +=    '        <p>&nbsp;</p>';
            player +=    '    </div>';

            player +=    '    <div id="controls">';
               
            player +=    '        <div id="timebox">';
            player +=    '            <span id="curtimetext">00:00</span> / <span id="durtimetext">00:00</span>';
            player +=    '        </div>';

            player +=    '        <button id="mutebtn">mute</button>';
            player +=    '        <input id="volumeslider" type="range" min="0" max="100" value="100" step="1">';
            player +=    '    </div>';

            player +=    '    <input type="range" id="timeline" class="timeline" min="0" max="10000" value="0"> ';
            player +=    '</div>';
            player +=    '<div id="playlist" class="playlist"></div>';


            document.getElementById('farm-main').innerHTML = player;

/*
            var songList;

            songList = '<div id="songList" class="p-bg">';
            songList+=      '<div id="list_artists_content"></div>';
            songList+=      '<div id="list_albums_content"></div>'; 
            songList+=      '<div id="list_tracks_content"></div>'; 
            songList+= '</div>';

            document.getElementById('playlist').innerHTML = songList;
*/

            ///////////////////////////

            var trackList = '<div class="p-album">'
                trackList+=      '<a href="/artist/'+artist+'">'
                trackList+=         '<p>'+artist+'</p><p>'+album+'</p>'
                trackList+=      '</a>'
                trackList+= '</div>';

            trackList += '<ul id="list_tracks" class="p-bg">';

            //console.log('playlist: ', playlist)
            
            for(var i=0;i<playlist.length;i++){

                trackList+= '<li class="p-track" data-index="'+[i]+'" data-id="'+playlist[i].id+'">'
                trackList+=      '<div><span>'+playlist[i].track.no+'</span>'+playlist[i].title+'</div>';
                trackList+= '</li>' 
             
            }
            trackList += '</ul>';

            //document.getElementById('list_artists_content').style.display = "none";
            //document.getElementById('list_albums_content').style.display = "none";
            //document.getElementById('list_tracks_content').innerHTML = trackList;

            document.getElementById('playlist').innerHTML = trackList;

            

            var plist = document.querySelectorAll("#list_tracks > li")
            for(var i=0;i<plist.length;i++){

                plist[i].addEventListener('click', function(event) {
                    event.preventDefault();

                    var id = this.getAttribute('data-id')
                    var ix = this.getAttribute('data-index')

                    //audio.pos = ix;

                    AudioPlayer.pos( ix );

                    //console.log( 'indexOf: ', ix)

                    AudioPlayer.thisTrack();
                });
            }
            
            AudioPlayer.init();

            AudioPlayer.list( playlist );
            AudioPlayer.player_info();

          





        }, function(error) {
            console.error("0032 lb.js get_lang Failed!", error);
        }); 



    }

    return {

        init            :init
    }
});



/*
define([], 
function() {
    'use strict';

    function init() {

        document.getElementById('default').removeAttribute('farm-select');
        document.getElementById('home').setAttribute('farm-select', 'true');

        //farm_icons.viewbox('home-page', tpl_home_page);

        document.getElementById('home-page').innerHTML += tpl_home_page;

        farm_icons.viewbox('home-page', tpl_home_page);
  }

  return {

        init : init
    }
});
*/

/*
define(['jquery', 'mustache', 'prettify'], 
function($, Mustache, prettify) {
    'use strict';
        function init() {

        var page = 'home';
        var sec = document.getElementById('tpl-section').innerHTML;
        var output = Mustache.render(sec, {id:page});
        document.getElementById('farm-main').innerHTML += output;
	}
	return {

      	init : init
  	}
});
*/










