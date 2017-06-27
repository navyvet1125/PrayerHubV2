const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentication_controller');

// var causesController = require('../controllers/causes_controller');



router.route('/signup')
	.post(authController.signup);

// /* Show, update, and destroy a particular cause*/
// router.route('/:id')
// 	.get(causesController.show)
// 	.put(causesController.update)
// 	.delete(causesController.delete);

//  Read and create pledges for a specific cause
// router.route('/:id/pledges')
// 	.get(causesController.showPledges)
// 	.put(causesController.addPledge);

// /* Show and delete specific user pledges*/	
// router.route('/pledges/:id')
// 	.get(causesController.showUserPledge)
// 	.delete(causesController.deletePledge);

module.exports = router;