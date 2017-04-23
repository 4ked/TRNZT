// 	Storage for ALL uber API requests

var express 		= require('express'); // web server
var fs 				= require('fs-extra');
var geocoder		= require('geocoder'); // coordinate geocoder
var request 		= require('request'); // http trafficer
var Uber 			= require('node-uber'); // import uber api
var OAuth 			= require('oauth'); // oauth api
var Promise 		= require('bluebird');
var util 			= require('util');

var qs 				= require('qs'); // querystring parsing
var assert 			= require('assert');

var chai			= require('chai'); // Node assertion library
var nock			= require('nock'); // http isolated requests
var should 			= chai.should();


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

//	Authenticate uber login with scopes
app.get('/api/login', function(request, response) {
  	var url = uber.getAuthorizeUrl(['profile', 'request', 'places', 'all_trips', 'ride_widgets']);
  	response.redirect(url);
});

//	Redirect script to authorize uber profile with oAuth 2.0
app.get('/api/callback', function(request, response) {
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
app.get('/api/products', function(request, response) {
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
app.get('/api/estimates', function(request, response) {
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
	uber.estimates.getETAForLocationAsync(end_latitude, end_longitude)
	.then(function(res) {
		response.json(res); 
	})
	.error(function(err) {
		console.error(err);
	});
});

//	Get profile information on user that authorized app
app.get('/api/me', function(request, response) {
	uber.user.getProfileAsync()
	.then(function(res) { 
		log(res); 
	})
	.error(function(err) { 
		console.error(err); 
	});
});

//	Request a ride on behalf of an uber user
app.get('/api/requests', function(request, response) {
	// extract the query from the request URL
  	var query = url.parse(request.url, true).query;
	
	uber.requests.createAsync({
  		"product_id": "product_id",
  		"start_latitude": query.lat,
  		"start_longitude": query.lng,
  		"end_latitude": end_latitude,
  		"end_longitude": end_longitude
	})
	.then(function(res) { 
		log(res); 
		uber.requests.getCurrentAsync()
		.then(function(res) { 
			log(res); 
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
app.get('/api/places', function(request, response) {
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
*****	Exports
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