
<ul class="albums-container">
  {{#albums}}
  <li>
	<a href="/artist/{{artist}}/album/{{album}}">
	  <div class="item__cover">
		<img src="<!--{##covers}-->{{artist}} - {{album}}.jpg">
	  </div>
	  <div>
		<p class="album">{{album}}</p>
		<p class="artist">{{artist}}</p>
	  </div>
	 </a>
  </li>
  {{/albums}}
</ul>
