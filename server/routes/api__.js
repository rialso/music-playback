


var express 	= require('express');
var bodyParser 	= require('body-parser');

// used to create, sign, and verify tokens
var jwt     	= require('jsonwebtoken');
// get our config file
var config  	= require('../config');



	//,handle  = require('./main')
	// simple echo service (ip address, date/time)
var echo 	 = require('./echo');

	// database CRUD
	//var db_test = require('./database/db_test'); // create a new database

	// database CRUD
	var book = require('../controllers/book');

	var users = require('../models/users');

	//var inst_publicaciones = require('../models/inst_publicaciones');

	//app.set('superSecret', config.secret); // secret variable



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

	        //console.log(':::::::::::::::', req.body )

	        var u = req.body.username,
	        	p = req.body.password;

	        users.login( u, p ).then(function(resp){

	        	//console.log('@@ res:::: ',resp)
	        	//console.log('@@ res:::: ',resp.length)

	        	//// the array is defined and has at least one element
	        	//if(typeof resp !== 'undefined' && resp.length > 0){
	        	if(typeof(resp) !== 'undefined' && typeof(resp) == 'object'){
	        		var user  = resp[0];

					//console.log('user:::::: ',user)

					var token = jwt.sign(user, config.secret, {
					  	expiresIn: 86400 // expressed in seconds - expires in 24 hours
					});

					//console.log('token:::::: ', token)

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
	        			success :false,
	        			message :'Unauthorized - No authentication credentials provided or authentication failed'
	        		});
	        	}

		    },function(err){

		       	res.status(501).json({
			        status  :501,
			        success :false,
			        message :'User not found'
			    });
		    });

	        /*
	        var user = { 
			    username: 'man', 
			    password: 'pas',
			    admin: true 
			  };

	        //if (!user) {
	        if (user.username != req.body.username) {
		      	res.json({ success: false, message: 'Authentication failed. User not found.' });
		    } 
		    else {
				// check if password matches
				if (user.password != req.body.password) {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				}
				else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign(user, config.secret, {
					  	expiresIn: 86400 // expressed in seconds - expires in 24 hours
					});

					// return the information including token as JSON
					res.json({
					  	success: true,
					  	message: 'Enjoy your token!',
					  	token: token
					});
				}   
		    }
		    */
	    });


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

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, config.secret, function(err, decoded) {      
				if (err) {
					return res.status(401).json({ 
						status  :401,
						success :false,
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
			    success :false,
			    message :'Forbidden - Authenticated user does not have access. No token provided.' 
			});

		}

	});

	/////////////////////////



 // 	api.use(function(req, res, next) {
	//     // do logging
	//     //console.log('Something is happening.');
	//     console.log('api Time:', Date.now(), req.method, req.url );
	//     next(); // make sure we go to the next routes and don't stop here
	// });


	//////////////////////////

	api.get('/', function(req, res) {
	  	res.send('Welcome');
	});

	api.get('/echo', echo.list);


	// database stuff
	// ---------------------------------------------

	api.get('/token', function(req, res) {

		//console.log('@@@@req token: ',req)
		var user = req.decoded;

	  	return res.status(200).send({ 
		    status  :200,
		    success :true,
		    data    :{ 
		    	user 	:{  nombre 		: user.nombre,
						    apellido1	: user.apellido1,
						    apellido2 	: user.apellido2,
						    role 		: user.role
						}
			}
		});
	});

	
	//api.get('/book/:id', book.book_temes);

	//api.get ('/temes/:id',  	book.book_temes);
	//api.get ('/temes/:id',  	book.temes);
	api.get ('/blocks/:id', 	book.blocks_mapas);
	api.get ('/paginas/:id', 	book.paginas);
	api.get ('/mapa/:id', 		book.mapas);
	api.post('/mapa', 			book.mapas_INSERT);
	api.put ('/mapa', 			book.mapas_UPDATE);

	api.get ('/mapa/:id/log', 		book.mapas_log);
	api.post('/mapa/log', 			book.mapas_log_INSERT);


	api.get ('/book/:id/temes/blocks/:type', book.book_temes_blocks_type);
	
	//api.get ('/books/:type', 				 book.books_temes_blocks_type);

	//api.get ('/books/search/:search', 		 book.find_books_temes_blocks_type);    //book.books_search);
	api.get ('/books/:start/:limit/:type', 	 		book.books_temes_blocks_type);
	api.get ('/books/:search/:start/:limit/:type',  book.find_books_temes_blocks_type);

	api.get ('/sections', 				     book.sections);


    return api;
})();

/*

GET /users # list of users
GET /user/1 # get user with id 1
POST /user # create new user
PUT /user/1 # modify user with id 1
DELETE /user/1 # delete user with id 1


GET /tickets - Retrieves a list of tickets
GET /tickets/12 - Retrieves a specific ticket
POST /tickets - Creates a new ticket
PUT /tickets/12 - Updates ticket #12
PATCH /tickets/12 - Partially updates ticket #12
DELETE /tickets/12 - Deletes ticket #12

GET /tickets/12/messages - Retrieves list of messages for ticket #12
GET /tickets/12/messages/5 - Retrieves message #5 for ticket #12
POST /tickets/12/messages - Creates a new message in ticket #12
PUT /tickets/12/messages/5 - Updates message #5 for ticket #12
PATCH /tickets/12/messages/5 - Partially updates message #5 for ticket #12
DELETE /tickets/12/messages/5 - Deletes message #5 for ticket #12

*/

/*****

Success codes:

200 OK - Request succeeded. Response included
201 Created - Resource created. URL to new resource in Location header
204 No Content - Request succeeded, but no response body
Error codes:

400 Bad Request - Could not parse request
401 Unauthorized - No authentication credentials provided or authentication failed
403 Forbidden - Authenticated user does not have access
404 Not Found - Resource not found
415 Unsupported Media Type - POST/PUT/PATCH request occurred without a application/json content type
422 Unprocessable Entry - A request to modify or create a resource failed due to a validation error
429 Too Many Requests - Request rejected due to rate limiting

500, 501, 502, 503, etc - An internal server error occured



res.json({
  	status: 200,
  	message: 'Enjoy your token!',
  	token: token
});

****/


    /*

	api.get('/login', function(req, res) {
	  	res.send('Welcome login');
	});
	*/


	/*
	// datos de prueba
	api.get('/datos' 	 ,handle.findAll);
	api.get('/datos/:id' ,handle.findById);


	// database stuff
	//api.get( '/database/test', db_test.get);
	//api.post('/database/test', db_test.post);
	
	api.route('/database/test')
		.get( db_test.get )
		.post(function(req, res) {
			res.send('Add a book');
		})
		.put(function(req, res) {
			res.send('Update the book');
		});
	*/