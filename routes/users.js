const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');
const passportService = require('../config/passport');
const passport = require('passport');

// Make sure that changes to api are only able to users who are authenticated
const requireAuth =  passport.authenticate('jwt', {session: false});


/* GET users listing and create new users*/
router.route('/')
	.get(usersController.index);

/* Show, update, and destroy a particular user*/
router.route('/:username')
	.get(usersController.show)
	.put(requireAuth, usersController.update)
	.delete(requireAuth, usersController.delete);

/* Show user's pledges*/
router.route('/:username/pledges')
	.get(requireAuth, usersController.showPledges);

/* Show user's causes*/
router.route('/:username/causes')
	.get(requireAuth, usersController.showCauses);

module.exports = router;