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
	entry_plays: {
		type: Number,
		default: 0,
	},
	entry_wins: {
		type: Number,
		default: 0,
	},
	rb_at_1: {
		type: Number,
		default: 0,
	},
	rb_at_2: {
		type: Number,
		default: 0,
	},
	rb_at_3: {
		type: Number,
		default: 0,
	},
	rb_at_4: {
		type: Number,
		default: 0,
	},
	rb_at_5: {
		type: Number,
		default: 0,
	},
	rb_at_6: {
		type: Number,
		default: 0,
	},
	rb_at_7: {
		type: Number,
		default: 0,
	},
	rb_at_8: {
		type: Number,
		default: 0,
	},
	rb_at_9: {
		type: Number,
		default: 0,
	},
	rb_at_10: {
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
