const User = require('../models/user');
const Cause = require('../models/cause');
const Group = require('../models/group');
const aws = require('aws-sdk');

const sendRequest = (path, name, fileType)=>{
  const S3_BUCKET = process.env.S3_BUCKET;
  const s3 = new aws.S3();
  const fileName = `${path}/${name}`;
  
  const s3Params = {
	  Bucket: S3_BUCKET,
	  Key: fileName,
	  Expires: 60,
	  ContentType: fileType,
	  ACL: 'public-read'
  };
	try{
		return {
	    signedRequest: s3.getSignedUrl('putObject', s3Params),
	    url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
	  }; 
	}
	catch(err){
		return err;
	}

};
const controller ={}
// Generates a new signed url for browser upload.
// Requires a query parameter for a user, a cause, or a group in that order
controller.sign = (req,res)=> {
	if(req.query['user']){
		// If there is a user parameter then verify the user exists.
		User.findByUserName(req.query['user']).select('userName -_id')
		.then(function(user){
			if(user) {
				const results = sendRequest(`users/${user.userName}/images/avatar`, req.query['file-name'], req.query['file-type']);
				res.send(results);
			} else {
				res.status(404).send({status: 404, message:'User not found!'});
			}
		})
		.catch(function(err){
			//error handling
			res.status(500).send(err);
		});
	} else if(req.query['cause']) {
		// If there is a cause parameter then verify the cause exists.
		Cause.findById(req.query['cause']).select('_id')
		.then(function(cause){
			if(cause) {
				const results = sendRequest(`causes/${cause._id}/images/image`, req.query['file-name'], req.query['file-type']);
				res.send(results);
			} else {
				res.status(404).send({status: 404, message:'Cause not found!'});
			}
		})
		.catch(function(err){
			//error handling
			res.status(500).send(err);
		});
	} else if(req.query['group']) {
		// If there is a group parameter then verify the group exists
		Group.findById(req.query['group']).select('_id')
		.then(function(group){
			if(group) {
				const results = sendRequest(`groups/${group._id}/images/image`, req.query['file-name'], req.query['file-type']);
				res.send(results);
			} else {
				res.status(404).send({status: 404, message:'Group not found!'});
			}
		})
		.catch(function(err){
			//error handling
			res.status(500).send(err);
		});
	} else {
		// if a parameter is missing
		res.status(400).send({status:400, message:'One or more missing parameters!'});
	}
};

module.exports = controller;