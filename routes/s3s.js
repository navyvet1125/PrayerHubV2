var express = require('express');
var router = express.Router();
var s3Controller = require('../controllers/s3_controller');


/* GET home page. */
router.route('/')
	.get(s3Controller.sign);
// router.route('/')
// 	.get(usersController.index)
// 	.post(usersController.create);


module.exports = router;
