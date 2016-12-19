
// http://techfunda.com/howto/499/custom-audio-player
// http://techfunda.com/Examples/Show/499

define([], 
function() {
    'use strict';

    var playlist = [];
    var location = '';
    var listDOM  = '';
    
    // Boolean value so that mouse is moved on mouseUp only when the playhead is released 
    var onplayhead = false;
    var audio = new Audio();
    var duration; // Duration of audio clip
    //var server = farm.r.server+'/music/';

    //var server = 'http://localhost:3023/api/track/';
    var server = farm.r.serverTracks;

    function init() {

        
        audio.pos = -1;



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


        play.addEventListener('click', playPause );
        next.addEventListener('click', nextTrack );
        prev.addEventListener('click', prevTrack );

        timeline.addEventListener(clickEventType, mouseDown, false);
        timeline.addEventListener('mouseup', mouseUp, false);
        //Makes timeline clickable
        timeline.addEventListener("click", setCurrenTime, false);

        audio.addEventListener("ended", nextTrack);
        //audio.addEventListener('progress', progress);
        // timeupdate event listener
        audio.addEventListener("timeupdate", timeUpdate, false);
        // Gets audio file duration
        audio.addEventListener("canplaythrough", function () { duration = audio.duration; }, false);

        volumeslider.addEventListener("mousemove", setvolume);
        mutebtn.addEventListener("click", mute);

        timeline.addEventListener('input',function () { progress_color( this ) },false);
    }


    function progress_color() {
        var max = timeline.getAttribute('max');
        var min = timeline.getAttribute('min');

        // rojo: #cc181e
        // verde: #1ed760

        var perc = timeline.value/100;
        var grad = 'linear-gradient(to right, #1ed760 0%, #1ed760 ' + perc + '%, #fff ' + perc + '%, #fff 100%)'
        timeline.style.background = grad;
    }

    // mouseDown EventListener
    function mouseDown() {
        onplayhead = true;
        audio.removeEventListener('timeupdate', timeUpdate, false);
    }
    // mouseUp EventListener
    // getting input from all mouse clicks
    function mouseUp(e) {
        //console.log('mouseUp')
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

        progress_color()

        var max = timeline.getAttribute('max');
        var min = timeline.getAttribute('min');

        timeline.value = ((audio.currentTime / duration)*max);

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


    // Verificar
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
        var mutebtn = document.getElementById("mutebtn");
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
        console.log('audio.pos ', audio.pos)

        var play    = document.getElementById("playpausebtn");
        if (audio.pos < 0) {
        //if (audio.pos <= 0) {
            nextTrack();
            play.classList.add('pause')
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
        //audio.play();
    }

    function prevTrack() {   
        if (audio.pos < 0) {
            audio.pos = playlist.length - 1;
        } else {
            audio.pos--;
        }
        setTrack();
        //audio.play();
    }

    function setTrack(){
        audio.src = server+playlist[audio.pos].id;
        playPause();
        player_info();

        //console.log(playlist)
        //playlist_status.innerHTML = "Track "+(audio.pos)+" - "+ playlist[audio.pos].title;
    }

    function thisTrack() {

        setTrack();
        //audio.play();
        playPause()
    }

    function pos(pos) {
        audio.pos = pos;
    }

    function player_info (){
        var track = playlist[audio.pos];

        //console.log('-----player_info---', track )

        if(playlist.length > 0){
            var x = document.getElementById('player-info');
            x.getElementsByTagName("h3")[0].innerHTML = track.title;
            x.getElementsByTagName("p")[0].innerHTML  = track.artist +' - '+track.album;
            document.getElementById('cover-art').setAttribute('src', track._COVER);

            //var tracks = document.querySelectorAll(".list_tracks > li");
            for(var i=0;i<listDOM.length;i++){
                listDOM[i].classList.remove('selected');
                if(listDOM[i].getAttribute('data-id')==track.id){
                    listDOM[i].classList.add('selected');
                }
            }
            // var trackCurrent = document.querySelector('[data-id="'+track.id+'"]');
            // if(trackCurrent){
            //     trackCurrent.classList.add('selected')
            // }

            // console.log('-----playlist---', playlist)
            // console.log('-----listDOM---', listDOM)
        }
    }


    window.addEventListener("click", function(e) {
        //alert('test');

        var x = e.target;
        //var closest = x.closest('[data-toggle="dropdown"]');
        var closest = x.closest('.list_tracks > li');
        //var closest = x.closest('.list_tracks');

        //console.log(closest)

        //if (x.matches('[data-toggle="dropdown"]')) {
        if (closest){
            console.log('-----closest------ ', closest)

            //console.log(window.location.pathname)

            var ix = closest.getAttribute('data-index');

            var loc = window.location.pathname;
            console.log(loc);
            console.log(location)
            if(location != loc){
                location = loc;
                console.log('----diferentes-----')
                playlist = [];

                listDOM = document.querySelectorAll(".list_tracks > li");
                for(var i=0;i<listDOM.length;i++){

                    var plt = listDOM[i];

                    var dt = plt.querySelector('.track__data > .track__data__info');
                    var dt_wrap = dt.getAttribute('data-track');
                    var dtrck = JSON.parse(dt_wrap);

                    //console.log(dtrck)

                    playlist.push( dtrck );
                } 
            }else{
                console.log('----iguales-----')
            }
            pos( ix );
            setTrack();

        }else{
            //clear();
        }
    })


    return {
        init            :init,
        // thisTrack       :thisTrack,
        // pos             :pos,
        //list            :list,
        //player_info     :player_info
    }
});




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

/*

    function progress_color() {
        var max = timeline.getAttribute('max');
        var min = timeline.getAttribute('min');

        //var gradValue = Math.round((timeline.value/max*1)*100);
        /---*
        var perc = ~~((timeline.value - min)/(max - min)*100);
        var grad = 'linear-gradient(90deg, #1ed760 ' + perc + '%, #fff ' + (perc+2) + '%)';
        timeline.style.background = grad;
        *---/

        //console.log( 'timeline.value ',timeline.value)
        //timeline.setAttribute('value', timeline.value);


        //var gradValue = Math.round((timeline.value/max*1)*100);
        // var perc = ~~((timeline.value - min)/(max - min)*100);
        // var grad = 'linear-gradient(90deg, #5082e0 ' + perc + '%, #cccccc ' + (perc+1) + '%)';
        // timeline.style.background = grad;


        // eliminar classe js del body
        // //var min = this.min || 0, max = this.max || 100, 
        // var perc = ~~((timeline.value - min)/(max - min)*100);
        // style_el.textContent = '.js input[type=range]::-webkit-slider-runnable-track{background-size:'+ perc +'% 100%}';


        // rojo: #cc181e
        // verde: #1ed760

        var perc = timeline.value/100;
        var grad = 'linear-gradient(to right, #1ed760 0%, #1ed760 ' + perc + '%, #fff ' + perc + '%, #fff 100%)'
        timeline.style.background = grad;
    }
*/










