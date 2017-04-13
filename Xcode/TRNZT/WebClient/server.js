var fs 				= require('fs-extra');
var http 			= require('http'); // http protocol
var https 			= require('https'); // https protocol
var Mongo      		= require('mongodb').MongoClient;
var express 		= require('express'); // web server
var cookieParser 	= require('cookie-parser'); // parse cookies
var socketio 		= require('socket.io'); // websocket
var request 		= require('request'); // http trafficer
var bodyParser 		= require('body-parser'); // middleware
// Helmet

// web server
var app = express();
app.use(cookieParser());
var server = http.Server(app);
var io = socketio(server);

app.use('/', express.static('../Client/'));

var options = {
key: fs.readFileSync('key.pem'),
cert: fs.readFileSync('cert.pem')
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

/*
 server.listen(3000, function(){
 console.log('listening on *:3000');
 });
 */

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

console.log('ready to serve');
