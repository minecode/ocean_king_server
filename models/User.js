const mongoose = require('../database');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const getHashedPassword = password => {
	const sha256 = crypto.createHash('sha256');
	const hash = sha256.update(password).digest('base64');
	return hash;
};

UserSchema.pre('save', async function(next) {
	this.password = getHashedPassword(this.password);

	next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
