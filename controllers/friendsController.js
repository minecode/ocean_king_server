const express = require('express');
const User = require('../models/User');
const Friends = require('../models/Friends');
const router = express.Router();

router.post('/', async (req, res) => {
  const { user1, user2, status } = req.body;

  try {
    let relation = await Friends.findOne({ user1: user1, user2: user2 });
    if (relation) {

      relation = await relation.update({
        status: status
      })


    } else {
      relation = await Friends.create({
        user1: user1,
        user2: user2,
        status: status
      })


      return res.send({ relation: relation });
    }
  } catch (err) {
    // console.log(err);
    return res.status(400).send({ error: 'Error friends 1' });
  }
});

router.get('/users', async (req, res) => {
  const { user } = req.body;

  try {


  } catch (err) {
    // console.log(err);
    return res.status

  }
});

router.get('/', async (req, res) => {
  const { user, status } = req.body;

  try {
    let relations = await Friends.find({
      $and: [
        {
          $or: [
            { user1: user },
            { user2: user }
          ]
        },
        { status: status }
      ]
    });

    if (relations) {
      return res.send({ relations: relations });
    } else {
      return res.send({ relations: [] });
    }
  } catch (err) {
    // console.log(err);
    return res.status(400).send({ error: 'Error friends 2' });
  }
});

module.exports = (app) => app.use('/friends', router);
