var http = require('http'); // http protocol 
var express = require('express'); // web server
var socketio = require('socket.io'); // websocket
var request = require('request'); // http trafficer

// web server
var app = express();
var server = http.Server(app);
var io = socketio(server);

const path = require('path');

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/..', '/Client/index.html'));
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
    	console.log('message: ' + msg);
  	});
});

server.listen(3000, function(){
  	console.log('listening on *:3000');
});