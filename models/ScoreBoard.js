const mongoose = require('../database');

const ScoreBoardSchema = new mongoose.Schema({
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game'
	},
	player: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	points: {
		type: Number,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const ScoreBoard = mongoose.model('ScoreBoard', ScoreBoardSchema);

module.exports = ScoreBoard;
