<div class="player__wrap">
  
  	<div class="playing__art">
    	<img id="cover-art" src="../web/src/imgs/noCover.jpg" alt="Album Art">
  	</div>
  
  	<div class="data__info">
  
          <div id="player-info" class="player-info">
            <p> </p>
            <h3> </h3>
          </div>


       <input type="range" id="timeline" class="timeline" min="1" max="10000" step="1" value="0">
		<div class="track__actions">
          		<div class="current-track__op">
				</div>
                  <div class="current-track__actions">
                      <span id="prevbtn" class="btn__prev icon" farm-icon="#icon-previous">Prev</span>
                      <span id="playpausebtn" class="btn__play icon" farm-icon="#icon-play">Play</span>
                      <span id="nextbtn" class="btn__next icon" farm-icon="#icon-next">Next</span>
                  </div>


                 <div class="current-track__options">


                      <span id="sufflebtn" class="btn__suffle icon" farm-icon="#icon-suffle"></span>
                      <span id="repeatbtn" class="btn__repeat icon" farm-icon="#icon-loop"></span>
                      <span id="mutebtn" class="icon btn__volume" farm-icon="#icon-volume_medium"></span>
                      <span class="volumebox">
                            <!--<button id="mutebtn">mute</button>-->


                              <input id="volumeslider" orient="vertical" type="range" min="0" max="100" value="100" step="1"> 
                        </span>
                  </div>
 		</div>
	</div>
</div>