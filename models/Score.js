const mongoose = require('../database');

const ScoreSchema = new mongoose.Schema({
	player: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	wins: {
		type: Number,
		default: 0,
	},
	games: {
		type: Number,
		default: 0,
	},
	points: {
		type: Number,
		default: 0,
	},
	right_bets: {
		type: Number,
		default: 0,
	},
	right_bets_zero: {
		type: Number,
		default: 0,
	},
	max_score: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Score = mongoose.model('Score', ScoreSchema);

module.exports = Score;
