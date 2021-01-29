var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add headers
app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	);

	// Request headers you wish to allow
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-Requested-With,content-type'
	);

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.set('io', io);

require('./controllers/authController')(app);
require('./controllers/gameController')(app);
require('./controllers/friendsController')(app);

http.listen(port, function () {
	console.log('listening on port ' + port);
});

io.on('connection', function (socket) {
	console.log(socket.id + ' connected');
	socket.on('disconnect', function () {
		console.log(socket.nickname + ' disconnected');
	});
	socket.on('forceDisconnect', function (room, user) {
		socket.to(room).emit('user leave', user);
		socket.leave(room);
		console.log(socket.nickname + ' leave room ' + room);
		socket.disconnect();
	});
	socket.on('set nickname', function (msg) {
		console.log(socket.id + ' set nick name ' + msg);
		socket.nickname = msg;
	});
	socket.on('join room', function (room, user) {
		socket.to(room).emit('user join', user);
		socket.join(room);
		console.log(socket.nickname + ' join room ' + room);
	});
	socket.on('leave room', function (room, user) {
		socket.to(room).emit('user leave', user.nickname);
		socket.leave(room);
		console.log(socket.nickname + ' leave room ' + room);
	});
	socket.on('card played', function (room, card, user) {
		socket.to(room).emit('card played', card, user);
		console.log(
			socket.nickname + ' play the card ' + card.color + ' ' + card.value
		);
	});
});
