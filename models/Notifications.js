const mongoose = require('../database');

const NotificationsSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	token: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Notifications = mongoose.model('Notifications', NotificationsSchema);

module.exports = Notifications;
