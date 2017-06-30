var mongoose = require('mongoose');
var User = require('./user');


var groupSchema = new mongoose.Schema({
	// A model for groups.  
	name: {type: String, required: true, unique: true},								// A unique name for the group.
	email: {type: String, required: true},											// An email address for the group.
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},	// Who created the group.
	members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],					// Who's in the group.
	created: {type: Date, default: Date.now},										// When the group was created.
	memberCount: {type: Number, default: 0}											// A count of the number of members in the group.
});


groupSchema.statics.findByCreator = function(creator, cb){
	return this.find({creator: creator}, cb);
};

groupSchema.pre('save', function (next) {
	// Updates memberCount if number of members is different than the member count.
	if(this.members.length !== this.memberCount) this.memberCount = this.members.length;
	next();
});

var Group = mongoose.model('Group', groupSchema);
module.exports = Group;
