const express = require('express');
const User = require('../models/User');
const Notifications = require('../models/Notifications');
const router = express.Router();
const io = require('socket.io-client');
const crypto = require('crypto');

const getHashedPassword = (password) => {
	const sha256 = crypto.createHash('sha256');
	const hash = sha256.update(password).digest('base64');
	return hash;
};

router.post('/pn', async (req, res) => {
	const { user, token } = req.body;

	try {
		let temp_user = await Notifications.findOne({ user: user });
		if (temp_user === null) {
			temp_user = await Notifications.create({
				user: user,
				token: token,
			});
			return res.send({ temp_user });
		} else {
			temp_user = await Notifications.findOneAndUpdate(
				{ user: user },
				{ token: token },
				{ new: true, useFindAndModify: false }
			);
			return res.send({ temp_user });
		}
	} catch (err) {
		// console.log(err);
		return res.status(400).send({ error: 'Error pn 1' });
	}
});

router.get('/user', async (req, res) => {
	const { user } = req.query;
	try {
		let temp_user = await User.findOne({ _id: user });
		if (temp_user) {
			return res.send({ temp_user });
		}
		return res
			.status(400)
			.send({ error: 'Cannot get current user: error code 1' });
	} catch (err) {
		return res
			.status(400)
			.send({ error: 'Cannot get current user: error code 2' });
	}
});

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

router.post('/googleLogin', async (req, res) => {
	const { user } = req.body;
	try {
		let dataBase_user = await User.findOne({ email: user.email });
		if (dataBase_user) {
			if (String(dataBase_user.photo) === 'avatar') {
				if (user.photoUrl) {
					dataBase_user = await User.findOneAndUpdate(
						{ email: user.email },
						{ photo: user.photoUrl },
						{ new: true, useFindAndModify: false }
					);
				} else if (user.imageURL) {
					dataBase_user = await User.findOneAndUpdate(
						{ email: user.email },
						{ photo: user.imageURL },
						{ new: true, useFindAndModify: false }
					);
				}
			}
			return res.send({ dataBase_user });
		} else {
			if (user.displayName) {
				const new_user = await User.create({
					name: user.displayName,
					email: user.email,
				});
				return res.send({ new_user });
			}
			if (user.name) {
				const new_user = await User.create({
					name: user.name,
					email: user.email,
				});
				return res.send({ new_user });
			}
			return res.status(400).send({ error: 'Authentication failed' });
		}
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Authentication failed' });
	}
});

module.exports = (app) => app.use('/auth', router);
