var mongoose = require('mongoose');
var Cause = require('./cause');
var Pledge = require('./pledge');
var Group = require('./group');


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
	// User's password
	password: { type: String, required: true, bcrypt: true },
	// Picture url for the user's avatar
	avatar: {type: String, default: 'images/default.jpg'},
	// User's email address.  Email address is encrypted for user's protection.
	email: {type: String, unique:true, required: true},
	// User's location
	location: { 
		city: String,
		state: String,
		country: String,
		lat: Number,
		lng:Number
	},
	// User status.  Default status is online because when the user is signing in, they would be considered online.
	// User status can be updated whenever a user logs out.
	status: {type: String, enum:[
		'offline',
		'online',
		'hidden',
		'idle',
		'praying'
	], default: 'online'},
	// When the user was created.
	created: {type: Date, default: Date.now},
	// Last time the user updated their information.
	updated: Date,
	// Last time the user signed in.
	lastSignIn: Date,
	// List of friends of the user.
	friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	// List of causes made by the user.
	causes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Cause'}],
	// List of pledges made by the user.
	pledges: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pledge'}],
	// List of groups the user is in.
	groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}],
	// if linked, token for fb login.
	fb_access_token: String,
	// if linked, token for google login.
	google_access_token: String,
	// How many hours the user has completed
	hoursCompleted: {type: Number, default: 0},
	// User's biography
	bio: String
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

userSchema.statics.findByUserName = function (userName, cb){
	return this.findOne({userName: userName}, cb)
};

var User = mongoose.model('User', userSchema);

module.exports = User;