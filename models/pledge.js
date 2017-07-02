var mongoose = require('mongoose');
var User = require('./user');
var Cause = require('./cause');

var pledgeSchema = new mongoose.Schema({
	//The user who made the pledge
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, 
	//The cause the user made the pledged for.
	cause: {type: mongoose.Schema.Types.ObjectId, ref: 'Cause', required: true}, 
	//When the pledge was made
	createdAt:{type: Date, default: Date.now}, 
	//Date and time to be pledged
	pledgeAt: {type: Number, default: Date.now()},  
	//How long the pledge is for
	howLong: {type: Number, default: 100000},
	//Time to send a reminder
	reminder: {type: Number, default: 0},
	// Whether the pledge has been completed or not
	completed: {type: Boolean, default: false }
});

pledgeSchema.statics.findByCause = function(cause, cb){
	return this.find({cause: cause}, cb);
};

var Pledge = mongoose.model('Pledge', pledgeSchema);

module.exports = Pledge;