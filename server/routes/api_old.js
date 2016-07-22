


var express 	= require('express');
var bodyParser 	= require('body-parser');
// used to create, sign, and verify tokens
var jwt     	= require('jsonwebtoken');
// get our config file
var config  	= require('../config');


var handle  = require('./main');
// simple echo service (ip address, date/time)
var echo 	= require('./echo'); 


var users = require('../models/users');



module.exports = (function() {
    'use strict';
    var api = express.Router();

    api.use(bodyParser.json()); // support json encoded bodies
	api.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
	
	api.route('/login')

	    // show the form (GET http://localhost:8080/login)
	    .get(function(req, res) {
	        res.send('this is the login form');
	    })

	    // process the form (POST http://localhost:8080/login)
	    .post(function(req, res) {
	        console.log('processing...');
	        //res.send('processing the login form!');

	        //console.log(':::::::::::::::', req );

	        console.log(':::::::::::::::', req.body )

	        var u = req.body.username,
	        	p = req.body.password;

	        //console.log('u - '+u+' | p - '+p)

	       	users.login( u, p ).then(function(resp){

	        	console.log('@@ res:::::::::::: ',resp);
	        	console.log('@@ res:: typeof :: ',typeof(resp));
	        	console.log('@@ res:: length :: ',Object.keys(resp).length );

	        	//// the array is defined and has at least one element
	        	if(typeof(resp) !== 'undefined' && typeof(resp) == 'object'){
	        		var user  = resp;

	        		console.log('user:::::: ',user)

					var token = jwt.sign(user, config.secret, {
					  	expiresIn: 86400 // expressed in seconds - expires in 24 hours
					});

					console.log('token:::::: ', token)

	       			//var token = '000000000';

					// return the information including token as JSON
					res.status(200).json({
						//success :true, //borrar
						status  :200,
					  	message :'Enjoy your token!',
					  	token   :token,
					  	user 	:{  nombre 		: user.nombre,
								    apellido1	: user.apellido1,
								    apellido2 	: user.apellido2,
								    role 		: user.role
								}
					});

	        	}else{

	        		res.status(401).json({ 
	        			status  :401,
	        			message :'Unauthorized - No authentication credentials provided or authentication failed'
	        		});
	        	}

		    },function(err){

	      		// res.status(err.status).json({
			    //     status: err.status,
			    //     message: err.message
			    // });

	      		res.status(501).json({
			        status: 501,
			        message: 'user not found'
			    });
		    });
	    })


	/////////////////////////

	api.use(function(req, res, next) {
    	/*
	    // do logging
	    //console.log('Something is happening.');
	    console.log('api Time:', Date.now(), req.method, req.url );
	    // log each request to the console
    	console.log(req.method, req.url);
    	// make sure we go to the next routes and don't stop here
    	// continue doing what we were doing and go to the route
	    next(); 
	    */
	    // check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		console.log('req headers ::::::::', req)

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, config.secret, function(err, decoded) {      
				if (err) {
					return res.status(401).json({ 
						status  :401, 
						message :'Unauthorized - Failed to authenticate token.' 
					});    
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;    
					next();
				}
			});

		} else {

			// if there is no token
			// return an error
			return res.status(403).send({ 
			    status  :403,
			    message :'Forbidden - Authenticated user does not have access. No token provided.' 
			});

		}

	});

 	// api.use(function(req, res, next) {
	//     // do logging
	//     //console.log('Something is happening.');
	//     console.log('api Time:', Date.now(), req.method, req.url );
	//     next(); // make sure we go to the next routes and don't stop here
	// });

	api.get('/', function(req, res) {
	  	res.send('Welcome');
	});

	api.get('/echo', echo.list);


	// api.get('/login', function(req, res) {
	// 	console.log('Welcome login');
	//   	res.send('Welcome login');
	// });

	// ---------------------------------------------

	api.get('/token', function(req, res) {

		console.log('@@@@req token: ',req)
		var user = req.decoded;

	  	return res.status(200).send({ 
		    status  :200,
		    message :'token verified.',
			user 	:{  nombre 		: user.nombre,
					    apellido1	: user.apellido1,
					    apellido2 	: user.apellido2,
					    role 		: user.role
					}
		});
	});

	// ---------------------------------------------

    return api;
})();