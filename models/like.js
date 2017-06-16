var mongoose = require('mongoose');
var User = require('./user');


var likeSchema = new mongoose.Schema({
	// A model for comments.  
	subject: {type: mongoose.Schema.Types.ObjectId, required: true},				//what is being commented on
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},	//Who created the comment.
	created: {type: Date, default: Date.now()},										//When the comment was created.
});


likeSchema.statics.findByCreator = function(creator, cb){
	return this.find({creator: creator}, cb);
};

likeSchema.statics.findBySubject = function(subject, cb){
	return this.find({subject: subject}, cb);
};

var Like = mongoose.model('Like', likeSchema);
module.exports = Like;
