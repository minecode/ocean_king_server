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

http.listen(port, 'https://skull-king-game.herokuapp.com/', function() {
	console.log('listening...');
});

// app.get('/api/v1/game', function(req, res, next) {
// 	res.locals.connection.query('SELECT * FROM public."Game"', function(
// 		error,
// 		results,
// 		fields
// 	) {
// 		if (error) {
// 			res.send(
// 				JSON.stringify({
// 					status: 500,
// 					error: error,
// 					response: null
// 				})
// 			);
// 			//If there is error, we send the error in the error section with 500 status
// 		} else {
// 			res.send(
// 				JSON.stringify({
// 					status: 200,
// 					error: null,
// 					response: results
// 				})
// 			);
// 			//If there is no error, all is good and response is 200OK.
// 		}
// 	});
// });

// app.post('/api/v1/player', function(req, res, next) {
// 	var email = req.param('email');
// 	var username = req.param('username');

// 	res.locals.connection.query(
// 		'INSERT INTO public."Player" (email, username) VALUES (\'{' +
// 			email +
// 			"}','{" +
// 			username +
// 			"}')",
// 		function(error, results, fields) {
// 			if (error) {
// 				res.send(
// 					JSON.stringify({
// 						status: 500,
// 						error: error,
// 						response: null
// 					})
// 				);
// 				//If there is error, we send the error in the error section with 500 status
// 			} else {
// 				res.send(
// 					JSON.stringify({
// 						status: 200,
// 						error: null,
// 						response: results
// 					})
// 				);
// 				//If there is no error, all is good and response is 200OK.
// 			}
// 		}
// 	);
// });

// app.post('/api/v1/game/:player', function(req, res, next) {
// 	res.locals.connection.query(
// 		'INSERT INTO public."Game" (status, created_by) VALUES ({"starting"}, ' +
// 			Integer(req.params.player) +
// 			')',
// 		function(error, results, fields) {
// 			if (error) {
// 				res.send(
// 					JSON.stringify({
// 						status: 500,
// 						error: error,
// 						response: null
// 					})
// 				);
// 				//If there is error, we send the error in the error section with 500 status
// 			} else {
// 				res.send(
// 					JSON.stringify({
// 						status: 200,
// 						error: null,
// 						response: results
// 					})
// 				);
// 				//If there is no error, all is good and response is 200OK.
// 			}
// 		}
// 	);
// });

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
