const mongoose = require('../database');

const CardsSchema = new mongoose.Schema({
	round: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Round'
	},
	turn: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Turn'
	},
	player: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	card: {
		type: Array
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Cards = mongoose.model('PlayedCards', CardsSchema);

module.exports = Cards;
