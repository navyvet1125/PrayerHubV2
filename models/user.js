var mongoose = require('mongoose');
var Cause = require('./cause');
var Pledge = require('./pledge');


var userSchema = new mongoose.Schema({
	// New is for new users, or people who have either only recently signed up 
	// and/or have not made enough pledges.
	// Contrib is for people who have sent prayer or meditation  a certain number of times
	// Contributors are able to create new causes.
	// Admin users can add or remove anyone, change anyone's role, and can add,
	// approve, or remove causes.  
	role: {type: String, enum: [
	    'new',
	    'contrib', 
	    'admin' 
	], default:'new'},
	// Name object holds given name, middle name, and last name.
	name: {
		given: {type: String, required:true},
		middle: {type: String},
		family: {type: String, required:true}
	},
	// UserName used for loging in.  
	userName: {type: String, unique:true, required: true},
	// Picture url for the user's avatar
	avatar: String,
	// User's email address.  Email address is encrypted for user's protection.
	email: {type: String, unique:true, required: true, bcrypt: true},
	// User's location
	location: { 
		city: String,
		state: String,
		country: String,
		lat: Number,
		lng:Number
	},
	// When the user was created.
	created: {type: Date, default: Date.now},
	// Last time the user updated their information.
	updated: Date,
	// Last time the user signed in.
	lastSignIn: Date,
	// List of causes made by the user.
	causes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Cause'}],
	// List of pledges made by the user.
	pledges: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pledge'}],
	fb_access_token: String,
	google_access_token: String,
	bio: String,
});
//Add encrypted fields
userSchema.plugin(require('mongoose-bcrypt'));

//search users by role
userSchema.statics.findByRole = function(role, cb){
	return this.find({role: role}, cb);
};
userSchema.statics.findByEmail = function(email, cb){
	return this.findOne({email: email}, cb);
};

var User = mongoose.model('User', userSchema);

module.exports = User;