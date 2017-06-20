var mongoose = require('mongoose');
var User = require('./user');
var Pledge = require('./pledge');
var Like = require('./like');

var causeSchema = new mongoose.Schema({
	title: String,
	body: String,
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	type:{type: String, enum: [
	    'general',
	    'personal'
	], default:'general'},
	category: String,
	created:{type: Date, default: Date.now},
	updated:Date,
	expiration: {type: Date, default:null},
	pledges:[{type: mongoose.Schema.Types.ObjectId, ref: 'Pledge'}],
	likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Like'}],
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