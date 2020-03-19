const express = require('express');
const Game = require('../models/Game');
const User = require('../models/User');
const Round = require('../models/Round');
const Turn = require('../models/Turn');
const Bet = require('../models/Bet');
const Cards = require('../models/Cards');
const GamePlayer = require('../models/GamePlayer');
const PlayedCards = require('../models/PlayedCards');
const ScoreBoard = require('../models/ScoreBoard');
const router = express.Router();

const cards = [
	{ color: 'red', value: '0' },
	{ color: 'red', value: '1' },
	{ color: 'red', value: '2' },
	{ color: 'red', value: '3' },
	{ color: 'red', value: '4' },
	{ color: 'red', value: '5' },
	{ color: 'red', value: '6' },
	{ color: 'red', value: '7' },
	{ color: 'red', value: '8' },
	{ color: 'red', value: '9' },
	{ color: 'red', value: '10' },
	{ color: 'red', value: '11' },
	{ color: 'red', value: '12' },
	{ color: 'red', value: '13' },
	{ color: 'blue', value: '0' },
	{ color: 'blue', value: '1' },
	{ color: 'blue', value: '2' },
	{ color: 'blue', value: '3' },
	{ color: 'blue', value: '4' },
	{ color: 'blue', value: '5' },
	{ color: 'blue', value: '6' },
	{ color: 'blue', value: '7' },
	{ color: 'blue', value: '8' },
	{ color: 'blue', value: '9' },
	{ color: 'blue', value: '10' },
	{ color: 'blue', value: '11' },
	{ color: 'blue', value: '12' },
	{ color: 'blue', value: '13' },
	{ color: 'yellow', value: '0' },
	{ color: 'yellow', value: '1' },
	{ color: 'yellow', value: '2' },
	{ color: 'yellow', value: '3' },
	{ color: 'yellow', value: '4' },
	{ color: 'yellow', value: '5' },
	{ color: 'yellow', value: '6' },
	{ color: 'yellow', value: '7' },
	{ color: 'yellow', value: '8' },
	{ color: 'yellow', value: '9' },
	{ color: 'yellow', value: '10' },
	{ color: 'yellow', value: '11' },
	{ color: 'yellow', value: '12' },
	{ color: 'yellow', value: '13' },
	{ color: 'black', value: '0' },
	{ color: 'black', value: '1' },
	{ color: 'black', value: '2' },
	{ color: 'black', value: '3' },
	{ color: 'black', value: '4' },
	{ color: 'black', value: '5' },
	{ color: 'black', value: '6' },
	{ color: 'black', value: '7' },
	{ color: 'black', value: '8' },
	{ color: 'black', value: '9' },
	{ color: 'black', value: '10' },
	{ color: 'black', value: '11' },
	{ color: 'black', value: '12' },
	{ color: 'black', value: '13' },
	{ color: 'sk', value: '0' },
	{ color: 'p1', value: '0' },
	{ color: 'p2', value: '0' },
	{ color: 'p3', value: '0' },
	{ color: 'p4', value: '0' },
	{ color: 'p5', value: '0' },
	{ color: 'm1', value: '0' },
	{ color: 'm2', value: '0' },
	{ color: 'flag1', value: '0' },
	{ color: 'flag2', value: '0' },
	{ color: 'flag3', value: '0' },
	{ color: 'flag4', value: '0' },
	{ color: 'flag5', value: '0' },
	{ color: 'binary', value: '0' }
];

function chunkArrayInGroups(arr, size) {
	var newArr = [];

	for (var i = 0; arr.length > size; i++) {
		newArr.push(arr.splice(0, size));
	}
	newArr.push(arr.slice(0));
	return newArr;
}

router.get('/', async (req, res) => {
	try {
		const games = await Game.find({ status: 'in queue' }).populate(
			'createdBy'
		);
		if (games) {
			return res.send({
				games
			});
		}
		return res.status(200).send({
			games: null
		});
	} catch (err) {
		return res.status(400).send({ error: 'Cannot get current games' });
	}
});

router.get('/cards', async (req, res) => {
	const { user, game } = req.query;
	try {
		const round = await Round.findOne({ game: game }).sort({
			createdAt: -1
		});
		if (round) {
			const cards = await Cards.findOne({
				round: round._id,
				player: user
			});
			if (cards) {
				res.send({ cards });
			} else {
				res.status(400).send({
					error: 'Cannot get the cards of a player (0)'
				});
			}
		} else {
			res.status(400).send({
				error: 'Cannot get the cards of a player (1)'
			});
		}
	} catch (err) {
		console.log(err);
		res.status(400).send({
			error: 'Cannot get the cards of a player (2)'
		});
	}
});

function getWinner(playedCards) {
	hasS = false;
	playerS = null;
	cardS = null;
	current_winner = null;
	current_card_winner = null;
	ref = null;
	playedCards.map((card, i) => {
		if (
			i == 0 &&
			(card.card[0].color === 'red' ||
				card.card[0].color === 'blue' ||
				card.card[0].color === 'yellow' ||
				card.card[0].color === 'black')
		) {
			ref = card.card[0].color;
			current_card_winner = card.card[0];
			current_winner = card.player;
		} else if (i !== 0 && ref) {
			if (
				card.card[0].color == ref &&
				card.card[0].value > current_card_winner.value
			) {
				current_card_winner = card.card[0];
				current_winner = card.player;
			} else if (
				card.card[0].color !== 'red' &&
				card.card[0].color !== 'blue' &&
				card.card[0].color !== 'yellow' &&
				card.card[0].color !== 'black'
			) {
				ref = null;
				current_card_winner = card.card[0];
				current_winner = card.player;

				if (card.card[0].color[0] === 'm') {
					hasS = true;
					playerS = card.player;
				}
			} else if (card.card[0].color === 'black') {
				current_card_winner = card.card[0];
				current_winner = card.player;
				ref = card.card[0].color;
			}
		} else if (i !== 0 && !ref) {
			if (
				card.card[0].color !== 'red' &&
				card.card[0].color !== 'blue' &&
				card.card[0].color !== 'yellow' &&
				card.card[0].color !== 'black'
			) {
				if (current_card_winner.color[0] === 'p') {
					if (card.card[0].color[0] === 's') {
						current_card_winner = card.card[0];
						current_winner = card.player;
					}
				}
				if (current_card_winner.color[0] === 'b') {
					if (current_card_winner.value === 'f') {
						if (
							card.card[0].color[0] === 's' ||
							(card.card[0].color[0] === 'b' &&
								card.card[0].value === 'p') ||
							card.card[0].color[0] === 'p' ||
							card.card[0].color[0] === 'm'
						) {
							current_card_winner = card.card[0];
							current_winner = card.player;
						}
					} else if (current_card_winner.value === 'p') {
						if (card.card[0].color[0] === 's') {
							current_card_winner = card.card[0];
							current_winner = card.player;
						}
					}
				}
				if (current_card_winner.color[0] === 'f') {
					if (
						card.card[0].color[0] === 's' ||
						card.card[0].color[0] === 'p' ||
						card.card[0].color[0] === 'm'
					) {
						current_card_winner = card.card[0];
						current_winner = card.player;
					}
				}
				if (current_card_winner.color[0] === 's') {
					if (card.card[0].color[0] === 'm') {
						current_card_winner = card.card[0];
						current_winner = card.player;
					}
				}
				if (current_card_winner.color[0] === 'm') {
					if (card.card[0].color[0] === 'p') {
						current_card_winner = card.card[0];
						current_winner = card.player;
					}
				}

				if (card.card[0].color[0] === 'm') {
					hasS = true;
					playerS = card.player;
					cardS = card.card[0];
				}
			} else {
				if (current_card_winner.color[0] === 'f') {
					current_card_winner = card.card[0];
					current_winner = card.player;
					ref = card.card[0].color;
				}
			}
		} else if (
			i === 0 &&
			card.card[0].color !== 'red' &&
			card.card[0].color !== 'blue' &&
			card.card[0].color !== 'yellow' &&
			card.card[0].color !== 'black'
		) {
			current_card_winner = card.card[0];
			current_winner = card.player;

			if (card.card[0].color[0] === 'm') {
				hasS = true;
				playerS = card.player;
				cardS = card.card[0];
			}
		}
	});

	if (hasS) {
		return { card: cardS, player: playerS };
	} else {
		return { card: current_card_winner, player: current_winner };
	}
}

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function calculatePontuations(game) {
	const players = await GamePlayer.find({ game: game }).populate('player');
	const rounds = await Round.find({ game: game });
	if (players) {
		players.map(async (player, i) => {
			let pont = 0;
			rounds.map(async (round, j) => {
				const bet = await Bet.findOne({
					round: round._id,
					player: player.player._id
				});
				const wins = await Turn.find({
					round: round._id,
					winner: player.player._id
				});

				if (bet.value === 0) {
					if (wins.length === 0) {
						pont += round.roundNumber * 10;
					} else {
						pont += -1 * (round.roundNumber * 10);
					}
				} else {
					if (wins.length === bet.value) {
						pont += bet.value * 10;
					} else {
						let diff = bet.value - wins.length;
						if (diff < 0) {
							diff = diff * -1;
						}
						pont += -10 * diff;
					}
				}

				const turns = await Turn.find({ round: round._id });

				turns.forEach(async (t, i) => {
					const played_cards_turn = await PlayedCards.find({
						round: round._id,
						turn: t._id
					});
					let hasSkull = false;
					let hasS = false;
					let countP = 0;

					played_cards_turn.forEach((e, i) => {
						if (e.card[0].color[0] === 's') {
							hasSkull = true;
						} else if (e.card[0].color[0] === 'm') {
							hasS = true;
						} else if (e.card[0].color[0] === 'p') {
							countP += 1;
						} else if (e.card[0].color[0] === 'b') {
							countP += 1;
						}
					});

					const turn_winner = getWinner(played_cards_turn);
					if (turn_winner.player === player.player._id) {
						if (hasS && hasSkull) {
							pont += 50;
						} else if (hasSkull) {
							pont += 30 * countP;
						}
					}
				});

				if (j + 1 === rounds.length) {
					const score_board = await ScoreBoard.findOne({
						game: game,
						player: player.player._id
					});

					if (score_board) {
						await ScoreBoard.findOneAndUpdate(
							{ game: game, player: player.player._id },
							{ points: pont },
							{ useFindAndModify: false }
						);
						return true;
					} else {
						await ScoreBoard.create({
							game: game,
							player: player.player._id,
							points: pont
						});
						return true;
					}
				}
			});
		});
	}
	return false;
}

router.get('/pontuations', async (req, res) => {
	const { game } = req.query;

	try {
		const pontuations = await ScoreBoard.find({ game: game }).populate(
			'player'
		);
		res.send({ pontuations: pontuations });
	} catch (err) {
		res.status(400).send({
			error: 'Cannot get the pontuations'
		});
	}
});

router.post('/cards', async (req, res) => {
	const { game, user, card } = req.body;

	try {
		const round = await Round.findOne({ game: game._id }).sort({
			createdAt: -1
		});
		if (round) {
			const cards_db = await Cards.findOne({
				round: round._id,
				player: user
			});
			if (cards_db) {
				temp = [];
				cards_db.cards.map((card_i, i) => {
					if (
						!(
							card_i.color === card.color &&
							card_i.value === card.value
						)
					) {
						if (
							!(
								card_i.color === 'binary' &&
								card.color === 'binary'
							)
						) {
							temp.push(card_i);
						}
					}
				});
				const new_cards = await Cards.findOneAndUpdate(
					{
						round: round._id,
						player: user
					},
					{
						cards: temp
					},
					{ useFindAndModify: false }
				);

				const turn = await Turn.findOne({ round: round._id }).sort({
					createdAt: -1
				});

				if (turn) {
					await PlayedCards.create({
						round: round._id,
						turn: turn._id,
						player: user,
						card: [card]
					});

					const players = await GamePlayer.find({
						game: game
					}).populate('player');
					const total_playedCards = await PlayedCards.find({
						round: round._id,
						turn: turn._id
					}).sort({ createdAt: 1 });

					req.app
						.get('io')
						.to(game._id)
						.emit('card played', game._id, card, user);

					if (players.length === total_playedCards.length) {
						await timeout(3000);

						req.app
							.get('io')
							.to(game._id)
							.emit('turn finish');

						const winner = getWinner(total_playedCards);

						await Turn.findOneAndUpdate(
							{ round: round._id },
							{ winner: winner.player },
							{ useFindAndModify: false }
						).sort({ createdAt: -1 });

						const winner_player = await User.findOne({
							_id: winner.player
						});

						req.app
							.get('io')
							.to(game._id)
							.emit('turn winner', winner_player);

						//await 3 seconds for players see the winner
						await timeout(3000);

						const turns = await Turn.find({ round: round._id });

						if (turns.length === round.roundNumber) {
							if (round.roundNumber < 10) {
								await calculatePontuations(game._id);

								await timeout(3000);

								const new_round = await Round.create({
									game: game,
									roundNumber: round.roundNumber + 1
								});

								const new_turn = await Turn.create({
									round: new_round._id,
									turnNumber: 1
								});

								const players = await GamePlayer.find({
									game: game._id
								}).populate('player');

								const selected_cards = cards
									.sort(() => Math.random() - Math.random())
									.slice(
										0,
										players.length * new_round.roundNumber
									);

								chunkArrayInGroups(
									selected_cards,
									new_round.roundNumber
								).map(async (v, i) => {
									let temp = await Cards.create({
										round: new_round._id,
										player: players[i].player._id,
										cards: v
									});
								});

								await Game.findOneAndUpdate(
									{
										status: 'in game',
										_id: game._id
									},
									{ status: 'place bets' },
									{ useFindAndModify: false }
								);

								const temp_game = await Game.findOne({
									status: 'place bets',
									_id: game._id
								});

								req.app
									.get('io')
									.to(game._id)
									.emit('round finish');

								req.app
									.get('io')
									.to(game._id)
									.emit('place bets', round.roundNumber + 1);
							} else {
								await calculatePontuations(game._id);

								req.app
									.get('io')
									.to(game._id)
									.emit('game finished');
							}

							// emit to place bets
						} else {
							const first_player_to_play = await GamePlayer.findOne(
								{
									game: game,
									player: winner_player
								}
							).populate('player');

							await Turn.create({
								round: round._id,
								turnNumber: turns.length + 1
							});

							req.app
								.get('io')
								.to(game._id)
								.emit('new turn', first_player_to_play.player);
							// emit to new turn
						}
					} else {
						const player_played = await GamePlayer.findOne({
							game: game,
							player: user
						}).populate('player');
						let order = null;
						if (player_played.order == players.length) {
							order = 1;
						} else {
							order = player_played.order + 1;
						}

						const next_player = await GamePlayer.findOne({
							game: game,
							order: order
						}).populate('player');
						req.app
							.get('io')
							.to(game._id)
							.emit('next play', next_player);
						// emit to other player play
					}

					res.send({ new_cards });
				} else {
					res.status(400).send({
						error: 'Cannot post the cards of a player (-1)'
					});
				}
			} else {
				res.status(400).send({
					error: 'Cannot post the cards of a player (0)'
				});
			}
		} else {
			res.status(400).send({
				error: 'Cannot post the cards of a player (1)'
			});
		}
	} catch (err) {
		console.log(err);
		res.status(400).send({
			error: 'Cannot post the cards of a player (2)'
		});
	}
});

router.post('/', async (req, res) => {
	const { user } = req.body;
	try {
		const ref = await GamePlayer.findOne({ player: user });
		if (ref) {
			return res.status(400).send({
				error: 'Cannot create a new game while you are in another'
			});
		}
		const game = await Game.create({
			...req.body,
			createdBy: req.body.user
		});
		const gamePlayer = await GamePlayer.create({
			game: game.id,
			player: user,
			order: 1
		});

		// socket.emit('register', { user });
		return res.send({ game, gamePlayer });
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Creating a new game failed' });
	}
});

router.get('/playersStatus', async (req, res) => {
	const { game } = req.query;

	try {
		const round = await Round.findOne({ game: game }).sort({
			createdAt: -1
		});
		if (round) {
			const turn = await Turn.findOne({ round: round._id }).sort({
				createdAt: -1
			});

			const players = await GamePlayer.find({ game: game }).sort({
				order: 1
			});

			let bet = [];
			players.map(async (p, i) => {
				const temp = await Bet.find({ round: round._id, player: p })
					.sort({ player: 1 })
					.populate('player');
				bet.push(temp);
			});

			const number_of_wins = await Turn.find({ round: round._id }).sort({
				player: 1
			});
			const played_cards = await PlayedCards.find({
				round: round._id,
				turn: turn._id
			})
				.sort({ player: 1 })
				.populate('player');
			let temp_results = {};
			number_of_wins.map((turn, i) => {
				if (turn.winner !== undefined) {
					if (temp_results[turn.winner] === undefined) {
						temp_results[turn.winner] = 1;
					} else {
						temp_results[turn.winner] =
							temp_results[turn.winner] + 1;
					}
				}
			});
			return res.send({ bet, played_cards, temp_results });
		} else {
			return res.status(400).send({ error: 'Cannot get player status' });
		}
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Cannot get player status' });
	}
});

router.get('/gamePlayers', async (req, res) => {
	const { game } = req.query;
	try {
		const game_players = await GamePlayer.find({ game: game }).populate(
			'player'
		);
		return res.send({ game_players });
	} catch (err) {
		return res.status(400).send({ error: 'Cannot get game players' });
	}
});

router.get('/current', async (req, res) => {
	const { game, user } = req.query;
	try {
		const current_game = await Game.findOne({ _id: game }).populate(
			'createdBy'
		);
		if (current_game) {
			const round = await Round.findOne({ game: current_game._id }).sort({
				createdAt: -1
			});
			const rounds = await Round.find({ game: current_game._id });
			if (round) {
				const bet = await Bet.findOne({
					player: user,
					round: round._id
				});
				if (bet) {
					return res.send({ current_game, round, bet });
				}
				return res.send({ current_game, round });
			}
			return res.send({ current_game });
		} else {
			return res.status(400).send({ error: 'Cannot get current game' });
		}
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Cannot get current game' });
	}
});

router.get('/inGame', async (req, res) => {
	const { user } = req.query;
	try {
		const ref = await GamePlayer.findOne({ player: user });
		if (ref) {
			const game = await Game.findOne({ _id: ref.game });
			return res.send({
				inGame: true,
				game: game
			});
		}
		return res.send({
			inGame: false
		});
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Cannot check if is in game' });
	}
});

// TODO: Verificar se o jogo esta in queue
router.post('/join', async (req, res) => {
	const { user } = req.body;
	try {
		if (await GamePlayer.findOne({ player: user })) {
			return res.status(400).send({
				error: 'Cannot join in a new game while you are in another'
			});
		}
		const players = await GamePlayer.find({ game: req.body.game });
		const gamePlayer = await GamePlayer.create({
			game: req.body.game,
			player: user,
			order: players.length + 1
		});

		return res.send({ gamePlayer });
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Joining a new game failed' });
	}
});

router.get('/currentPlayer', async (req, res) => {
	const { game } = req.query;
	try {
		const round = await Round.findOne({ game: game }).sort({
			createdAt: -1
		});
		if (round) {
			const turn = await Turn.findOne({ round: round._id }).sort({
				createdAt: -1
			});
			const played_cards = await PlayedCards.findOne({
				round: round._id,
				turn: turn._id
			})
				.sort({ createdAt: -1 })
				.populate('player');
			if (played_cards) {
				const order = await GamePlayer.findOne({
					player: played_cards.player._id
				});
				const players = await GamePlayer.find({ game: game });
				if (order == players.length) {
					const next_player = await GamePlayer.find({
						game: game,
						order: 1
					}).populate('player');
					return res.send({ player: next_player[0].player });
				} else {
					const next_player = await GamePlayer.find({
						game: game,
						order: order + 1
					}).populate('player');
					return res.send({ player: next_player[0].player });
				}
			} else {
				if (round.roundNumber == 1) {
					const next_player = await GamePlayer.find({
						game: game,
						order: 1
					}).populate('player');
					return res.send({ player: next_player[0].player });
				} else {
					const player_temp = await User.findOne({
						_id: turn.winner
					});
					if (player_temp) {
						return res.send({ player: player_temp });
					} else {
						const turns = await Turn.find({
							round: round._id
						}).sort({
							createdAt: -1
						});
						if (turns[1]) {
							const player_temp2 = await User.findOne({
								_id: turns[1].winner
							});
							return res.send({ player: player_temp2 });
						} else {
							const rounds = await Round.find({
								game: game
							}).sort({ createdAt: -1 });
							const new_turn_temp = await Turn.findOne({
								round: rounds[1]._id
							}).sort({ createdAt: -1 });
							const player_temp3 = await User.findOne({
								_id: new_turn_temp.winner
							});
							return res.send({ player: player_temp3 });
						}
					}
				}
			}
		} else {
			return res.status(400).send({ error: 'Cannot get current player' });
		}
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Cannot get current player' });
	}
});

// TODO: Verificar se o jogo esta in queue
router.post('/leave', async (req, res) => {
	const { user } = req.body;
	try {
		if (!(await GamePlayer.findOne({ player: user }))) {
			return res.status(400).send({
				error: 'Cannot leave the game if you are not inside it'
			});
		}
		const gamePlayer = await GamePlayer.findOneAndRemove(
			{ player: user },
			{ useFindAndModify: false }
		);
		const id = gamePlayer.game;

		const game_players = await GamePlayer.findOne({ game: id });
		if (!game_players) {
			const game = await Game.findOneAndUpdate(
				{ _id: id },
				{ status: 'finished' },
				{ useFindAndModify: false }
			);
		} else {
			const game = await Game.findOne({ _id: id });
			if (game.status !== 'in queue') {
				await Game.findOneAndUpdate(
					{ _id: id },
					{ status: 'finished' },
					{ useFindAndModify: false }
				);
				req.app
					.get('io')
					.to(id)
					.emit('game finished');
			}
		}

		return res.send({ gamePlayer });
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Leaving a game failed' });
	}
});

// TODO: Verificar se o jogo esta in queue
router.post('/start', async (req, res) => {
	const { user } = req.body;
	try {
		const current = await Game.findOne({
			status: 'in queue',
			createdBy: user
		});
		if (!current) {
			return res.status(400).send({
				error:
					'Cannot start the game if you are not the leader or if the game is not in queue'
			});
		}

		const players = await GamePlayer.find({
			game: current._id
		}).populate('player');

		const round = await Round.create({ game: current._id, roundNumber: 1 });
		const turn = await Turn.create({ round: round._id, turnNumber: 1 });

		const selected_cards = cards
			.sort(() => Math.random() - Math.random())
			.slice(0, players.length * 1);

		chunkArrayInGroups(selected_cards, 1).map(async (v, i) => {
			let temp = await Cards.create({
				round: round._id,
				player: players[i].player._id,
				cards: v
			});
		});

		await Game.findOneAndUpdate(
			{
				status: 'in queue',
				createdBy: user
			},
			{ status: 'place bets' },
			{ useFindAndModify: false }
		);

		const game = await Game.findOne({
			status: 'place bets',
			createdBy: user
		});

		req.app
			.get('io')
			.to(game._id)
			.emit('place bets', 1);

		return res.send({ game, round, turn });
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Starting a game failed' });
	}
});

// TODO: Verificar se o jogo esta in queue
router.post('/stop', async (req, res) => {
	const { user } = req.body;
	try {
		if (await Game.findOne({ status: 'in queue', createdBy: user })) {
			return res.status(400).send({
				error: 'Cannot stop the game if you are not the leader'
			});
		}
		const game = await Game.findOneAndUpdate({
			status: 'stop'
		});

		return res.send({ game });
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Stoping a game failed' });
	}
});

router.post('/bet', async (req, res) => {
	const { user, game, value } = req.body;
	try {
		const current_game = await Game.findOne({
			status: 'place bets',
			_id: game
		});
		if (current_game) {
			const round = await Round.findOne({ game: current_game._id }).sort({
				createdAt: -1
			});
			if (round) {
				const bet = await Bet.findOne({
					round: round._id,
					player: user
				});
				if (!bet) {
					const new_bet = await Bet.create({
						round: round._id,
						player: user,
						value: value
					});
					const bets = await Bet.find({ round: round._id });
					const players = await GamePlayer.find({
						game: game
					}).populate('player');
					if (bets && players) {
						if (bets.length == players.length) {
							await Game.findOneAndUpdate(
								{
									status: 'place bets',
									_id: game
								},
								{ status: 'in game' },
								{ useFindAndModify: false }
							);

							req.app
								.get('io')
								.to(game)
								.emit('start round');
							if (round.roundNumber === 1) {
								const player = await GamePlayer.findOne({
									game: game,
									order: 1
								}).populate('player');
								req.app
									.get('io')
									.to(game)
									.emit('new turn', player.player);
							} else {
								const last_round = await Round.find({
									game: game,
									roundNumber: round.roundNumber - 1
								});

								const last_turn = await Turn.findOne({
									round: last_round
								}).populate('winner');

								req.app
									.get('io')
									.to(game)
									.emit('new turn', last_turn.winner);
							}
						}
					}
					res.send({ new_bet });
				} else {
					return res.status(400).send({
						error: 'You have already a bet to this round'
					});
				}
			} else {
				return res.status(400).send({
					error: 'Is not possible place a bet to this round'
				});
			}
		} else {
			return res
				.status(400)
				.send({ error: 'Is not possible place a bet to this game' });
		}
	} catch (err) {
		return res
			.status(400)
			.send({ error: 'An error has occurred on place a bet' });
	}
});

module.exports = app => app.use('/game', router);
