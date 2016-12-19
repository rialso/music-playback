<div class="player__wrap">
	<div class="current-track__info">
      <div class="playing__art">
        <img id="cover-art" src="../web/src/imgs/noCover.jpg" alt="Album Art">
      </div>
      <div id="player-info" class="player-info">
            <p> </p>
            <h3> </h3>
      </div>
  	</div>
  
     <div class="current-track__progress">
     		<span id="curtimetext" class="timebox">00:00</span>
     		<input type="range" id="timeline" class="timeline" min="1" max="10000" step="1" value="0">
     		<span id="durtimetext" class="timebox">00:00</span>
     <!--
           	<div class="timebox">            
        		<span id="curtimetext">00:00</span> / <span id="durtimetext">00:00</span>        
      		</div>
-->
   </div>

    <div class="current-track__actions">
      	<!-- 
      	<button id="prevbtn" class="btn__prev">Prev</button>    
		<button id="playpausebtn" class="btn__play">Play/Pause</button> 
		<button id="nextbtn" class="btn__next">Next</button> 
		-->
      	<span id="prevbtn" class="btn__prev icon" farm-icon="#icon-previous"></span>
      	<span id="playpausebtn" class="btn__play icon">
		  <span class="icon_play" farm-icon="#icon-play"></span>
		  <span class="icon_pause" farm-icon="#icon-pause"></span>
	  	</span>
      	<span id="nextbtn" class="btn__next icon" farm-icon="#icon-next"></span>
    </div>
  

  
   <div class="current-track__options">
          <span class="volumebox">
              <!--<button id="mutebtn">mute</button>-->
            	
              	<input id="volumeslider" orient="vertical" type="range" min="0" max="100" value="100" step="1"> 
          </span>
     	<span id="mutebtn" class="icon btn__volume" farm-icon="#icon-volume_medium"></span>
     	<span id="sufflebtn" class="btn__suffle icon" farm-icon="#icon-suffle"></span>
     	<span id="repeatbtn" class="btn__repeat icon" farm-icon="#icon-clockwise"></span>
    </div>
</div>

