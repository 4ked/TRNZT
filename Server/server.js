var fs 				= require('fs-extra');
var http 			= require('http'); // http protocol 
var https 			= require('https'); // https protocol
var Mongo      		= require('mongodb').MongoClient;
var express 		= require('express'); // web server
var cookieParser 	= require('cookie-parser'); // parse cookies
var socketio 		= require('socket.io'); // websocket
var request 		= require('request'); // http trafficer
var bodyParser 		= require('body-parser'); // middleware

var Uber 			= require('node-uber'); // import uber api
var OAuth 			= require('oauth'); // oauth api
var Promise 		= require('bluebird');
var util 			= require('util');

var qs 				= require('qs'); // querystring parsing
var assert 			= require('assert');

var chai			= require('chai'); // Node assertion library
var nock			= require('nock'); // http isolated requests
var should 			= chai.should();

// web server
var app = express();
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

