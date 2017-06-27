const aws = require('aws-sdk');

// module to get a signed url from amazon server.
// parameters require a path, a name for the file, and a fileType

module.exports =function (path, name, fileType, req, res){
/*
 * Load the S3 information from the environment variables.
 */
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
};