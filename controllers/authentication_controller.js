const User = require('../models/user');
const token = require('./tokens_controller');
const controller = {};
const EMAIL_IN_USE='Email is in use!';
const MISSING_PARAMETERS='One or more parameters are missing!';

controller.signup = (req,res, next) => {
	//creates a new user
	const dataUser = req.body;
	const email = dataUser.email;
	const userName = dataUser.userName;
	const password = dataUser.password;
	const location = dataUser.location;
	const name = dataUser.name;
	const role = dataUser.role;
	// If an important parameter is missing, throw an error.
	// Check to see if email is already in use.
	User.findByEmail(email).select('email -_id')
	.then((user) => {
		if(user) throw Error (EMAIL_IN_USE);
		if(!email || !userName || !password || !location || !name) throw Error(MISSING_PARAMETERS);
	})
	.then(() =>{

		const newUser = new User(
		{
			email,
			password,
			role,
			userName,
			name,
			location,
			lastSignIn: new Date
		});
		return newUser.save()
	})
	.then((user) => {
		//if create was successful
		res.status(200).send(token.sign(user));
	})
	.catch((err) => {
		//error handling
		if (err.message===EMAIL_IN_USE || err.message===MISSING_PARAMETERS ) res.status(422).send({message: err.message});
		else res.status(500).send({message: err.message});
	});

};
controller.signin = (req,res,next) => {
	res.status(200).send(token.sign(req.user));
};


controller.signedUser = (req,res) => {
	console.log(req.user);
	res.send(req.user);
};

module.exports = controller;