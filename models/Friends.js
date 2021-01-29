const mongoose = require('../database');
const Friend = require('./Friend');

const FriendsSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    required: true,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Friends = mongoose.model('Friends', FriendsSchema);

module.exports = Friends;
