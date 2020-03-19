const mongoose = require('../database');

const RoundSchema = new mongoose.Schema({
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game'
	},
	roundNumber: {
		type: Number,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Round = mongoose.model('Round', RoundSchema);

module.exports = Round;
