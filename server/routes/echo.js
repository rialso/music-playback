
/*
 * GET home page.
 */
//var time = require('../utils/date_time');

exports.list = function(req, res){
	/*
	res.render('echo', {
			title	:'Echo service', 
			time 	:time.now(), 
			ip 		:req.connection.remoteAddress
		});
	*/

	var now = function(){

	    var date = new Date();

	    var hour = date.getHours();
	    hour = (hour < 10 ? "0" : "") + hour;

	    var min  = date.getMinutes();
	    min = (min < 10 ? "0" : "") + min;

	    var sec  = date.getSeconds();
	    sec = (sec < 10 ? "0" : "") + sec;

	    var year = date.getFullYear();

	    var month = date.getMonth() + 1;
	    month = (month < 10 ? "0" : "") + month;

	    var day  = date.getDate();
	    day = (day < 10 ? "0" : "") + day;

	    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

	};

	res.send({
			title 	:'Echo service',
			//time 	:time.now(),
			time 	:now(),
			ip 		:req.connection.remoteAddress
		});

};




