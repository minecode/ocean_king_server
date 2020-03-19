const mongoose = require('../database');

const BetSchema = new mongoose.Schema({
	round: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Round'
	},
	player: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	value: {
		type: Number,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Bet = mongoose.model('Bet', BetSchema);

module.exports = Bet;
