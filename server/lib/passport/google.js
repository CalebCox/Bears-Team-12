//------------------ Google Strategy ---------------------------------------

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require( '../../models/user.js' );
const generateRandomUsername =  require('./generateRandomUsername.js');
const websiteUrl = require('./websiteurl.js');

const googleLogin = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: websiteUrl + '/auth/google/callback'
  },
  ( accessToken, refreshToken, profile, done ) => {
    const email = profile.emails[0].value;
    User.findOne(
      { 
        'google.id': profile.id
      },
      ( err, user ) => {
        if ( !user ){
          let newUser = new User();
          newUser.google = {
            id:       profile.id,
            name:     profile.displayName || generateRandomUsername(),
            email:    email,
            token:    accessToken
          };
          newUser.posts = [];
          newUser.save( ( error ) => {
            if ( error ) console.log( error );
            return done( err, newUser );
          });
        }
        else{
          return done( err, user );
        }
    });
  }
);

module.exports = googleLogin;