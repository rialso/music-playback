//http://codepen.io/jonomcleish/pen/rDIsJ?editors=0100

var timeline = document.getElementById('timeline');

timeline.addEventListener('input',function () { progress_color( this ) },false);
	
function progress_color() {
	var max = timeline.getAttribute('max');
	var min = timeline.getAttribute('min');

	//var gradValue = Math.round((timeline.value/max*1)*100);
  
	//var perc = ~~((timeline.value - min)/(max - min)*100);
	//var grad = 'linear-gradient(90deg, #1ed760 ' + perc + '%, #fff ' + (perc+2) + '%)';
  
  // rojo: #cc181e
  // verde: #1ed760
  
  	var perc = timeline.value/100;
	var grad = 'linear-gradient(to right, #1ed760 0%, #1ed760 ' + perc + '%, #fff ' + perc + '%, #fff 100%)'
	timeline.style.background = grad;
}