const aws = require('aws-sdk');

// module to export images to s3 bucket
// parameters require a path, a key(or file name), and a fileType
module.exports = function(path, key, fileType){
	const S3_BUCKET = process.env.S3_BUCKET;
	const s3 = new aws.S3();
	const fileName = `${path}/${key}`;
	const s3Params = {
	Bucket: S3_BUCKET,
	Key: fileName,
	Expires: 60,
	ContentType: fileType,
	ACL: 'public-read'
	};
	s3.getSignedUrl('putObject', s3Params, (err, data) => {
	if(err){
	  console.log(err);
	  return res.end();
	}
	const returnData = {
	  signedRequest: data,
	  url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
	};
	console.log(returnData);
	res.write(JSON.stringify(returnData));
	res.end();
	});	
};