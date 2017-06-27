const aws = require('aws-sdk');

const controller ={}
// Generates a new signed url for browser upload.
controller.sign = (req,res)=> {
  const S3_BUCKET = process.env.S3_BUCKET;
  const s3 = new aws.S3();
  const path = req.query['user']? `users/${req.query['user']}/images/avatar` : req.query['cause']? `causes/${req.query['cause']}/images/image` : req.query['group']? `groups/${req.query['group']}/images/image` : null;
  const fileName = `${path}/${req.query['file-name']}`;
  const s3Params = 
  {
  	Bucket: S3_BUCKET,
  	Key: fileName,
  	Expires: 60,
  	ContentType: req.query['file-type'],
  	ACL: 'public-read'
  };
  if(path){
	  s3.getSignedUrl('putObject', s3Params, (err, data) => {
	  if(err){
	    console.log(err);
	    res.send(err);
	  }
	  const returnData = {
	    signedRequest: data,
	    url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
	  };
	  res.json(returnData);
	  }); 
  } else {
  	res.status(400).send({err:'Missing Parameters', message:'You must include either a user, a cause, or a group in the query parameters.'})
  }

	
};

module.exports = controller;