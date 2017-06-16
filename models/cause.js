var mongoose = require('mongoose');
var User = require('./user');
var Pledge = require('./pledge');

var causeSchema = new mongoose.Schema({
	title: String,
	body: String,
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true},
	category: String,
	createdAt: Date,
	expiration: {type: Date, default:null},
	pledges:[{type: mongoose.Schema.Types.ObjectId, ref: 'Pledge'}],
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