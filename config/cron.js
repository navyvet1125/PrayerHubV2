const User = require('../models/user');
const Pledge = require('../models/pledge');
const WEEK_LENGTH = 604800000;
const DAY_LENGTH = 86400000;
const FIVE_MINUTES = 300000;
module.exports =  ()=> {
// Tasks for Cron Job to complete, currently every 15 minutes.
Pledge.find({})
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
	.then(function(pledges){
		console.log('----------------------Reminders---------------------------');
		pledges.map((pledge)=>{
			console.log(pledge.user.email);
			console.log(`Hi, ${pledge.user.name.given}!`);
			console.log(`Just a quick reminder that you will be pledging time for ${pledge.cause.title} on ${new Date(pledge.pledgeAt)}.`);
			// console.log(pledge.pledgeAt);

		});
		return Pledge.find({})
		.select('cause user pledgeAt reminder howLong -_id')
		.where('pledgeAt').gt(Date.now()-(FIVE_MINUTES*3)).lt(Date.now()+(FIVE_MINUTES*3))
		.where('reminder').gt(0)
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
		console.log('-----------------------Pledges----------------------------');
		pledges.map((pledge)=>{
			console.log(pledge.user.email);
			console.log(`Hi, ${pledge.user.name.given}!`);
			console.log(`You are scheduled to begin your pledge for ${pledge.cause.title} on ${new Date(pledge.pledgeAt)}.`);

		});
		console.log('----------------------------------------------------------');
	})
};
