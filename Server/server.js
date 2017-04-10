var http = require('http'); // http protocol 
var express = require('express'); // web server
var socketio = require('socket.io'); // websocket
var request = require('request'); // http trafficer

// web server
var app = express();
var server = http.Server(app);
var io = socketio(server);

// pass web server to client
app.use('/', express.static('../Client/'));

<<<<<<< HEAD
server.listen(3000, function(){
  	console.log('listening on *:3000');
});
=======
app.use('/', express.static('../Client/'));
>>>>>>> d4fa947264cb89ee8b0896337dd135c16471fba7

io.on('connection', function(socket){
  	socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
  	});
});
