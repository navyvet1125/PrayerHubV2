const jwt = require('jsonwebtoken');
const controller = {};
const User = require('../models/user');
const JWT_SECRET = process.env.PRAYER_HUB_JWT_SECRET;



controller.verify = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next({
      status:  401,
      message: 'Authentication failed: missing auth header'
    });
  }
  console.log('verifying token');
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(err);
    req.decoded = decoded;
    next();
  });
};

controller.sign = (user) => {
	const token = jwt.sign(
	    {
	      sub: user._id
	    },
	    JWT_SECRET,
	    {
	    	algorithm: 'HS512'
	    }
	 );
	return ({token});
};

module.exports = controller;