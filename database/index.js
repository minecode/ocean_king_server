const mongoose = require('mongoose');
//mongoose.connect(
//	'mongodb://REVOKED_fhenriques:fabiomcH97@ds155606.mlab.com:55606/heroku_44kcv6lx',
//	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
//);
mongoose.connect('mongodb+srv://fhenriques:fabiomcH97@cluster-44kcv6lx.r0xyz.mongodb.net/heroku_44kcv6lx?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
}, () => {
	console.log('Connected to DB!')
        console.log(mongoose.connection.readyState);
})
mongoose.Promise = global.Promise;
module.exports = mongoose;
