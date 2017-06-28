const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Local Strategy section
const localOptions = {usernameField: 'userName'};
const localLogin = new LocalStrategy(localOptions, (userName, password, done)=>{
	User.findOne({userName})
	.then((user)=> {
		if(!user) return done(null, false);
	 	user.verifyPassword(password)
	 	.then((result)=>{
	 		if(result) {
	 			return done(null, user);
	 		} else {
	 			return done(null, false);
	 		}
	 	})
	 	.catch((err)=>{
	 		return done(err);
	 	})
	})
	.catch((err)=>{
		return done(err);
	})
});


//JWT Strategy section
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: process.env.PRAYER_HUB_JWT_SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) =>{
	// Check if user exists
	User.findById(payload.sub).select('-password')
	.then((user)=> {
		if(user) {
			// If the user exists
			done(null, user);
		} else {
			// If the user doesn't exist
			done(null, false);
		}
	})
	.catch((err)=>{
		return done(err, false);
	})
});
passport.use(jwtLogin);
passport.use(localLogin);