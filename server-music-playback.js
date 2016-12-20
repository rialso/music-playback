
"use strict";

// MODULES
// =================================================
var express = require('express');
var cors    = require('cors');
var app 	= express();

var config = require('./server/config');
var port = config.port;

// CONFIGURATION 
// ===========================================

//var host 	 = "127.0.0.1";
var port     = process.env.PORT || port;

// CORS-enabled for all origins!
app.use( cors() );

var path = require('path');

// log requests to the console (express4)
var morgan = require('morgan'); 
// log every request to the console
app.use(morgan('dev')); 


// ROUTES
// =============================================================================

// http://codereview.stackexchange.com/questions/51614/exporting-routes-in-node-js-express-4
var api = require('./server/routes/api');
// all of our routes will be prefixed with /api
app.use('/api', api);


//app.use(express.static(path.join(__dirname, '/web'), {redirect: false, index: true}));

app.use(express.static(path.join(__dirname, './')));

app.use('/cover',express.static(path.join(__dirname, './covers')));

app.get(/.*/, function(req, res){ 
	console.log('###########################################')
    //res.send(404);
    res.sendFile(path.join(__dirname, './web/index.html'));    
 });


// START THE SERVER
// =============================================================================

app.listen(port, function(){
     console.log('Express server listening on port ' + port + '.');
});



/*
app.use('/img',express.static(path.join(__dirname, 'public/images')));
app.use('/js',express.static(path.join(__dirname, 'public/javascripts')));
app.use('/css',express.static(path.join(__dirname, 'public/stylesheets')));
Static request example:

http://pruebaexpress.lite.c9.io/js/socket.io.js
I need a more simple solution. Does it exist?
*/



