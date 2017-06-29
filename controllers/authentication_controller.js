const User = require('../models/user');
const jwt = require('jsonwebtoken');
const EMAIL_IN_USE='Email is in use!';
const MISSING_PARAMETERS='One or more parameters are missing!';
const JWT_SECRET = process.env.PRAYER_HUB_JWT_SECRET;
const controller = {};

// Function for signing the user generated token
const sign = (user) => {
	const token = jwt.sign(
	    {
	      sub: user._id,
	      role: user.role
	    },
	    JWT_SECRET,
	    {
	    	algorithm: 'HS512'
	    }
	 );
	return ({token});
};

//creates a new user
controller.signup = (req,res, next) => {
	// If an important parameter is missing, throw an error.
	const {email, userName, password, location, name, role} = req.body;
	User.findByEmail(email).select('email -_id')
	.then((user) => {
		
		// Check to see if email is already in use.
		if(user) throw Error (EMAIL_IN_USE);
		// Check to make sure all parameters are present
		if(!email || !userName || !password || !location || !name) throw Error(MISSING_PARAMETERS);
	})
	.then(() =>{

		const newUser = new User()
		Object.assign(newUser, req.body);
		newUser.lastSignIn = new Date;
		return newUser.save()
	})
	.then((user) => {
		//if create was successful
		res.status(200).send(sign(user));
	})
	.catch((err) => {
		//error handling
		if (err.message===EMAIL_IN_USE || err.message===MISSING_PARAMETERS ) res.status(422).send({message: err.message});
		else res.status(500).send({message: err.message});
	});

};
// Sign in existing user by generating a new token
controller.signin = (req,res,next) => {
	res.status(200).send(sign(req.user));
};

// Shows the signed in User
controller.signedUser = (req,res) => {
	res.send(req.user);
};

module.exports = controller;