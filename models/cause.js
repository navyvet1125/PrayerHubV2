var mongoose = require('mongoose');
var User = require('./user');
var Pledge = require('./pledge');
var Like = require('./like');
var Comment = require('./comment');

var causeSchema = new mongoose.Schema({
	title: {type: String, required: true},
	body: {type: String, required: true},
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	type:{type: String, enum: [
	    'general',
	    'personal'
	], default:'general'},
	image:{type: String, default:'images/default.jpg'},
	category: {type: String, default: 'none'},
	created:{type: Date, default: Date.now},
	updated:Date,
	expiration: {type: Date, default:null},
	pledges:[{type: mongoose.Schema.Types.ObjectId, ref: 'Pledge'}],
	likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Like'}],
	comments:[{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
	approved: {type: Boolean, default: false}
});
causeSchema.plugin(require('mongoose-autopopulate'));

causeSchema.statics.findByCategory = function(category, cb){
	return this.find({category: category}, cb);
};

causeSchema.statics.findByCreator = function(creator, cb){
	return this.find({creator: creator}, cb);
};

var Cause = mongoose.model('Cause', causeSchema);

module.exports = Cause;