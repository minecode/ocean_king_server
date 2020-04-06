const mongoose = require('../database');

const MessageSchema = new mongoose.Schema({
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game',
	},
	player: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	message: {
		type: String,
		required: true,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
