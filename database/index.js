const mongoose = require('mongoose');
mongoose.connect(
	'mongodb://fhenriques:fabiomcH97@ds155606.mlab.com:55606/heroku_44kcv6lx',
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);
mongoose.Promise = global.Promise;

module.exports = mongoose;
