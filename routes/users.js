var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users_controller');


/* GET users listing and create new users*/
router.route('/')
	.get(usersController.index)
	.post(usersController.create);

/*Show, update, and destroy a particular user*/
router.route('/:username')
	.get(usersController.show)
	.put(usersController.update)
	.delete(usersController.delete);

module.exports = router;