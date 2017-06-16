var mongoose = require('mongoose');
var User = require('./user');


var likeSchema = new mongoose.Schema({
	// A model for likes.  
	subject: {type: mongoose.Schema.Types.ObjectId, required: true},				//what is being liked
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},	//Who generated the like.
	created: {type: Date, default: Date.now()},										//When the like was generated.
});


likeSchema.statics.findByCreator = function(creator, cb){
	return this.find({creator: creator}, cb);
};

likeSchema.statics.findBySubject = function(subject, cb){
	return this.find({subject: subject}, cb);
};

var Like = mongoose.model('Like', likeSchema);
module.exports = Like;
