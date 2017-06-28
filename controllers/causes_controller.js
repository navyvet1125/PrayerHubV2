const User = require('../models/user');
const Cause = require('../models/cause');
const Pledge = require('../models/pledge');
const controller ={};

controller.index = (req, res, next) => {
	// Setting a limit on how many items are returned.  If a specific limit is not stated then the default is 20.
	const limit = parseInt(req.query.limit || 20);
	// query will return cause title, date created, creator name,category, image, and expiration date
	const query = Cause.find()
		.select('title created creator category image expiration')
		.lean()
		.populate('creator', 'name')
		.limit(limit);

	//find and return all pledges linked to a specific cause
	query.exec()
	.then((causes) => {
		//if it worked
		res.status(200).send(causes);
	})
	.catch((err) =>{
		//if it didn't work
		console.log(err);
		res.status(500).send(err);
	});
};

controller.create = (req,res) => {
	let dataCause;
	
	//creates a new cause
	const newCause = new Cause();
	Object.assign(newCause, req.body);
	newCause.creator = req.user._id;
	
	newCause.save()
	.then((cause) => {
		dataCause = cause;
		return User.findById(newCause.creator);
	})
	.then((user) => {
		user.causes.push(dataCause);
		return user.save();
	})
	.then(() => {
		//if create was successful
		res.status(200).send(dataCause);
	})
	.catch((err) => {
		//error handling
		res.status(500).send(err);
	});
};

controller.show = (req,res) => {
	//Find and show cause if they exist
	Cause.findById(req.params.id)
	.then((cause) => {
		if(cause)res.status(200).send(cause);
		else res.status(404).send({status: 404, message:'Cause not found!'});
	})
	.catch((err) => {
		//error handling
		res.status(500).send(err);
	});
};

controller.update = (req,res) => {
	//Find and update a cause
	Cause.findById(req.params.id)
		.then((cause) => {
			// assign properties from req.body and then save the cause.
			Object.assign(cause, req.body);
			return cause.save();
		})
		.then((cause) => {
			if(cause)res.status(200).send(cause);
			//error handling
			else res.status(404).send({status: 404, message:'Cause not found!'});
		})
		.catch((err) => {
			//error handling
			res.status(500).send(err);
		});
};

controller.delete = (req,res) => {
	//find and removes cause
	Cause.findByIdAndRemove(req.params.id)
	.then((cause) => {
		//status update based on whether or not the cause exists
		if(cause){
			Pledge.find({ cause:cause.id }).remove().exec()
			.then((pledges) => {
				res.status(200).send({status: 200, message:'Cause Successfully Deleted!'});
			}).catch((err) => {
				//error handling
				res.status(500).send(err);
			});
		}
		else res.status(404).send({status: 404, message:'Cause not found!'});
	})
	.catch((err) => {
		//error handling
		res.status(500).send(err);
	});

};

controller.showPledges = (req,res) => {
	const limit = parseInt(req.query.limit || 20);
	// query will return when, how long, and who made the pledge, with a default limit of 20.
	const query = Cause.findById(req.params.id)
		.select('pledges -_id')
		.populate(
			{
				path: 'pledges', 
				populate: 
				{
					path:'user', 
					select:'name userName-_id'
				}
			})
		.limit(limit);

	//find and return all pledges linked to a specific cause
	query.exec()
		.then((pledges) => {
			if(pledges)res.status(200).send(pledges);
			//error handling
			else res.status(404).send({status: 404, message:'Cause not found!'});
		})
		.catch((err) => {
			//error handling
			res.status(500).send(err);
		});
};

controller.addPledge = (req, res) => {
	let dataPledge;
	console.log(req.params.id);
	Pledge.create({
		user: req.body.user,
		cause: req.params.id,
		pledgeAt: req.body.pledgeAt,
		howLong: req.body.howLong,
	})
	.then((pledge) => {
		dataPledge = pledge;
		return Cause.findById(pledge.cause);
	})
	.then((cause) => {
		cause.pledges.push(dataPledge._id);
		return cause.save();
	})
	.then(() => {
		return User.findById(dataPledge.user);
	})
	.then((user) => {
		user.pledges.push(dataPledge._id);
		return user.save(); 
	})
	.then(() => {
		res.status(200).send(dataPledge);
	})
	.catch((err) => {
		res.status(500).send(err);
	})
};

controller.showUserPledge = (req, res) => {
	Pledge.findOneById(req.params.id)
		.then((pledge) => {
			if(pledge)res.status(200).send(pledge);
			//error handling
			else res.status(404).send({status: 404, message:'Pledge not found!'});
		})
		.catch((err) => {
			//error handling
			res.status(500).send(err);
		});
};

controller.deletePledge = (req, res) => {
	Pledge.findByIdAndRemove(req.params.id)
		.then((pledge) => {
			res.status(200).send({status: 200, message:'Pledge Successfully Deleted!'});
		}).catch((err) => {
			//error handling
			res.status(500).send(err);
		});	
};

module.exports = controller;