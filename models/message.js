var mongoose = require('mongoose');
var User = require('./user');


var messageSchema = new mongoose.Schema({
	sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate:true},		//Who sent it?
	receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},		//Who is it for?
	subject: {type: String, default: 'No Subject'},						//subject
	body: String,														//Content of the message
	created: {type: Date, default: Date.now()},							//When it was made
	read: Date,															//When it was read
	replyOrForward: {type: String, enum:[
		'reply',
		'forward',
		'root'
	], default:'root'},													//If the message is a reply, a forward, or if it is neither.
	trashed: Date,														//If and when the message was marked as trash.
	hidden: Date														//If and when the sender trashed the message.
});
// Plugin to automatically populate a field
messageSchema.plugin(require('mongoose-autopopulate'));
// Plugin for making messages able to be children of other messages.
messageSchema.plugin(require('mongoose-materialized'));


messageSchema.statics.findBySender = function(sender, type, cb){				//Find messages by sender
	// Note: Will default to sending only unhidden messages.
	if(type==='all') {
		return this.find({sender:sender},cb);
	}
	else if(type==='new'){
		return this.find({
			sender: sender, 
			hidden: undefined, 
			read: undefined
		},cb);
	}
	else return this.find({
		sender: sender,
		hidden: undefined
	}, cb);
};

messageSchema.statics.findByReceiver = function(receiver, type, cb){			//Find messages by recipient
	// Note: Will default to sending only messages that were not trashed.
	if(type==='all') {
		return this.find({receiver:receiver},cb);
	}
	else if(type==='new'){
		return this.find({
			receiver:receiver, 
			trashed: undefined, 
			read: undefined
		},cb);
	}
	else return this.find({
		receiver: receiver,
		trashed: undefined
	}, cb);
};

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;