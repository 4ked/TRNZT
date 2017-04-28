var fs 				= require('fs-extra');
var http 			= require('http'); // http protocol 
var https 			= require('https'); // https protocol
var Mongo      		= require('mongodb').MongoClient;
var express 		= require('express'); // web server
var expressValidator = require('express-validator');
var cookieParser 	= require('cookie-parser'); // parse cookies
var socketio 		= require('socket.io'); // websocket
var request 		= require('request'); // http trafficer
var bodyParser 		= require('body-parser'); // middleware

var Uber 			= require('node-uber'); // import uber api
var OAuth 			= require('oauth'); // oauth api
var Promise 		= require('bluebird');
var util 			= require('util');
var geocoder		= require('geocoder');

var qs 				= require('qs'); // querystring parsing
var assert 			= require('assert');

var chai			= require('chai'); // Node assertion library
var nock			= require('nock'); // http isolated requests
var should 			= chai.should();

// web server
var app = express();
var route = express.Router(); // add support for express routing
app.use(cookieParser());

var server = http.Server(app);
var io = socketio(server);

// static file serving
app.use('/', express.static('../Client/'));

var credentials = {
    key:  fs.readFileSync('bin/key.pem'),
    cert: fs.readFileSync('bin/cert.pem')
};

// body parsing ensures req.body property
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// error handling middleware
var errorHandler = function(err, req, res, next) {
    if(err.status) {
        res.status(err.status);
    } else {
        res.status(500);
    }
    res.render('error', { error : err });
    next(err);
};

app.use(errorHandler);

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
    	console.log('message: ' + msg);
  	});
});

// logger that prevents circular object reference in javascript
var log = function(msg, obj) {
    console.log('\n');
    if(obj) {
        try {
            console.log(msg + JSON.stringify(obj));
        } catch(err) {
            var simpleObject = {};
            for (var prop in obj ){
                if (!obj.hasOwnProperty(prop)){
                    continue;
                }
                if (typeof(obj[prop]) == 'object'){
                    continue;
                }
                if (typeof(obj[prop]) == 'function'){
                    continue;
                }
                simpleObject[prop] = obj[prop];
            }
            console.log('circular-' + msg + JSON.stringify(simpleObject)); // returns cleaned up JSON
        }        
    } else {
        console.log(msg);
    }
};

// secure web server
https.createServer(credentials, app).listen(3000);

// only redirect the home page. 403 forbid all others
http.createServer(function(req, res) {
    log('catch a redirect from ' + req.headers.host + ' (is HSTS working?)');
    log('redirect req = ', req);
    log('redirect res = ', res);
    if (req.headers.host + req.url === DOMAIN + '/') {
        res.writeHead(301, { 'Location' : 'https://' + req.headers.host + req.url });
        res.end();
    } else {
        res.writeHead(403);
        res.end();
    }
}).listen(8080);

log('TRNZT running on local.info');


var key = {
  	"client_id": "LJGpana69PX47lPLFP5PpIdySYT5CT-G",
  	"client_secret": "mgtzL4Ok7Ibyfb4ecvO-PpQhQJbgTLF3SC_vS8RN",
  	"server_token": "Drp9ApEpmWdRKUIsf3CS3RGCmvo-tTDRGzYV6BDv",
  	"redirect_uri": "https://local.info:3000",
  	"name": "TRNZT",
  	"language": "en_US", // optional, defaults to en_US
};

var uber = new Uber(key);

// uber instance for Sandbox mode
key.sandbox = true;
var uber_sandbox = new Uber(key);

// JSON path for reply files
jsonReplyPath = function(filename) {
    return path.join(__dirname, '/replies/' + filename + '.json');
}

// Load JSON file from replies folder for assertions
jsonReply = function(path) {
    return JSON.parse(fs.readFileSync(this.jsonReplyPath(path), 'utf8'));
}

/************************************
*****
*****	Uber API Requests
*****
************************************/

var rPA = 'a1111c8c-c720-46c3-8534-2fcdd730040d';

//	Authenticate uber login with scopes
app.get('/v1.2/login', function(request, response) {
  	var url = uber.getAuthorizeUrl(['profile', 'request', 'places', 'all_trips', 'ride_widgets']);
  	response.redirect(url);
	log(url);
	// User can manually go to authorization @ https://login.uber.com/oauth/v2/authorize?client_id=LJGpana69PX47lPLFP5PpIdySYT5CT-G&response_type=code
});

//	Redirect script to authorize uber profile with oAuth 2.0
app.get('/v1.2/callback', function(request, response) {
   	uber.authorizationAsync( {
		authorization_code: request.query.code
	})
   	.spread(function(access_token, refresh_token, authorizedScopes, tokenExpiration) {
   	  	// store the user id and associated access_token, refresh_token, scopes and token expiration date
   	  	log('New access_token retrieved: ' + access_token);
   	  	log('... token allows access to scopes: ' + authorizedScopes);
   	  	log('... token is valid until: ' + tokenExpiration);
   	  	log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);
		
		var query = url.parse(request.url, true).query;
		return uber.products.getAllForLocationAsync(query.lat, query.lng);
   	})
	.then(function(res) {
		log(res);
		// redirect the user back to your actual app
   	  	response.redirect('../Client/index.html');
	})
   	.error(function(err) {
   	  	console.error(err);
   	});
});

//	Display uber products available at current given location
app.get('/v1/products', function(request, response) {
  	// extract the query from the request URL
  	var query = url.parse(request.url, true).query;
	
  	// if no query params sent, respond with Bad Request
  	if (!query || !query.lat || !query.lng) {
  	  	response.sendStatus(400);
  	} else {
  	  	uber.products.getAllForLocationAsync(query.lat, query.lng)
  	  	.then(function(res) {
  	  	    response.json(res);
  	  	})
  	  	.error(function(err) {
  	  	  console.error(err);
  	  	  response.sendStatus(500);
  	  	});
  	}
});

// 	Get an upfront fare before requesting a ride
app.get('/v1.2/estimates/price', function(request, response) {
  	// extract the query from the request URL
  	var query = url.parse(request.url, true).query;
	
  	// if no query params sent, respond with Bad Request
  	if (!query || !query.lat || !query.lng) {
  	  response.sendStatus(400);
  	} else { 
		  uber.estimates.getPriceForRouteAsync(query.lat, query.lng, end_latitude, end_longitude)
		  .then(function(res) {
			  response.json(res);
		  })
		  .error(function(err) {
			  console.error(err);
		  });
  	}
});

app.get('/v1.2/estimates/time', function(request, response) {
	// extract the query from the request URL
  	var query = url.parse(request.url, true).query;
	
  	// if no query params sent, respond with Bad Request
  	if (!query || !query.lat || !query.lng) {
  	  response.sendStatus(400);
  	} else { 
		  uber.estimates.getETAForLocationAsync(end_latitude, end_longitude)
		.then(function(res) {
		response.json(res); 
		})
		.error(function(err) {
		console.error(err);
		});
  	}
});

//	Get profile information on user that authorized app
app.get('/v1.2/me', function(request, response) {
	uber.user.getProfileAsync()
	.then(function(res) { 
		log(res); 
	})
	.error(function(err) { 
		console.error(err); 
	});
});

//	Request a ride on behalf of an uber user
app.post('/v1.2/requests', function(request, response) {
	// extract the query from the request URL
  	//var query = url.parse(request.url, true).query;
	
	uber.requests.createAsync({
		"fare_id": j,
  		"start_latitude": request.query.lat,
  		"start_longitude": request.query.lng,
  		"end_latitude": request.query.goalat,
  		"end_longitude": request.query.goalng
	})
	.then(function(res) { 
		log(res); 
		uber.requests.getCurrentAsync()
		.then(function(res) { 
			log(res); 
			res.send('got it');
		})
		.error(function(err) { 
			console.error(err); 
		});
	})
	.error(function(err) { 
		console.error(err); 
	});
	
});

//	Retrieve home and work address from user profile
app.get('/v1.2/places/{place_id}', function(request, response) {
	uber.places.getHomeAsync()
	.then(function(res) { 
		log(res); 
	})
	.error(function(err) { 
		console.error(err); 
	});
	
	uber.places.getWorkAsync()
	.then(function(res) { 
		log(res); 
	})
	.error(function(err) { 
		console.error(err); 
	});
});

/**********	 Posts	****************/

// Login token Create
app.post('https://local.info/:oauth/v2/:token', function(data) {
	
});

// Ride Request Create
app.post('https://local.info/v1.2/:requests', function(data) {
	
});

/************************************
*****
*****	Exports for uber
*****
************************************/

exports.chai = chai;
exports.nock = nock;
exports.request = request;
exports.should = should;
exports.qs = qs;
exports.uber = uber;
exports.uber_sandbox = uber_sandbox;
exports.key = key;
exports.jsonReplyPath = jsonReplyPath;
exports.jsonReply = jsonReply;



