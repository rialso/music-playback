


define(['utils', 'calls'], 
function(utils, calls) {
    'use strict';


    function init (){

        var artist = 'Yusuf';
        var album  = "Tell 'Em I'm Gone";

        var server = 'http://localhost:3005/api/music/';


        calls.artist_album( artist, album ).then(function(response) {
            console.log("Success!", response);

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

            console.log("Success!", playlist);


        /*
            playlist = obj.disc;

            var songList = '<ul id="list_tracks" class="p-bg">';
            
            for(var i=0;i<playlist.length;i++){

                var tracks = playlist[i].tracks

                console.log(tracks)

                for(var x=0;x<tracks.length;x++){

                    songList+= '<li class="p-list" data-index="'+[x]+'" data-id="'+tracks[x].id+'">'
                    songList+=      '<div><span>'+tracks[x].track_number.no+'</span>'+tracks[x].title+'</div>';
                    songList+= '</li>' 
                }
            }
            */




            //var section = document.querySelectorAll("body > section");

            //utils.mr({ ns:'pb', tpl:tpl_home, elem:section[0]});


        var seekslider, volumeslider, seeking=false, seekto, curtimetext, durtimetext, playlist_status, duration;
        
        // var dir = "audio/";
        // var playlist = ["Stoker","Skull_Fire","Scurvy_Pirate"];
        //var playlist_index = 0;
   

        // Set object references
        var prevbtn = document.getElementById("prevbtn");
        var playbtn = document.getElementById("playpausebtn");
        var nextbtn = document.getElementById("nextbtn");
        var mutebtn = document.getElementById("mutebtn");
        seekslider = document.getElementById("seekslider");
        volumeslider = document.getElementById("volumeslider");
        curtimetext = document.getElementById("curtimetext");
        durtimetext = document.getElementById("durtimetext");
        playlist_status = document.getElementById("playlist_status");

        var audio = new Audio();

        audio.pos = 0;
        /*
        // Audio Object
        audio = new Audio();
        //audio.src = dir+playlist[0];
        audio.src = server+playlist[0].id;
        audio.loop = false;
        audio.play();

        //playlist_status.innerHTML = "Track "+(playlist_index+1)+" - "+ playlist[playlist_index];
        playlist_status.innerHTML = "Track "+(playlist_index+1)+" - "+ playlist[playlist_index].title;
        */

        // Add Event Handling
        prevbtn.addEventListener("click", prevTrack);
        playbtn.addEventListener("click", playPause);
        nextbtn.addEventListener("click", nextTrack);
        mutebtn.addEventListener("click", mute);
        seekslider.addEventListener("mousedown", function(event){ seeking=true; seek(event); });
        seekslider.addEventListener("mousemove", function(event){ seek(event); });
        seekslider.addEventListener("mouseup",function(){ seeking=false; });
        volumeslider.addEventListener("mousemove", setvolume);
        audio.addEventListener("timeupdate", seektimeupdate);
        audio.addEventListener("ended", nextTrack);


            // Gets audio file duration
        audio.addEventListener("canplaythrough", function () { duration = audio.duration; }, false);
        // Functions
        function nextTrack(){
            if(audio.pos == (playlist.length - 1)){
                audio.pos = 0;
            } else {
                audio.pos++;   
            }

            setTrack()
            /*
            //playlist_status.innerHTML = "Track "+(playlist_index+1)+" - "+ playlist[playlist_index];
            playlist_status.innerHTML = "Track "+(playlist_index+1)+" - "+ playlist[playlist_index].title;
            //audio.src = dir+playlist[playlist_index];
            audio.src = server+playlist[playlist_index].id;
            */
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
            // Audio Object
            //audio = new Audio();
            //audio.src = dir+playlist[0];
            //audio.src = server+playlist[0].id;
            audio.src = server+playlist[audio.pos].id;
            //audio.loop = false;
            //audio.play();

            //playlist_status.innerHTML = "Track "+(playlist_index+1)+" - "+ playlist[playlist_index];
            playlist_status.innerHTML = "Track "+(audio.pos)+" - "+ playlist[audio.pos].title;
        }
        function playPause(){
            if (audio.pos <= 0) {
                nextTrack();
            } else {
                if(audio.paused){
                    audio.play();
                    //playbtn.style.background = "url(images/pause.png) no-repeat";
                    playbtn.classList.remove('play'); 
                    playbtn.classList.add('pause');   
                } else {
                    audio.pause();
                    //playbtn.style.background = "url(images/play.png) no-repeat";
                    playbtn.classList.remove('pause'); 
                    playbtn.classList.add('play'); 
                }
            }
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
        function seek(event){
            if(seeking){
                console.log('seek')
                /*
                seekslider.value = event.clientX - seekslider.offsetLeft;
                seekto = audio.duration * (seekslider.value / 100);
                audio.currentTime = seekto;
                */
                console.log( 'event.clientX: ', audio.currentTime)
                console.log( 'seekslider.offsetLeft: ', duration)

                seekslider.value = (audio.currentTime / duration)*100;

                audio.currentTime = (duration * seekslider.value) / 100;
            }
        }
        function setvolume(){
            audio.volume = volumeslider.value / 100;
        }
        function seektimeupdate(){

            //audio.currentTime = (duration * seekslider.value) / 100;

            //seekslider.value = ((audio.currentTime / duration)*100);
          
            var nt = audio.currentTime * (100 / audio.duration);
            seekslider.value = nt;




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







        }, function(error) {
            console.error("0032 lb.js get_lang Failed!", error);
        }); 



    }

    return {

        init : init
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










