var mongoose = require('mongoose');
var User = require('./user');
var Cause = require('./cause');

var pledgeSchema = new mongoose.Schema({
	//The user who made the pledge
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
	//The cause the user made the pledged for.
	cause: {type: mongoose.Schema.Types.ObjectId, ref: 'Cause'}, 
	//When the pledge was made
	createdAt: Date, 
	//Date and time to be pledged
	pledgeAt: Date,  
	//How long the pledge is for
	howLong: Number,
	// Whether the pledge has been completed or not
	completed: Boolean 
});

pledgeSchema.plugin(require('mongoose-autopopulate'));
pledgeSchema.statics.findByCause = function(cause, cb){
	return this.find({cause: cause}, cb);
};

var Pledge = mongoose.model('Pledge', pledgeSchema);

module.exports = Pledge;