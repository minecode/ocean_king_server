const mongoose = require('../database');

const CardsSchema = new mongoose.Schema({
	round: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Round'
	},
	player: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	cards: {
		type: Array
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Cards = mongoose.model('Cards', CardsSchema);

module.exports = Cards;
