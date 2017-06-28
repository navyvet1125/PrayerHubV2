var User = require('../models/user');
var Pledge = require('../models/pledge');
var controller ={};
var userCheck = require('./user_check');
controller.index = function(req, res) {
	//Returns listing of all users
	User.find({}).select('name avatar userName -_id')
		.then(function(users){
			//if it worked
			res.status(200).send(users);
		})
		.catch(function(err){
			//if it didn't
			res.status(500).send(err);
		});
};

controller.show = function(req,res){
	//Find and show user if they exist
	// Restrict what data is sent.
	User.findOne({userName: req.params.username}).select('-password -email -fb_access_token -google_access_token -_id')
	.then(function(user){
		if(user)res.status(200).send(user);
		else res.status(404).send({status: 404, message:'User not found!'});
	})
	.catch(function(err){
		//error handling
		res.status(500).send(err);
	});
};

controller.update = function(req,res){
	//Find and update a user
	var dataUser = req.body;
	User.findById(req.params.id)
	.then(function(user){
		//Update only what is applicable
		if(dataUser.name) user.name = dataUser.name;
		if(dataUser.email) user.email = dataUser.email;
		if(dataUser.role) user.role = dataUser.role;
		if(dataUser.password) user.password = dataUser.password;
		if(dataUser.location) user.location = dataUser.location;
		if(dataUser.bio) user.bio = dataUser.bio;
		user.updated = new Date;
		return user.save();
	})
	.then(function(user){
		if(user)res.status(200).send(user);
		//error handling
		else res.status(404).send({status: 404, message:'User not found!'});
	})
	.catch(function(err){
		//error handling
		res.status(500).send(err);
	});
};

controller.delete = function(req,res){
	//find and removes user
	User.findByIdAndRemove(req.params.id)
	.then(function(user){
		//status update based on whether or not the user exists
		if(user)res.status(200).send({status: 200, message:'User Successfully Deleted!'});
		else res.status(404).send({status: 404, message:'User not found!'});
	})
	.catch(function(err){
		//error handling
		res.status(500).send(err);
	});

};

controller.showPledges = function(req,res){
	// Returns a listing of pledges made by a given user that includes cause's title and username of the cause's creator
	var query = User.findOne({userName: req.params.username})
		.select('pledges -_id')
		.populate(
			{
				path: 'pledges', 
				select:'-_id -user', 
				populate: 
				{
					path:'cause', 
					select:'title creator', 
					populate: 
					{
						path:'creator',
						select:'userName -_id'
					}
				}
			});
	//Check to see if the user is supposed to be in prayer/meditation
	// userCheck(req.params.username)
	// .then(function(result){
	// 	console.log(result);
	// });
	query.exec()
	.then(function(pledges){
		if(pledges) res.status(200).send(pledges);
		else res.status(404).send({status: 404, message:'User not found!'})
	})
	.catch(function(err){
		//error handling
		res.status(500).send(err);
	});
};

controller.showCauses = function(req,res){
	// Returns a listing of causes with title, when created, if approved, and who username of the cause's creator.
	var query = User.findOne({userName: req.params.username})
		.select('causes -_id')
		.populate(
			{
				path: 'causes', 
				select: '-body -_id -pledges', 
				populate: 
				{
					path:'creator', 
					select:'userName -_id'
				}
			});

	query.exec()
	.then(function(causes){
		if(causes) res.status(200).send(causes);
		else res.status(404).send({status: 404, message:'User not found!'})
	})
	.catch(function(err){
		//error handling
		res.status(500).send(err);
	});
};

module.exports = controller;