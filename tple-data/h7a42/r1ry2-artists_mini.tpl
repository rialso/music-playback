<ul class="artists-container">
  {{#artists}}
  <li>
	<a href="/artist/{{artist}}">
	  <div>
		<img src="<!--{##covers}-->{{_COVER}}">
   	  </div>
	  <div>
		<p>{{artist}}</p>
	  </div>
  	</a>
  </li>
  {{/artists}}
</ul>
