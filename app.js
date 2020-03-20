var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.set('io', io);

require('./controllers/authController')(app);
require('./controllers/gameController')(app);

http.listen(port, function() {
	console.log('listening on port ' + port);
});

io.on('connection', function(socket) {
	console.log(socket.id + ' connected');
	socket.on('disconnect', function() {
		console.log(socket.nickname + ' disconnected');
	});
	socket.on('forceDisconnect', function() {
		socket.disconnect();
	});
	socket.on('set nickname', function(msg) {
		console.log(socket.id + ' set nick name ' + msg);
		socket.nickname = msg;
	});
	socket.on('join room', function(room, user) {
		socket.to(room).emit('user join', user);
		socket.join(room);
		console.log(socket.nickname + ' join room ' + room);
	});
	socket.on('leave room', function(room, user) {
		socket.to(room).emit('user leave', user);
		socket.leave(room);
		console.log(socket.nickname + ' leave room ' + room);
	});
	socket.on('card played', function(room, card, user) {
		socket.to(room).emit('card played', card, user);
		console.log(
			socket.nickname + ' play the card ' + card.color + ' ' + card.value
		);
	});
});
