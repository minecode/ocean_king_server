const mongoose = require('../database');

const FriendSchema = new mongoose.Schema({
	user_one: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	user_two: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Friend = mongoose.model('Friend', FriendSchema);

module.exports = Friend;
