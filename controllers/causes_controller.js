var User = require('../models/user');
var Cause = require('../models/cause');
var Pledge = require('../models/pledge');
var controller ={};

controller.index = function(req, res, next) {
	// Setting a limit on how many items are returned.  If a specific limit is not stated then the default is 20.
	var limit = parseInt(req.query.limit || 20);
	var query;
	// query will return cause title, date created, creator name,category, image, and expiration date
	query = Cause.find().select('title created creator category image expiration').lean().populate('creator', 'name').limit(limit);

	//find and return all pledges linked to a specific cause
	query.exec()
	.then(function(causes){
		//if it worked
		res.status(200).send(causes);
	})
	.catch(function(err){
		//if it didn't work
		console.log(err);
		res.status(500).send(err);
	});
};

controller.create = function(req,res){
	//creates a new cause
	var dataCause;
	var newCause = new Cause();
	newCause.title = req.body.title;
	newCause.body = req.body.body;
	newCause.creator = req.body.creator;
	newCause.category =req.body.category;
	if(req.body.type) newCause.type = req.body.type;
	if(req.body.image) newCause.image = req.body.image;
	if(req.body.category) newCause.category = req.body.category;
	if(req.body.expiration) newCause.expiration = req.body.expiration;
	newCause.save()
	.then(function(cause){
		dataCause = cause;
		return User.findById(newCause.creator);
	})
	.then(function(user){
		user.causes.push(dataCause);
		return user.save();
	})
	.then(function(){
		//if create was successful
		res.status(200).send(dataCause);
	})
	.catch(function(err){
		//error handling
		res.status(500).send(err);
	});
};

controller.show = function(req,res){
	//Find and show cause if they exist
	Cause.findById(req.params.id)
	.then(function(cause){
		if(cause)res.status(200).send(cause);
		else res.status(404).send({status: 404, message:'Cause not found!'});
	})
	.catch(function(err){
		//error handling
		res.status(500).send(err);
	});
};

controller.update = function(req,res){
	//Find and update a cause
	Cause.findById(req.params.id)
		.then(function(cause){
			if(req.body.title) newCause.title = req.body.title;
			if(req.body.body) newCause.body = req.body.body;
			if(req.body.category) newCause.category =req.body.category;
			if(req.body.type) newCause.type = req.body.type;
			if(req.body.image) newCause.image = req.body.image;
			if(req.body.category) newCause.category = req.body.category;
			if(req.body.expiration) newCause.expiration = req.body.expiration;
			return cause.save();
		})
		.then(function(cause){
			if(cause)res.status(200).send(cause);
			//error handling
			else res.status(404).send({status: 404, message:'Cause not found!'});
		})
		.catch(function(err){
			//error handling
			res.status(500).send(err);
		});
};

controller.delete = function(req,res){
	//find and removes cause
	Cause.findByIdAndRemove(req.params.id)
	.then(function(cause){
		//status update based on whether or not the cause exists
		if(cause){
			Pledge.find({ cause:cause.id }).remove().exec()
			.then(function(pledges){
				res.status(200).send({status: 200, message:'Cause Successfully Deleted!'});
			}).catch(function(err){
				//error handling
				res.status(500).send(err);
			});
		}
		else res.status(404).send({status: 404, message:'Cause not found!'});
	})
	.catch(function(err){
		//error handling
		res.status(500).send(err);
	});

};

controller.showPledges = function(req,res){
	var limit = parseInt(req.query.limit || 20);
	var query;
	// query will return when, how long, and who made the pledge, with a default limit of 20.
	query = Cause.findById(req.params.id)
		.select('pledges -_id')
		.populate({path: 'pledges', populate: {path:'user', select:'name userName-_id'}})
		.limit(limit);

	//find and return all pledges linked to a specific cause
	query.exec()
		.then(function(pledges){
			if(pledges)res.status(200).send(pledges);
			//error handling
			else res.status(404).send({status: 404, message:'Cause not found!'});
		})
		.catch(function(err){
			//error handling
			res.status(500).send(err);
		});
};

controller.addPledge = function(req, res){
	var dataPledge;
	console.log(req.params.id);
	Pledge.create({
		user: req.body.user,
		cause: req.params.id,
		pledgeAt: req.body.pledgeAt,
		howLong: req.body.howLong,
	})
	.then(function(pledge){
		dataPledge = pledge;
		return Cause.findById(pledge.cause);
	})
	.then(function(cause){
		cause.pledges.push(dataPledge._id);
		return cause.save();
	})
	.then(function(){
		return User.findById(dataPledge.user);
	})
	.then(function(user){
		user.pledges.push(dataPledge._id)
		if(!req.body.pledgeAt) user.praying = true;
		return user.save(); 
	})
	.then(function(){
		res.status(200).send(dataPledge);
	})
	.catch(function(err){
		res.status(500).send(err);
	})
};

module.exports = controller;
