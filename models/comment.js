var mongoose = require('mongoose');
var User = require('./user');


var commentSchema = new mongoose.Schema({
	// A model for comments.  
	subject: {type: mongoose.Schema.Types.ObjectId, required: true},				//what is being commented on
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},	//Who created the comment.
	created: {type: Date, default: Date.now()},										//When the comment was created.
	modified: Date,																	//When the comment was modified.
	likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],  					//People who like the comment.
	body: String,																	//The body of the comment.
	isReply: {type: Boolean, default: false}										//Is this comment a reply to an earlier comment?
});

// Plugin for making comments able to be children of other comments.
commentSchema.plugin(require('mongoose-materialized'));

commentSchema.statics.findByCreator = function(creator, cb){
	return this.find({creator: creator}, cb);
};

commentSchema.statics.findBySubject = function(subject, cb){
	return this.find({subject: subject}, cb);
};

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
