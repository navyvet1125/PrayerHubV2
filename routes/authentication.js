const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentication_controller');
const passportService = require('../config/passport');
const passport = require('passport');

const requireAuth =  passport.authenticate('jwt', {session: false});
const requireSignin =  passport.authenticate('local', {session: false});

router.route('/')
	.get(requireAuth, authController.signedUser);

router.route('/signup')
	.post(authController.signup);

router.route('/signin')
	.post(requireSignin, authController.signin);

module.exports = router;