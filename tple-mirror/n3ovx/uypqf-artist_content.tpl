<div class="artist is-verified"> 
      <div class="artist__content">
        <div class="tab-content">
          <!-- Overview -->
          <div role="tabpanel" class="tab-pane active" id="artist-overview">
            <div class="overview">
              <div class="overview__albums">
                <div class="overview__albums__head">
                  <span class="section-title">Albums</span>
                </div>
                
                {{#albums}}
                
                      <div class="album">
                        <div class="album__info">
                          <div class="album__info__art">

                            	<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/7022/whenDarkOut.jpg" alt="When It's Dark Out" />

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
                              <div class="tracks__heading__length">
                                <i class="ion-ios-stopwatch-outline"></i>
                              </div>
                              <div class="tracks__heading__popularity">
                                <i class="ion-thumbsup"></i>
                              </div>
                            </div>

                            <ul class="list_tracks">
                                {{#tracks}}
                                <li class="track" data-index="{{#idx}}{{/idx}}" data-id="{{id}}">
                                  <div class="track__number">{{track.no}}</div>
                                  <div class="track__added">
                                    <i class="ion-checkmark-round added"></i>
                                  </div>
                                  <div class="track__title featured">
                                    <span class="title">{{title}}</span>
                                    <!-- <span class="feature">Chris Brown</span><span class="feature">Tory Lanez</span> -->
                                  </div>
                                    <!-- <div class="track__explicit"><span class="label">Explicit</span></div> -->
                                  <div class="track__length">4:33</div>
                                  <div class="track__popularity">
                                    <i class="ion-arrow-graph-up-right"></i>
                                  </div>
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
        </div>
      </div>
    </div>