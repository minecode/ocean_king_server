const express = require('express');
const User = require('../models/User');
const router = express.Router();
const io = require('socket.io-client');
const crypto = require('crypto');

const getHashedPassword = password => {
	const sha256 = crypto.createHash('sha256');
	const hash = sha256.update(password).digest('base64');
	return hash;
};

router.post('/register', async (req, res) => {
	const { email } = req.body;
	try {
		if (await User.findOne({ email })) {
			return res.status(400).send({ error: 'User already exists' });
		}
		const user = await User.create(req.body);
		return res.send({ user });
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Registration failed' });
	}
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ name: username }).select('+password');
		const hash = getHashedPassword(password);
		if (user && user.password == hash) {
			return res.send({ user });
		}
		return res.status(401).send('Username or password incorrect');
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Authentication failed' });
	}
});

module.exports = app => app.use('/auth', router);
