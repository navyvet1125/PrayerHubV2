var express = require('express');
var router = express.Router();
var causesController = require('../controllers/causes_controller');


/* Read causes listing and create new cause*/
router.route('/')
	.get(causesController.index)
	.post(causesController.create);

/* Show, update, and destroy a particular cause*/
router.route('/:id')
	.get(causesController.show)
	.put(causesController.update)
	.delete(causesController.delete);

/* Read and create pledges for a specific cause*/
router.route('/:id/pledges')
	.get(causesController.showPledges);
	.put(causesController.addPledge);

/* Show and delete specific user pledges*/	
// router.route('/pledges/:id')
// 	.get(causesController.showUserPledge)
// 	.delete(causesController.deletePledge);

module.exports = router;