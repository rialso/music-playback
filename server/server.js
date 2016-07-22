
"use strict";

// MODULES
// =================================================
var express = require('express');
var cors    = require('cors');
var app 	= express();

// CONFIGURATION 
// ===========================================

var host 	 = "127.0.0.1";
var port     = process.env.PORT || 3011;

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
var api = require('./routes/api');
// all of our routes will be prefixed with /api
app.use('/api', api);


//app.use(express.static(path.join(__dirname, '/web'), {redirect: false, index: true}));
//app.use(express.static(path.join(__dirname, '../')));
app.use(express.static(path.join(__dirname, '../web')));

app.get(/.*/, function(req, res){
	console.log('###########################################')
    //res.send(404);
    //res.sendFile(path.join(__dirname, '../index.html'));
    res.sendFile(path.join(__dirname, '../web/index.html'));
    
 });


// START THE SERVER
// =============================================================================

app.listen(port, function(){
     console.log('Express server listening on port ' + port + '.');
});





