var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var User = mongoose.Schema({
  local: {
    email: String,
    password: String,
  },
  hashid: String
});

// generating a hash
User.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// make sure hashid is unique
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
var length = 7
function genHash() {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function presave(self, next) {
  if (self.hashid) next();
  else {
    var hash = genHash();
    self.constructor.findOne({ 'hashid': hash }, function (err, user) {
      if (!user) {
        self.hashid = hash;
        next();
      }
      else presave(self, next);
    });
  }
}

User.pre('save', function (next) {
  presave(this, next);
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', User);
