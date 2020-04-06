const mongoose = require('../database');

const GameSchema = new mongoose.Schema({
	status: {
		type: String,
		required: true,
		default: 'in queue'
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
