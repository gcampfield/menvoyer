var mongoose = require('mongoose');

// define the schema for our user model
var Message = mongoose.Schema({
  from: String,
  tohash: String,
  subject: String,
  message: String,
  date: Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Message', Message);
