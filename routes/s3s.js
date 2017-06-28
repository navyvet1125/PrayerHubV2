const express = require('express');
const router = express.Router();
const s3Controller = require('../controllers/s3_controller');
const passportService = require('../config/passport');
const passport = require('passport');

// Make sure that changes to api are only able to users who are authenticated
const requireAuth =  passport.authenticate('jwt', {session: false});


/* GET home page. */
router.route('/')
	.get(requireAuth, s3Controller.sign);
	
module.exports = router;
