var User = require('../models/user');
// Checks to see if the user is supposed to be praying at the moment or not.
// Currently returns a promise.
// Meant to prevent access to the site's functions while a person is supposed to be praying/meditating.
module.exports = function(userName){
	return User.findOne({userName: userName}).select('praying -_id')
};