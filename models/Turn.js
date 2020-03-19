const mongoose = require('../database');

const TurnSchema = new mongoose.Schema({
	round: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Round'
	},
	turnNumber: {
		type: Number,
		required: true
	},
	winner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Turn = mongoose.model('Turn', TurnSchema);

module.exports = Turn;
