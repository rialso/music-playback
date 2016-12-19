


define(['utils', 'calls'], 
function(utils, calls) {
    'use strict';

    function init ( artist, album ){


        //var artist = 'Yusuf';
        //var album  = "Tell 'Em I'm Gone";

        var artist = 'Eilen Jewell';
        var album  = "Sundown Over Ghost Town";

        //http://localhost:3007/artist/Eilen%20Jewell/Sundown%20Over%20Ghost%20Town
        //http://localhost:3007/artist/Yusuf/Tell%20'Em%20I'm%20Gone

        artist_album ( artist, album )

    }



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




    function artist_album ( artist, album ){

        artist = decodeHTMLEntities( artist );
        album = decodeHTMLEntities( album )

        //console.log(artist +' | '+album)

        calls.artist_album( artist, album ).then(function(response) {
            //console.log("Success!", response);

            //printList_artists( response );

            /*
            sas_player({
                server: 'http://localhost:3005/api/music/',
                playlist : response
            });
            */

            var disc = response[0].albums[0].disc


            var playlist = [];

            for(var i=0;i<disc.length;i++){


                //console.log("Success!", disc[i]);

                var tracks = disc[i].tracks;

                for(var x=0;x<tracks.length;x++){


                    //console.log("Success!", tracks[x]);

                    playlist.push( tracks[x] );
                }
            }

            //console.log("Success!", playlist);


        var songList;

        songList = '<div id="songList" class="p-bg">';
        songList+=      '<div id="list_artists_content"></div>';
        songList+=      '<div id="list_albums_content"></div>'; 
        songList+=      '<div id="list_tracks_content"></div>'; 
        songList+= '</div>';

        document.getElementById('playlist').innerHTML = songList;



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
            trackList+=      '<div><span>'+playlist[i].track_number.no+'</span>'+playlist[i].title+'</div>';
            trackList+= '</li>' 
         
        }
        trackList += '</ul>';

        document.getElementById('list_artists_content').style.display = "none";
        document.getElementById('list_albums_content').style.display = "none";
        document.getElementById('list_tracks_content').innerHTML = trackList;



        var plist = document.querySelectorAll("#list_tracks > li")
        for(var i=0;i<plist.length;i++){

            plist[i].addEventListener('click', function(event) {
                event.preventDefault();

                var id = this.getAttribute('data-id')
                var ix = this.getAttribute('data-index')

                audio.pos = ix;

                //console.log( 'indexOf: ', ix)

                thisTrack()

            });
        }


        /////////////////////////////////////////////////////////////

    var audio = new Audio(), 
        duration; // Duration of audio clip


    //var audio = document.getElementById('audio'); // id for audio element
    // Makes playhead draggable 
    var clickEventType = (document.ontouchstart!==null) ? 'mousedown' : 'touchstart';
    
    var play = document.getElementById("playpausebtn");
    var next = document.getElementById("nextbtn");
    var prev = document.getElementById("prevbtn");

    var timeline = document.getElementById('timeline'); // timeline

    var curtimetext = document.getElementById("curtimetext");
    var durtimetext = document.getElementById("durtimetext");

    var volumeslider = document.getElementById("volumeslider");
    var mutebtn = document.getElementById("mutebtn");

    audio.pos = -1;

    play.addEventListener('click', playPause );
    next.addEventListener('click', nextTrack );
    prev.addEventListener('click', prevTrack );

    timeline.addEventListener(clickEventType, mouseDown, false);
    timeline.addEventListener('mouseup', mouseUp, false);
    //Makes timeline clickable
    timeline.addEventListener("click", setCurrenTime, false);

    audio.addEventListener("ended", nextTrack);
    audio.addEventListener('progress', progress);
    // timeupdate event listener
    audio.addEventListener("timeupdate", timeUpdate, false);
    // Gets audio file duration
    audio.addEventListener("canplaythrough", function () { duration = audio.duration; }, false);

    volumeslider.addEventListener("mousemove", setvolume);
    mutebtn.addEventListener("click", mute);


    // Boolean value so that mouse is moved on mouseUp only when the playhead is released 
    var onplayhead = false;
    // mouseDown EventListener
    function mouseDown() {
        onplayhead = true;
        audio.removeEventListener('timeupdate', timeUpdate, false);
    }
    // mouseUp EventListener
    // getting input from all mouse clicks
    function mouseUp(e) {
        console.log('mouseUp')
        if (onplayhead == true) {
            audio.addEventListener('timeupdate', timeUpdate, false);
        }
        onplayhead = false;
    }

    function setCurrenTime() {
        audio.currentTime = (duration * timeline.value) /10000;
    }

    // timeUpdate 
    // Synchronizes playhead position with current point in audio 
    function timeUpdate() {

        timeline.value = ((audio.currentTime / duration)*10000);

        if (audio.currentTime == duration) {
            play.className = "";
            play.className = "play";
        } 

        var curmins = Math.floor(audio.currentTime / 60);
        var cursecs = Math.floor(audio.currentTime - curmins * 60);
        var durmins = Math.floor(audio.duration / 60);
        var dursecs = Math.floor(audio.duration - durmins * 60);
        if(cursecs < 10){ cursecs = "0"+cursecs; }
        if(dursecs < 10){ dursecs = "0"+dursecs; }
        if(curmins < 10){ curmins = "0"+curmins; }
        if(durmins < 10){ durmins = "0"+durmins; }
        curtimetext.innerHTML = curmins+":"+cursecs;
        durtimetext.innerHTML = durmins+":"+dursecs;      
    }

    function progress() {
        var bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        var duration =  audio.duration;
        //console.log('duration: ', duration)
        if (duration > 0) {
        //document.getElementById('buffered-amount').style.width = ((bufferedEnd / duration)*100) + "%";

        //document.getElementById('seekBar').value = ((bufferedEnd / duration)*100);
        }  
    }

    function setvolume(){
        audio.volume = volumeslider.value / 100;
    }

    function mute(){
        if(audio.muted){
            audio.muted = false;
            //mutebtn.style.background = "url(images/speaker.png) no-repeat";
            mutebtn.classList.remove('speaker_muted'); 
            mutebtn.classList.add('speaker'); 
        } else {
            audio.muted = true;
            //mutebtn.style.background = "url(images/speaker_muted.png) no-repeat";
            mutebtn.classList.remove('speaker'); 
            mutebtn.classList.add('speaker_muted'); 
        }
    }




    function playPause(){
        if (audio.pos <= 0) {
            nextTrack();
        } else {
            if(audio.paused){
                audio.play();
                play.classList.remove('play'); 
                play.classList.add('pause');   
            } else {
                audio.pause();
                play.classList.remove('pause'); 
                play.classList.add('play'); 
            }
        }
    }

    function nextTrack(){
        if(audio.pos == (playlist.length - 1)){
            audio.pos = 0;
        } else {
            audio.pos++;   
        }
        setTrack()
        audio.play();
    }

    function prevTrack() {   
        if (audio.pos < 0) {
            audio.pos = playlist.length - 1;
        } else {
            audio.pos--;
        }
        setTrack();
        audio.play();
    }

    function setTrack(){

        audio.src = farm.r.server+'/music/'+playlist[audio.pos].id;

        //playlist_status.innerHTML = "Track "+(audio.pos)+" - "+ playlist[audio.pos].title;

        var x = document.getElementById('player-info');

        x.getElementsByTagName("h3")[0].innerHTML = playlist[audio.pos].artist;
        x.getElementsByTagName("p")[0].innerHTML  = playlist[audio.pos].album;
        x.getElementsByTagName("p")[1].innerHTML  = playlist[audio.pos].title;
    }

    function thisTrack() {

        setTrack();
        audio.play();
    }











/////////////////////////////////////

        }, function(error) {
            console.error("0032 lb.js get_lang Failed!", error);
        }); 



    }

    return {

        init            :init,
        artist_album    :artist_album
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










