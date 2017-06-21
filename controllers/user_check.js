var User = require('../models/user');

module.exports = function(userName){
	return User.findOne({userName: userName}).select('praying -_id')
};