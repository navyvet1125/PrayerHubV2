const express = require('express');
const router = express.Router();
const causesController = require('../controllers/causes_controller');
const passportService = require('../config/passport');
const passport = require('passport');

// Make sure that changes to api are only able to users who are authenticated
const requireAuth =  passport.authenticate('jwt', {session: false});



/* Read causes listing and create new cause*/
router.route('/')
	.get(causesController.index)
	.post(requireAuth, causesController.create);

/* Show, update, and destroy a particular cause*/
router.route('/:id')
	.get(causesController.show)
	.put(requireAuth, causesController.update)
	.delete(requireAuth, causesController.delete);

/* Read and create pledges for a specific cause*/
router.route('/:id/pledges')
	.get(causesController.showPledges)
	.put(requireAuth, causesController.addPledge);

/* Show and delete specific user pledges*/	
router.route('/pledges/:id')
	.get(causesController.showUserPledge)
	.delete(requireAuth, causesController.deletePledge);

module.exports = router;