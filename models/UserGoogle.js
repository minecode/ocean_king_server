const mongoose = require('../database');

const UserGoogleSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	photoUrl: {
		type: String
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const UserGoogle = mongoose.model('UserGoogle', UserGoogleSchema);

module.exports = UserGoogle;
