const User = require('../models/user');
const Pledge = require('../models/pledge');
const WEEK_LENGTH = 604800000;
const DAY_LENGTH = 86400000;
const FIVE_MINUTES = 300000;
module.exports =  ()=> {
// Tasks for Cron Job to complete, currently every 15 minutes.
	User.find({}).select('-_id name location avatar created email')
	.then(function(users){
		console.log('----------------------------------------------------------');
		console.log(`At ${Date.now()}, there are currently ${users.length} users`);
		users.forEach((user)=>{
			console.log(`Name: ${user.name.given} ${user.name.family}`);
			console.log(`Email: ${user.email}`);
			console.log(`Member Since: ${user.created}`);
			console.log('---------------------------------');
		});
		console.log('----------------------Reminders---------------------------');
		return Pledge.find({})
		.select('cause user pledgeAt reminder howLong -_id')
		.where('reminder').gt(Date.now()-(FIVE_MINUTES*3)).lt(Date.now()+(FIVE_MINUTES*3))
		.populate(
		{
			path: 'cause',
			select: 'title -_id' 
		})
		.populate(
		{
			path: 'user',
			select: 'name email -_id'
		})

	})
	.then(function(pledges){
		console.log(pledges);
		console.log('-----------------------Pledges----------------------------');
		return Pledge.find({})
		.select('cause user pledgeAt reminder howLong -_id')
		.where('pledgeAt').gt(Date.now()-(FIVE_MINUTES*3)).lt(Date.now()+(FIVE_MINUTES*3))
		.populate(
		{
			path: 'cause',
			select: 'title -_id' 
		})
		.populate(
		{
			path: 'user',
			select: 'name email -_id'
		})

	})
	.then(function(pledges){
		console.log(pledges);
		console.log('----------------------------------------------------------');
	})
};
