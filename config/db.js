var mongoose = require('mongoose');

var mongoUrl = 'mongodb://localhost/p-hub-v2';
mongoose.Promise = Promise
mongoose.connect(mongoUrl, function(err){
  if(err){
    throw err;
  }
  console.log('database connected');
});

module.exports = mongoose;
