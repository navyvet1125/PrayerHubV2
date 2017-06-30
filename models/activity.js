var mongoose = require('mongoose');
var User 	 = require('./user');
var Comment = require('./comment');
var Like = require('./like');

var activitySchema = new mongoose.Schema({
	//New information for the news feeds.
	//Date includes when the  activity was created,
	//the profile picture of the person who the activity tracks,
	//the title of the activity,
	//the body of the activity,
	//and on whose feeds the activity will post.
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
	created: {type: Date, default: Date.now},
	name: String,
	picture: String,
	title: String,
	body: String,
	comments:[{type: mongoose.Schema.Types.ObjectId, ref: 'Comment', autopopulate: true}],
	likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Like', autopopulate: true}],
	receivers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});
// Plugin to automatically populate a field
activitySchema.plugin(require('mongoose-autopopulate'));

var Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;