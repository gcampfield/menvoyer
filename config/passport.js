var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({
        'local.email': email
      }, function(err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, false, req.flash('error', 'That email is already taken.'));
        } else {
          var user = new User();
          user.local.email = email;
          user.local.password = user.generateHash(password);

          user.save(function(err) {
            if (err) throw err;
            return done(null, user);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
      User.findOne({ 'local.email' :  email }, function(err, user) {
          if (err) return done(err);
          if (!user)
              return done(null, false, req.flash('error', 'No user found.'));

          if (!user.validPassword(password))
              return done(null, false, req.flash('error', 'Oops! Wrong password.'));
          return done(null, user);
      });
  }));
}
