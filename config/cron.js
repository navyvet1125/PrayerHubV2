const User = require('../models/user');
const Pledge = require('../models/pledge');
module.exports =  ()=> {
	User.find({}).select('-_id name location avatar')
	.then(function(users){
		console.log('----------------------------------------------------------');
		console.log(`At ${new Date().toTimeString()}, there are currently ${users.length} users`);
		console.log(users);
		return Pledge.find({});
	})
	.then(function(pledges){
		console.log('----------------------------------------------------------');
		console.log(pledges);
		console.log('----------------------------------------------------------');
	})
};
