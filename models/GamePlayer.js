const mongoose = require('../database');

const GamePlayerSchema = new mongoose.Schema({
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game'
	},
	player: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	order: {
		type: Number,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const GamePlayer = mongoose.model('GamePlayer', GamePlayerSchema);

module.exports = GamePlayer;
