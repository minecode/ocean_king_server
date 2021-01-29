const express = require('express');
const Game = require('../models/Game');
const User = require('../models/User');
const Round = require('../models/Round');
const Notifications = require('../models/Notifications');
const Turn = require('../models/Turn');
const Bet = require('../models/Bet');
const Cards = require('../models/Cards');
const GamePlayer = require('../models/GamePlayer');
const PlayedCards = require('../models/PlayedCards');
const ScoreBoard = require('../models/ScoreBoard');
const Message = require('../models/Message');
const Score = require('../models/Score');
const Friend = require('../models/Friend');
const router = express.Router();
const mongoose = require('../database');

const cards = [
	{ color: 'flag1', value: '0', index: 0 },
	{ color: 'flag2', value: '0', index: 0 },
	{ color: 'flag3', value: '0', index: 1 },
	{ color: 'flag4', value: '0', index: 2 },
	{ color: 'flag5', value: '0', index: 3 },
	// { color: 'red', value: '0' },
	{ color: 'red', value: '1', index: 4 },
	{ color: 'red', value: '2', index: 5 },
	{ color: 'red', value: '3', index: 6 },
	{ color: 'red', value: '4', index: 7 },
	{ color: 'red', value: '5', index: 8 },
	{ color: 'red', value: '6', index: 9 },
	{ color: 'red', value: '7', index: 10 },
	{ color: 'red', value: '8', index: 11 },
	{ color: 'red', value: '9', index: 12 },
	{ color: 'red', value: '10', index: 13 },
	{ color: 'red', value: '11', index: 14 },
	{ color: 'red', value: '12', index: 15 },
	{ color: 'red', value: '13', index: 16 },
	// { color: 'blue', value: '0' },
	{ color: 'blue', value: '1', index: 17 },
	{ color: 'blue', value: '2', index: 18 },
	{ color: 'blue', value: '3', index: 19 },
	{ color: 'blue', value: '4', index: 20 },
	{ color: 'blue', value: '5', index: 21 },
	{ color: 'blue', value: '6', index: 22 },
	{ color: 'blue', value: '7', index: 23 },
	{ color: 'blue', value: '8', index: 24 },
	{ color: 'blue', value: '9', index: 25 },
	{ color: 'blue', value: '10', index: 26 },
	{ color: 'blue', value: '11', index: 27 },
	{ color: 'blue', value: '12', index: 28 },
	{ color: 'blue', value: '13', index: 29 },
	// { color: 'yellow', value: '0' },
	{ color: 'yellow', value: '1', index: 30 },
	{ color: 'yellow', value: '2', index: 31 },
	{ color: 'yellow', value: '3', index: 32 },
	{ color: 'yellow', value: '4', index: 33 },
	{ color: 'yellow', value: '5', index: 34 },
	{ color: 'yellow', value: '6', index: 35 },
	{ color: 'yellow', value: '7', index: 36 },
	{ color: 'yellow', value: '8', index: 37 },
	{ color: 'yellow', value: '9', index: 38 },
	{ color: 'yellow', value: '10', index: 39 },
	{ color: 'yellow', value: '11', index: 40 },
	{ color: 'yellow', value: '12', index: 41 },
	{ color: 'yellow', value: '13', index: 42 },
	// { color: 'black', value: '0' },
	{ color: 'black', value: '1', index: 43 },
	{ color: 'black', value: '2', index: 44 },
	{ color: 'black', value: '3', index: 45 },
	{ color: 'black', value: '4', index: 46 },
	{ color: 'black', value: '5', index: 47 },
	{ color: 'black', value: '6', index: 48 },
	{ color: 'black', value: '7', index: 49 },
	{ color: 'black', value: '8', index: 50 },
	{ color: 'black', value: '9', index: 51 },
	{ color: 'black', value: '10', index: 52 },
	{ color: 'black', value: '11', index: 53 },
	{ color: 'black', value: '12', index: 54 },
	{ color: 'black', value: '13', index: 55 },
	{ color: 'm1', value: '0', index: 56 },
	{ color: 'm2', value: '0', index: 57 },
	{ color: 'binary', value: '0', index: 58 },
	{ color: 'p1', value: '0', index: 59 },
	{ color: 'p2', value: '0', index: 60 },
	{ color: 'p3', value: '0', index: 61 },
	{ color: 'p4', value: '0', index: 62 },
	{ color: 'p5', value: '0', index: 63 },
	{ color: 'sk', value: '0', index: 64 },
];

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

function chunkArrayInGroups(arr, size) {
	var newArr = [];

	for (var i = 0; arr.length > size; i++) {
		newArr.push(arr.splice(0, size));
	}
	newArr.push(arr.slice(0));
	return newArr;
}

function compare(a, b) {
	let comparison = 0;
	if (a.createdAt > b.createdAt) {
		comparison = 1;
	} else {
		comparison = -1;
	}
	return comparison;
}

function getWinner(playedCards) {
	hasSkull = false;
	skullCard = null;
	skullPlayer = null;

	hasPirate = false;
	pirateCard = null;
	piratePlayer = null;

	hasMermaid = false;
	mermaidCard = null;
	mermaidPlayer = null;

	firstColor = null;
	currentCard = null;
	currentPlayer = null;

	playedCards = playedCards.sort(compare);

	playedCards.map((card, i) => {
		if (card.card[0].color[0] === 's' && !hasSkull) {
			hasSkull = true;
			skullCard = card.card[0];
			skullPlayer = card.player;
		}

		if (card.card[0].color[0] === 'p' && !hasPirate) {
			hasPirate = true;
			pirateCard = card.card[0];
			piratePlayer = card.player;
		}

		if (card.card[0].color[0] === 'm' && !hasMermaid) {
			hasMermaid = true;
			mermaidCard = card.card[0];
			mermaidPlayer = card.player;
		}

		if (
			card.card[0].color[0] === 'b' &&
			card.card[0].value === 'p' &&
			!hasPirate
		) {
			hasPirate = true;
			pirateCard = card.card[0];
			piratePlayer = card.player;
		}

		if (
			card.card[0].color === 'red' ||
			card.card[0].color === 'yellow' ||
			card.card[0].color === 'blue'
		) {
			if (firstColor === null) {
				firstColor = card.card[0].color;
				currentCard = card.card[0];
				currentPlayer = card.player;
			} else {
				if (
					card.card[0].color === firstColor &&
					parseInt(card.card[0].value) > parseInt(currentCard.value)
				) {
					currentCard = card.card[0];
					currentPlayer = card.player;
				}
			}
		}

		if (card.card[0].color === 'black') {
			if (firstColor !== 'black' || firstColor === null) {
				firstColor = card.card[0].color;
				currentCard = card.card[0];
				currentPlayer = card.player;
			} else {
				if (
					parseInt(card.card[0].value) > parseInt(currentCard.value)
				) {
					currentCard = card.card[0];
					currentPlayer = card.player;
				}
			}
		}

		if (
			card.card[0].color[0] === 'f' ||
			(card.card[0].color[0] === 'b' && card.card[0].value === 'f')
		) {
			if (currentPlayer === null) {
				currentCard = card.card[0];
				currentPlayer = card.player;
			}
		}
	});

	if (hasSkull && hasMermaid) {
		return { card: mermaidCard, player: mermaidPlayer };
	}
	if (hasMermaid && !hasPirate) {
		return { card: mermaidCard, player: mermaidPlayer };
	}
	if (hasSkull && !hasMermaid) {
		return { card: skullCard, player: skullPlayer };
	}
	if (hasPirate && !hasSkull) {
		return { card: pirateCard, player: piratePlayer };
	}
	return { card: currentCard, player: currentPlayer };
}

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function updateMaxScoresWinsAndGames(game) {
	const update_players = await ScoreBoard.find({
		game: game._id,
	});

	await asyncForEach(update_players, async (p, i) => {
		try {
			const upd_player = await Score.findOne({ player: p.player });
			const updated = await Score.findOneAndUpdate(
				{ player: p.player },
				{
					games: upd_player.games + 1,
					points: upd_player.points + p.points,
				},
				{
					new: true,
					useFindAndModify: false,
				}
			);
		} catch (err2) {
			const score_player = await Score.create({
				player: p.player,
				points: p.points,
				games: 1,
			});
		}
	});

	const scoreboards = await ScoreBoard.find({
		game: game._id,
	}).sort({ points: -1 });

	await asyncForEach(scoreboards, async (s, i) => {
		try {
			const temp_p = await Score.findOne({
				player: s.player,
			});
			let hasNewMax = false;
			if (parseInt(s.points) > parseInt(temp_p.max_score)) {
				hasNewMax = true;
			}

			if (i === 0) {
				let query = {
					wins: temp_p.wins + 1,
				};
				if (hasNewMax) {
					query = {
						wins: temp_p.wins + 1,
						max_score: s.points,
					};
				}
				const temp_p_updated = await Score.findOneAndUpdate(
					{ player: s.player },
					query,
					{ useFindAndModify: false, new: true }
				);
			} else {
				const temp_p = await Score.findOne({ player: s.player });
				let query = {};

				if (
					parseInt(s.points) === parseInt(scoreboards[0].points) &&
					hasNewMax
				) {
					query = {
						wins: temp_p.wins + 1,
						max_score: s.points,
					};
				} else if (
					parseInt(s.points) === parseInt(scoreboards[0].points) &&
					!hasNewMax
				) {
					query = {
						wins: temp_p.wins + 1,
					};
				} else if (
					parseInt(s.points) !== parseInt(scoreboards[0].points) &&
					hasNewMax
				) {
					query = {
						max_score: s.points,
					};
				}

				const temp_p_updated = await Score.findOneAndUpdate(
					{ player: s.player },
					query,
					{ useFindAndModify: false, new: true }
				);
			}
		} catch (err) {
			if (i === 0) {
				const temp_p_updated = await Score.create({
					player: s.player,
					wins: 1,
					max_score: s.points,
				});
			} else {
				const temp_p_updated = await Score.create({
					player: s.player,
					max_score: s.points,
				});
			}
		}
	});

	return;
}

async function updateRightBets(game) {
	const rounds = await Round.find({
		game: game._id,
	}).sort({ createdAt: -1 });

	await asyncForEach(rounds, async (last_round, k) => {
		const bets = await Bet.find({
			round: last_round._id,
		});

		await asyncForEach(bets, async (b, i) => {
			const wins = await Turn.find({
				round: last_round._id,
				winner: b.player,
			});
			if (wins && parseInt(wins.length) === parseInt(b.value)) {
				try {
					const upd_player = await Score.findOne({
						player: b.player,
					});
					let query = {
						right_bets: upd_player.right_bets + 1,
					};
					if (parseInt(b.value) === 0) {
						query = {
							right_bets: upd_player.right_bets + 1,
							right_bets_zero: upd_player.right_bets_zero + 1,
						};
					}
					query[`rb_at_${last_round.roundNumber}`] =
						upd_player[`rb_at_${last_round.roundNumber}`] + 1;
					const updated = await Score.findOneAndUpdate(
						{ player: b.player },
						query,
						{
							new: true,
							useFindAndModify: false,
						}
					);
				} catch (err2) {
					let query = {
						player: b.player,
						right_bets: 1,
					};
					if (parseInt(b.value) === 0) {
						query = {
							player: b.player,
							right_bets: 1,
							right_bets_zero: 1,
						};
					}
					query[`rb_at_${last_round.roundNumber}`] =
						upd_player[`rb_at_${last_round.roundNumber}`] + 1;
					const score_player = await Score.create(query);
				}
			}
		});

		return;
	});
}

async function updateEntryWins(game) {
	const rounds = await Round.find({ game: game._id }).sort({
		roundNumber: 1,
	});

	await asyncForEach(rounds, async (round, i) => {
		const turns = await Turn.find({
			round: round._id,
		}).sort({ turnNumber: 1 });

		await asyncForEach(turns, async (turn, j) => {
			const played_cards = await PlayedCards.find({
				round: round._id,
				turn: turn._id,
			}).sort({ createdAt: 1 });
			if (String(played_cards[0].player) === String(turn.winner)) {
				try {
					const current_score = await Score.findOne({
						player: turn.winner,
					});
					await Score.findOneAndUpdate(
						{ player: turn.winner },
						{
							entry_wins: current_score.entry_wins + 1,
							entry_plays: current_score.entry_plays + 1,
						},
						{
							new: true,
							useFindAndModify: false,
						}
					);
				} catch (err) {
					await Score.create({
						player: turn.winner,
						entry_wins: 1,
						entry_plays: 1,
					});
				}
			} else {
				try {
					const current_score = await Score.findOne({
						player: played_cards[0].player,
					});
					await Score.findOneAndUpdate(
						{ player: played_cards[0].player },
						{
							entry_plays: current_score.entry_plays + 1,
						},
						{
							new: true,
							useFindAndModify: false,
						}
					);
				} catch (err) {
					await Score.create({
						player: played_cards[0].player,
						entry_plays: 1,
					});
				}
			}
		});
	});
}

async function calculatePontuations(game) {
	const players = await GamePlayer.find({ game: game }).populate('player');
	const rounds = await Round.find({ game: game });
	if (players) {
		await asyncForEach(players, async (player, i) => {
			let pont = 0;
			await asyncForEach(rounds, async (round, j) => {
				const bet = await Bet.findOne({
					round: round._id,
					player: player.player._id,
				});
				const wins = await Turn.find({
					round: round._id,
					winner: player.player._id,
				});

				let temp_played_cards = [];
				let hasSkull = false;
				let hasS = false;
				let countP = 0;
				let hasPirates = false;

				if (bet.value === 0) {
					if (wins.length === 0) {
						pont += round.roundNumber * 10;

						await asyncForEach(wins, async (t, i) => {
							temp_played_cards = await PlayedCards.find({
								round: round._id,
								turn: t._id,
							}).sort({ createdAt: 'asc' });

							hasSkull = false;
							hasS = false;
							countP = 0;
							hasPirates = false;

							temp_played_cards.forEach((e, i) => {
								if (e.card[0].color[0] === 's') {
									hasSkull = true;
								} else if (e.card[0].color[0] === 'm') {
									hasS = true;
								} else if (e.card[0].color[0] === 'p') {
									hasPirates = true;
									countP += 1;
								} else if (e.card[0].color === 'binary') {
									hasPirates = true;
									countP += 1;
								}
							});

							if (hasS && hasSkull) {
								pont += 50;
							} else if (
								hasSkull &&
								parseInt(countP) > 0 &&
								hasPirates
							) {
								pont += 30 * countP;
							}
						});
					} else {
						pont += -1 * (round.roundNumber * 10);
					}
				} else {
					if (wins.length === bet.value) {
						pont += bet.value * 20;

						await asyncForEach(wins, async (t, i) => {
							temp_played_cards = await PlayedCards.find({
								round: round._id,
								turn: t._id,
							}).sort({ createdAt: 'asc' });

							hasSkull = false;
							hasS = false;
							countP = 0;
							hasPirates = false;

							temp_played_cards.forEach((e, i) => {
								if (e.card[0].color[0] === 's') {
									hasSkull = true;
								} else if (e.card[0].color[0] === 'm') {
									hasS = true;
								} else if (e.card[0].color[0] === 'p') {
									hasPirates = true;
									countP += 1;
								} else if (e.card[0].color === 'binary') {
									hasPirates = true;
									countP += 1;
								}
							});

							if (hasS && hasSkull) {
								pont += 50;
							} else if (
								hasSkull &&
								parseInt(countP) > 0 &&
								hasPirates
							) {
								pont += 30 * countP;
							}
						});
					} else {
						let diff = bet.value - wins.length;
						if (diff < 0) {
							diff = diff * -1;
						}
						pont += -10 * diff;
					}
				}

				if (j + 1 === rounds.length) {
					const score_board = await ScoreBoard.findOne({
						game: game,
						player: player.player._id,
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
							points: pont,
						});
						return true;
					}
				}
			});
		});
	}
	return false;
}

router.get('/games', async (req, res) => {
	try {
		const games = await Game.find().sort({ createdAt: -1 });
		return res.status(200).send(games);
	} catch (err) {
		return res.status(400).send({ error: 'Cannot get games' });
	}
});

router.get('/scoreboards/calculateScores', async (req, res) => {
	const games = await Game.find({ status: 'finished' }).sort({
		createdAt: -1,
	});
	await Score.deleteMany();
	await asyncForEach(games, async (game, i) => {
		await updateMaxScoresWinsAndGames(game);
		await updateRightBets(game);
		await updateEntryWins(game);
	});

	return res.status(200).send(await Score.find().populate('player'));
});

router.get('/scoreboards/scores', async (req, res) => {
	const { user } = req.query;
	if (user !== undefined) {
		try {
			let temp_score = await Score.findOne({
				player: user,
			}).populate('player');
			return res.status(200).send(temp_score);
		} catch (err) {
			return res
				.status(400)
				.send({ error: 'Cannot get scoreboards for this user' });
		}
	}
	try {
		return res.status(200).send(await Score.find().populate('player'));
	} catch (err) {
		return res.status(400).send({ error: 'Cannot get scoreboards' });
	}
});

router.get('/scoreboards/games', async (req, res) => {
	try {
		Game.aggregate([
			{
				$lookup: {
					from: 'scoreboards',
					let: { game: '$_id', status: '$status' },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ['$$status', 'finished'] },
										{ $eq: ['$$game', '$game'] },
									],
								},
							},
						},
						{ $sort: { points: -1 } },
					],
					as: 'rel_scoreboards',
				},
			},
			{
				$unwind: {
					path: '$rel_scoreboards',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'rel_scoreboards.player',
					foreignField: '_id',
					as: 'rel_scoreboards.rel_users',
				},
			},
			{
				$unwind: {
					path: '$rel_scoreboards.rel_users',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$group: {
					_id: '$_id',
					createdAt: { $first: '$createdAt' },
					status: { $first: '$status' },
					scores: {
						$push: {
							player: '$rel_scoreboards.rel_users',
							points: '$rel_scoreboards.points',
						},
					},
				},
			},
			{
				$match: {
					scores: { $ne: [{}] },
				},
			},
			{
				$sort: { createdAt: -1 },
			},
		]).exec(function (err, results) {
			console.log(err);
			return res.status(200).send(results);
		});
	} catch (err) {
		return res
			.status(400)
			.send({ error: 'Cannot get scoreboards for games' });
	}
});

router.get('/scoreboards/players/points', async (req, res) => {
	try {
		User.aggregate([
			{
				$lookup: {
					from: 'scoreboards',
					localField: '_id',
					foreignField: 'player',
					as: 'rel_scoreboards',
				},
			},
			{
				$unwind: {
					path: '$rel_scoreboards',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'games',
					localField: 'rel_scoreboards.game',
					foreignField: '_id',
					as: 'rel_games',
				},
			},
			{
				$unwind: {
					path: '$games',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$match: {
					rel_games: { $ne: [] },
					'rel_games.status': 'finished',
				},
			},
			{ $sort: { 'rel_scoreboards.points': -1 } },
			{
				$group: {
					_id: '$_id',
					name: { $first: '$name' },
					email: { $first: '$email' },
					points: { $sum: '$rel_scoreboards.points' },
					games: { $sum: 1 },
				},
			},
			{ $sort: { points: -1 } },
		]).exec(function (err, results) {
			return res.status(200).send(results);
		});
	} catch (err) {
		console.log(err);
		return res
			.status(400)
			.send({ error: 'Cannot get scoreboards for players' });
	}
});

router.get('/scoreboards/players/wins', async (req, res) => {
	try {
		User.aggregate([
			{
				$lookup: {
					from: 'scoreboards',
					localField: '_id',
					foreignField: 'player',
					as: 'rel_scoreboards',
				},
			},
			{
				$unwind: {
					path: '$rel_scoreboards',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'games',
					localField: 'rel_scoreboards.game',
					foreignField: '_id',
					as: 'rel_games',
				},
			},
			{
				$unwind: {
					path: '$games',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$match: {
					rel_games: { $ne: [] },
					'rel_games.status': 'finished',
				},
			},
			{ $sort: { 'rel_scoreboards.points': -1 } },
			{
				$group: {
					_id: '$_id',
					name: { $first: '$name' },
					email: { $first: '$email' },
					points: { $sum: '$rel_scoreboards.points' },
					games: { $sum: 1 },
				},
			},
			{ $sort: { points: -1 } },

			{
				$lookup: {
					from: 'scoreboards',
					localField: '_id',
					foreignField: 'player',
					as: 'rel_scoreboards',
				},
			},
			{
				$unwind: {
					path: '$rel_scoreboards',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'games',
					localField: 'rel_scoreboards.game',
					foreignField: '_id',
					as: 'rel_games',
				},
			},
			{
				$unwind: {
					path: '$games',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$match: {
					rel_games: { $ne: [] },
					'rel_games.status': 'finished',
				},
			},
			{ $sort: { 'rel_scoreboards.points': -1 } },
			{
				$group: {
					_id: '$rel_scoreboards.game',
					name: { $first: '$name' },
					email: { $first: '$email' },
					player: { $first: '$_id' },
					games: { $first: '$games' },
					points: { $first: '$rel_scoreboards.points' },
				},
			},
			{
				$group: {
					_id: '$player',
					name: { $first: '$name' },
					email: { $first: '$email' },
					points: { $sum: '$points' },
					games: { $first: '$games' },
					wins: { $sum: 1 },
				},
			},
			{ $sort: { wins: -1 } },
		]).exec(function (err, results) {
			return res.status(200).send(results);
		});
	} catch (err) {
		console.log(err);
		return res
			.status(400)
			.send({ error: 'Cannot get scoreboards for players' });
	}
});

router.get('/', async (req, res) => {
	try {
		const games = await Game.find({ status: 'in queue' }).populate(
			'createdBy'
		);
		if (games) {
			return res.send({
				games,
			});
		}
		return res.status(200).send({
			games: null,
		});
	} catch (err) {
		return res.status(400).send({ error: 'Cannot get current games' });
	}
});

router.get('/cards', async (req, res) => {
	const { user, game } = req.query;
	try {
		const round = await Round.findOne({ game: game }).sort({
			createdAt: -1,
		});
		if (round) {
			const cards = await Cards.findOne({
				round: round._id,
				player: user,
			});
			if (cards) {
				res.send({ cards });
			} else {
				res.status(400).send({
					error: 'Cannot get the cards of a player (0)',
				});
			}
		} else {
			res.status(400).send({
				error: 'Cannot get the cards of a player (1)',
			});
		}
	} catch (err) {
		console.log(err);
		res.status(400).send({
			error: 'Cannot get the cards of a player (2)',
		});
	}
});

router.get('/pontuations', async (req, res) => {
	const { game } = req.query;

	try {
		const pontuations = await ScoreBoard.find({ game: game }).populate(
			'player'
		);
		res.send({ pontuations: pontuations });
	} catch (err) {
		res.status(400).send({
			error: 'Cannot get the pontuations',
		});
	}
});

router.get('/rounds', async (req, res) => {
	const { game } = req.query;

	try {
		const rounds = await Round.aggregate([
			{
				$match: {
					game: mongoose.Types.ObjectId(game),
				},
			},
			{
				$lookup: {
					from: 'turns',
					localField: '_id',
					foreignField: 'round',
					as: 'rel_turns',
				},
			},
			{
				$unwind: {
					path: '$rel_turns',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'playedcards',
					localField: 'rel_turns._id',
					foreignField: 'turn',
					as: 'rel_playedcards',
				},
			},
			{
				$unwind: {
					path: '$rel_playedcards',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'rel_turns.winner',
					foreignField: '_id',
					as: 'rel_turn_winner',
				},
			},
			{
				$unwind: {
					path: '$rel_turn_winner',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'rel_playedcards.player',
					foreignField: '_id',
					as: 'rel_turn_players',
				},
			},
			{
				$unwind: {
					path: '$rel_turn_players',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$group: {
					_id: '$rel_turns._id',
					game: { $first: '$game' },
					round: { $first: '$_id' },
					roundNumber: { $first: '$roundNumber' },
					turnNumber: { $first: '$rel_turns.turnNumber' },
					winner: {
						$first: {
							player: '$rel_turn_winner._id',
							name: '$rel_turn_winner.name',
							email: '$rel_turn_winner.email',
						},
					},
					rel_playedcards: {
						$push: {
							player: '$rel_playedcards.player',
							name: '$rel_turn_players.name',
							email: '$rel_turn_players.email',
							card: '$rel_playedcards.card',
						},
					},
				},
			},
			{ $sort: { roundNumber: 1, turnNumber: 1 } },
			{
				$group: {
					_id: '$round',
					turn: { $first: '$_id' },
					game: { $first: '$game' },
					roundNumber: { $first: '$roundNumber' },
					rel_plays: {
						$push: {
							player: '$rel_playedcards.player',
							name: '$rel_playedcards.name',
							email: '$rel_playedcards.email',
							card: '$rel_playedcards.card',
						},
					},
					// turnNumber: { $first: '$rel_turns.turnNumber' },
					winner: {
						$push: {
							player: '$winner.player',
							name: '$winner.name',
							email: '$winner.email',
						},
					},
					// rel_playedcards: {
					// 	$push: {
					// 		player: '$rel_playedcards.player',
					// 		name: '$rel_turn_players.name',
					// 		email: '$rel_turn_players.email',
					// 		card: '$rel_playedcards.card',
					// 	},
					// },
				},
			},
			{ $sort: { roundNumber: 1 } },
		]);
		res.send({ rounds: rounds });
	} catch (err) {
		console.log(err);
		res.status(400).send({
			error: 'Cannot get the rounds of this game',
		});
	}
});

router.get('/turns', async (req, res) => {
	const { round } = req.query;

	try {
		const turns = await Turn.find({ round: round })
			.sort({
				createdAt: 1,
			})
			.populate('winner');
		res.send({ turns: turns });
	} catch (err) {
		res.status(400).send({
			error: 'Cannot get the turns of this round',
		});
	}
});

router.get('/playedCards', async (req, res) => {
	const { turn, round } = req.query;

	try {
		const played_cards = await PlayedCards.find({
			turn: turn,
			round: round,
		}).sort({
			createdAt: 1,
		});
		res.send({ played_cards: played_cards });
	} catch (err) {
		res.status(400).send({
			error: 'Cannot get the played cards of this turn',
		});
	}
});

router.get('/pn', async (req, res) => {
	try {
		let notifications = await Notifications.find().populate('user');
		return res.send({ notifications });
	} catch (err) {
		// console.log(err);
		return res.status(400).send({ error: 'Error pn 1' });
	}
})

router.post('/cards', async (req, res) => {
	const { game, user, card } = req.body;

	try {
		const round = await Round.findOne({ game: game._id }).sort({
			createdAt: -1,
		});
		if (round) {
			const cards_db = await Cards.findOne({
				round: round._id,
				player: user,
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
				let new_cards = await Cards.findOneAndUpdate(
					{
						round: round._id,
						player: user,
					},
					{
						cards: temp,
					},
					{ useFindAndModify: false }
				);

				new_cards = await Cards.findOne({
					round: round._id,
					player: user,
				});

				const turn = await Turn.findOne({ round: round._id }).sort({
					createdAt: -1,
				});

				if (turn) {
					await PlayedCards.create({
						round: round._id,
						turn: turn._id,
						player: user,
						card: [card],
					});

					const players = await GamePlayer.find({
						game: game,
					}).populate('player');
					const total_playedCards = await PlayedCards.find({
						round: round._id,
						turn: turn._id,
					}).sort({ createdAt: 'asc' });

					req.app
						.get('io')
						.to(game._id)
						.emit('card played', game._id, card, user);

					await timeout(1000);
					if (players.length === total_playedCards.length) {
						req.app.get('io').to(game._id).emit('turn finish');

						const winner = getWinner(total_playedCards);

						await Turn.findOneAndUpdate(
							{ round: round._id },
							{ winner: winner.player },
							{ useFindAndModify: false }
						).sort({ createdAt: -1 });

						const winner_player = await User.findOne({
							_id: winner.player,
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

								const new_round = await Round.create({
									game: game,
									roundNumber: round.roundNumber + 1,
								});

								const new_turn = await Turn.create({
									round: new_round._id,
									turnNumber: 1,
								});

								const players = await GamePlayer.find({
									game: game._id,
								}).populate('player');

								if (
									players.length * new_round.roundNumber >
									cards.length
								) {
									await updateMaxScoresWinsAndGames(game);
									await updateRightBets(game);
									await updateEntryWins(game);

									const new_game = await Game.findOneAndUpdate(
										{ _id: game._id },
										{ status: 'finished' },
										{ useFindAndModify: false }
									);
									req.app
										.get('io')
										.to(game._id)
										.emit('game finished');
								} else {
									const selected_cards = cards
										.sort(
											() => Math.random() - Math.random()
										)
										.slice(
											0,
											players.length *
											new_round.roundNumber
										);

									await asyncForEach(
										chunkArrayInGroups(
											selected_cards,
											new_round.roundNumber
										),
										async (v, i) => {
											let temp = await Cards.create({
												round: new_round._id,
												player: players[i].player._id,
												cards: v.sort((a, b) => {
													if (a.index > b.index) {
														return 1;
													}
													return -1;
												}),
											});
										}
									);

									await Game.findOneAndUpdate(
										{
											status: 'in game',
											_id: game._id,
										},
										{ status: 'place bets' },
										{ useFindAndModify: false }
									);

									const temp_game = await Game.findOne({
										status: 'place bets',
										_id: game._id,
									});

									req.app
										.get('io')
										.to(game._id)
										.emit(
											'place bets',
											round.roundNumber + 1
										);
								}
							} else {
								await calculatePontuations(game._id);
								await updateMaxScoresWinsAndGames(game);
								await updateRightBets(game);
								await updateEntryWins(game);

								const temp_game = await Game.findOneAndUpdate(
									{ _id: game._id },
									{ status: 'finished' },
									{ useFindAndModify: false }
								);

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
									player: winner_player,
								}
							).populate('player');

							await Turn.create({
								round: round._id,
								turnNumber: turns.length + 1,
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
							player: user,
						}).populate('player');
						let order = null;
						if (player_played.order == players.length) {
							order = 1;
						} else {
							order = player_played.order + 1;
						}

						const next_player = await GamePlayer.findOne({
							game: game,
							order: order,
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
						error: 'Cannot post the cards of a player (-1)',
					});
				}
			} else {
				res.status(400).send({
					error: 'Cannot post the cards of a player (0)',
				});
			}
		} else {
			res.status(400).send({
				error: 'Cannot post the cards of a player (1)',
			});
		}
	} catch (err) {
		console.log(err);
		res.status(400).send({
			error: 'Cannot post the cards of a player (2)',
		});
	}
});

router.post('/', async (req, res) => {
	const { user } = req.body;
	try {
		const ref = await GamePlayer.findOne({ player: user });
		if (ref) {
			return res.status(400).send({
				error: 'Cannot create a new game while you are in another',
			});
		}
		const game = await Game.create({
			...req.body,
			createdBy: req.body.user,
		});
		const gamePlayer = await GamePlayer.create({
			game: game.id,
			player: user,
			order: 1,
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
			createdAt: -1,
		});
		if (round) {
			const turn = await Turn.findOne({ round: round._id }).sort({
				createdAt: -1,
			});

			const players = await GamePlayer.find({ game: game })
				.sort({
					order: 1,
				})
				.populate('player');

			let temp_played_cards = await PlayedCards.find({
				round: round._id,
				turn: turn._id,
			})
				.sort({ player: 1 })
				.populate('player');

			let bet = [];
			let temp_results = {};
			let played_cards = [];

			await asyncForEach(players, async (p, i) => {
				if (temp_results[p.player._id] === undefined) {
					temp_results[p.player._id] = 0;
				}
				let found = false;
				let instance = null;
				temp_played_cards.forEach((pc, j) => {
					if (String(pc.player._id) === String(p.player._id)) {
						found = true;
						instance = pc;
					}
				});
				if (!found) {
					played_cards.push({
						round: round._id,
						turn: turn._id,
						card: [{ color: 'back', value: 0 }],
						player: p.player,
					});
				} else {
					played_cards.push(instance);
				}
				const temp = await Bet.findOne({
					round: round._id,
					player: p.player._id,
				})
					.sort({ player: 1 })
					.populate('player');
				bet.push(temp);
			});

			// const bet = await Bet.find({ round: round._id })
			// 	.sort({ player: 1 })
			// 	.populate('player');

			const number_of_wins = await Turn.find({ round: round._id }).sort({
				player: 1,
			});

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

router.get('/message', async (req, res) => {
	const { game } = req.query;
	try {
		const messages = await Message.find({ game: game }).populate('player');
		return res.send({ messages });
	} catch (err) {
		return res.status(400).send({ error: 'Cannot get messages' });
	}
});

router.post('/message', async (req, res) => {
	const { game, message, user } = req.body;
	try {
		const new_message = await Message.create({
			game: game,
			player: user,
			message: message,
		});

		req.app.get('io').to(game).emit('new message sended');

		return res.send({ new_message });
	} catch (err) {
		console.log(err);
		return res.status(400).send({ error: 'Error while sending message' });
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
				createdAt: -1,
			});
			const rounds = await Round.find({ game: current_game._id });
			if (round) {
				const bet = await Bet.findOne({
					player: user,
					round: round._id,
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
				game: game,
			});
		}
		return res.send({
			inGame: false,
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
				error: 'Cannot join in a new game while you are in another',
			});
		}
		const players = await GamePlayer.find({ game: req.body.game });
		const gamePlayer = await GamePlayer.create({
			game: req.body.game,
			player: user,
			order: players.length + 1,
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
			createdAt: -1,
		});
		if (round) {
			const turn = await Turn.findOne({ round: round._id }).sort({
				createdAt: -1,
			});
			const played_cards = await PlayedCards.findOne({
				round: round._id,
				turn: turn._id,
			})
				.sort({ createdAt: -1 })
				.populate('player');
			if (played_cards) {
				const order = await GamePlayer.findOne({
					player: played_cards.player._id,
				});
				const players = await GamePlayer.find({ game: game });
				if (order.order == players.length) {
					const next_player = await GamePlayer.find({
						game: game,
						order: parseInt(1),
					}).populate('player');
					return res.send({ player: next_player[0].player });
				} else {
					const next_player = await GamePlayer.find({
						game: game,
						order: parseInt(parseInt(order.order) + 1),
					}).populate('player');
					return res.send({ player: next_player[0].player });
				}
			} else {
				if (round.roundNumber == 1) {
					const next_player = await GamePlayer.find({
						game: game,
						order: 1,
					}).populate('player');
					return res.send({ player: next_player[0].player });
				} else {
					const player_temp = await User.findOne({
						_id: turn.winner,
					});
					if (player_temp) {
						return res.send({ player: player_temp });
					} else {
						const turns = await Turn.find({
							round: round._id,
						}).sort({
							createdAt: -1,
						});
						if (turns[1]) {
							const player_temp2 = await User.findOne({
								_id: turns[1].winner,
							});
							return res.send({ player: player_temp2 });
						} else {
							const rounds = await Round.find({
								game: game,
							}).sort({ createdAt: -1 });
							const new_turn_temp = await Turn.findOne({
								round: rounds[1]._id,
							}).sort({ createdAt: -1 });
							const player_temp3 = await User.findOne({
								_id: new_turn_temp.winner,
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
				error: 'Cannot leave the game if you are not inside it',
			});
		}
		const gamePlayer = await GamePlayer.findOneAndRemove(
			{ player: user },
			{ useFindAndModify: false }
		);
		const id = gamePlayer.game;

		const game_players = await GamePlayer.findOne({ game: id });
		if (!game_players) {
			const game = await Game.findOne({ _id: id });
			if (game.status === 'in queue') {
				await Game.findOneAndDelete({ _id: id });
			} else if (game.status !== 'finished') {
				await Game.findOneAndDelete({ _id: id });
			}
		} else {
			const game = await Game.findOne({ _id: id });
			if (game.status !== 'in queue' && game.status !== 'finished') {
				await Game.findOneAndUpdate(
					{ _id: id },
					{ status: 'canceled' },
					{ useFindAndModify: false }
				);
				req.app.get('io').to(id).emit('game finished');
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
			createdBy: user,
		});
		if (!current) {
			return res.status(400).send({
				error:
					'Cannot start the game if you are not the leader or if the game is not in queue',
			});
		}

		const players = await GamePlayer.find({
			game: current._id,
		}).populate('player');

		const round = await Round.create({ game: current._id, roundNumber: 1 });
		const turn = await Turn.create({ round: round._id, turnNumber: 1 });

		const selected_cards = cards
			.sort(() => Math.random() - Math.random())
			.slice(0, players.length * 1);

		await asyncForEach(
			chunkArrayInGroups(selected_cards, 1),
			async (v, i) => {
				let temp = await Cards.create({
					round: round._id,
					player: players[i].player._id,
					cards: v.sort((a, b) => {
						if (a.index > b.index) {
							return 1;
						}
						return -1;
					}),
				});
			}
		);

		await Game.findOneAndUpdate(
			{
				status: 'in queue',
				createdBy: user,
			},
			{ status: 'place bets' },
			{ useFindAndModify: false }
		);

		const game = await Game.findOne({
			status: 'place bets',
			createdBy: user,
		});

		req.app.get('io').to(game._id).emit('place bets', 1);

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
				error: 'Cannot stop the game if you are not the leader',
			});
		}
		const game = await Game.findOneAndUpdate({
			status: 'stop',
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
			_id: game,
		});
		if (current_game) {
			const round = await Round.findOne({ game: current_game._id }).sort({
				createdAt: -1,
			});
			if (round) {
				const bet = await Bet.findOne({
					round: round._id,
					player: user,
				});
				if (!bet) {
					const new_bet = await Bet.create({
						round: round._id,
						player: user,
						value: value,
					});
					const bets = await Bet.find({ round: round._id });
					const players = await GamePlayer.find({
						game: game,
					}).populate('player');
					if (bets && players) {
						if (bets.length == players.length) {
							await Game.findOneAndUpdate(
								{
									status: 'place bets',
									_id: game,
								},
								{ status: 'in game' },
								{ useFindAndModify: false }
							);

							req.app.get('io').to(game).emit('start round');
							if (round.roundNumber === 1) {
								const player = await GamePlayer.findOne({
									game: game,
									order: 1,
								}).populate('player');
								req.app
									.get('io')
									.to(game)
									.emit('new turn', player.player);
							} else {
								const last_round = await Round.find({
									game: game,
									roundNumber: round.roundNumber - 1,
								});

								const last_turn = await Turn.findOne({
									round: last_round,
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
						error: 'You have already a bet to this round',
					});
				}
			} else {
				return res.status(400).send({
					error: 'Is not possible place a bet to this round',
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

module.exports = (app) => app.use('/game', router);
