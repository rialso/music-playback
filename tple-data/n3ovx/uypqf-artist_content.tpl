<div class="artist-content"> 


          <!-- Overview -->

            <div class="overview">
              <div class="overview__albums">
                <div class="overview__albums__head">
                  <span class="section-title">Albums</span>
                </div>
                
                {{#albums}}
                
                      <div class="album">
                        <div class="album__info">
                          <div class="album__info__art">

								<img src="<!--{##covers}-->{{_COVER}}">

                          </div>
                          <div class="album__info__meta">
                            <div class="album__year">2015</div>
                            <div class="album__name">{{title}}</div>
                          </div>
                        </div>

                        <div class="album__tracks">
                          <div class="tracks">
                            <div class="tracks__heading">
                              <div class="tracks__heading__number">#</div>
                              <div class="tracks__heading__title">Song</div>
                              
                            </div>

                            <ul class="list_tracks">
                                {{#tracks}}
                                <li class="track" data-index="{{#idx}}{{/idx}}" data-id="{{id}}">
								  <span class="track__data">
										<span class="track__data__info" data-track="{{_DATA_TRACK}}"></span>
								  </span>
                                  <div class="track__number">{{track.no}}</div>
                                  <div class="track__selected">
                                     <span class="icon" farm-icon="#icon-volume_medium"></span>
                                  </div>
                                  <div class="track__title featured">
                                    <span class="title">{{title}}</span>
                                  </div>
                                  <div class="track__length">{{duration._TIME}}</div>
                                </li>
                                {{/tracks}}
                             </ul>
                          </div>
                  		</div>
                	</div>
                {{/albums}}
              </div>
            </div>
        
 
 
    </div>