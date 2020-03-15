var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

app.use(function(req, res, next) {
	res.locals.connection = mysql.createConnection({
		host: 'ec2-46-137-84-173.eu-west-1.compute.amazonaws.com',
		user: 'tkcxyhjrizwgdk',
		password:
			'e84c2ab190448c3ed6d921cbc10bc5f9716cc94d3d5189b18715a7232f7ec115',
		database: 'dd00gbfng1pbu1'
	});
	res.locals.connection.connect();
	next();
});

app.get('/api/v1/game', function(req, res, next) {
	res.locals.connection.query('SELECT * FROM Game', function(
		error,
		results,
		fields
	) {
		if (error) {
			res.send(
				JSON.stringify({
					status: 500,
					error: error,
					response: null
				})
			);
			//If there is error, we send the error in the error section with 500 status
		} else {
			res.send(
				JSON.stringify({
					status: 200,
					error: null,
					response: results
				})
			);
			//If there is no error, all is good and response is 200OK.
		}
	});
});

app.post('/api/v1/player/:email/:name', function(req, res, next) {
	res.locals.connection.query(
		'INSERT INTO Player (email, username) VALUES (' +
			email +
			',' +
			name +
			')',
		function(error, results, fields) {
			if (error) {
				res.send(
					JSON.stringify({
						status: 500,
						error: error,
						response: null
					})
				);
				//If there is error, we send the error in the error section with 500 status
			} else {
				res.send(
					JSON.stringify({
						status: 200,
						error: null,
						response: results
					})
				);
				//If there is no error, all is good and response is 200OK.
			}
		}
	);
});

app.get('/api/v1/game', function(req, res, next) {
	res.locals.connection.query('SELECT * FROM Game', function(
		error,
		results,
		fields
	) {
		if (error) {
			res.send(
				JSON.stringify({
					status: 500,
					error: error,
					response: null
				})
			);
			//If there is error, we send the error in the error section with 500 status
		} else {
			res.send(
				JSON.stringify({
					status: 200,
					error: null,
					response: results
				})
			);
			//If there is no error, all is good and response is 200OK.
		}
	});
});

app.post('/api/v1/game/:player', function(req, res, next) {
	res.locals.connection.query(
		'INSERT INTO Game (status, created_by) VALUES ("starting", ' +
			player +
			')',
		function(error, results, fields) {
			if (error) {
				res.send(
					JSON.stringify({
						status: 500,
						error: error,
						response: null
					})
				);
				//If there is error, we send the error in the error section with 500 status
			} else {
				res.send(
					JSON.stringify({
						status: 200,
						error: null,
						response: results
					})
				);
				//If there is no error, all is good and response is 200OK.
			}
		}
	);
});

// io.on('connection', function(socket) {
// 	console.log('a user connected');
// 	socket.on('disconnect', function() {
// 		console.log('user disconnected');
// 	});
// 	socket.on('chat message', function(msg) {
// 		io.emit('chat message', msg);
// 	});
// });

http.listen(port, function() {
	console.log('listening...');
});
