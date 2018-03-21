// ------------------------ Twitter Strategy -----------------------------

const TwitterStrategy = require( 'passport-twitter' ).Strategy;
const User = require( '../../models/user.js' );
const generateRandomUsername =  require('./generateRandomUsername.js');

const websiteUrl = require('./websiteurl.js');

const twitterLogin = new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: websiteUrl + '/auth/twitter/callback',
    includeEmail: true
  },
  ( token, tokenSecret, profile, done ) => {
    const email = profile.emails[0].value;
    User.findOne(
      { 
        'twitter.id': profile.id
      },
      ( err, user ) => {
        if ( !user ){
          let newUser = new User();
          newUser.twitter = {
            id:           profile.id,
            displayName:  profile.displayName || generateRandomUsername(),
            username:     profile.username,
            email:        email,
            token:        token,
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

module.exports = twitterLogin;
