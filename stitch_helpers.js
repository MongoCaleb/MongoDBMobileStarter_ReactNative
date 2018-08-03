const stitch = require('mongodb-stitch-react-native-sdk');
const config = require('./config');

var atlasClient = null;

exports.initStitchClient = function() {
   return new Promise(function (resolve, reject) {
      stitch.Stitch.initializeDefaultAppClient(config.STITCH_APP_ID)
      .then(client => {
         /** After we have the Stitch client, we set up any service clients
          *  we need. In this case, we'll set up an Atlas client so we can 
          *  make calls to Atlas directly.
          * */
         atlasClient = client.getServiceClient(stitch.RemoteMongoClient.factory, "mongodb-atlas");
         resolve(client);
      });
   });
};

// ** Stitch Authentication Handlers ** //
// see https://docs.mongodb.com/stitch/authentication/anonymous/
exports.logonAnonymous = function(client) {
   return new Promise(function (resolve, reject) {
      client.auth.loginWithCredential(new AnonymousCredential())
         .then(user => {
            resolve(user);
         }).catch(err => {
            console.log('Error during login:', err)
            reject(err);
         });
   });
};

// see https://docs.mongodb.com/stitch/authentication/userpass/
exports.logonWithEmailPassword = function(client) {
   return new Promise(function (resolve, reject) {
      client.auth.loginWithCredential(new stitch.logonWithEmailPassword("myemail@mongodb.com", "sekritpassword"))
         .then(user => {
            resolve(user);
         }).catch(err => {
            console.log('Error during login:', err)
            reject(err);
         });
   });
};

// see https://docs.mongodb.com/stitch/authentication/api-key/
exports.logonWithApiKey = function(client) {
   return new Promise(function (resolve, reject) {
      client.auth.loginWithCredential(new stitch.UserApiKeyCredential(config.STITCH_API_KEY))
         .then(user => {
            resolve(user);
         }).catch(err => {
            console.log('Error during login:', err)
            reject(err);
         });
   });
};

// see https://docs.mongodb.com/stitch/authentication/facebook/
exports.logonWithFacebook = function(client) {
   return new Promise(function (resolve, reject) {
      client.auth.loginWithCredential(new stitch.FacebookCredential(config.FACEBOOK_TOKEN))
         .then(user => {
            resolve(user);
         }).catch(err => {
            console.log('Error during login:', err)
            reject(err);
         });
   });
};

// see https://docs.mongodb.com/stitch/authentication/google/
exports.logonWithGoogle = function(client) {
   return new Promise(function (resolve, reject) {
      client.auth.loginWithCredential(new stitch.GoogleCredential(config.GOOGLE_AUTH_CODE))
         .then(user => {
            resolve(user);
         }).catch(err => {
            console.log('Error during login:', err)
            reject(err);
         });
   });
};

// see https://docs.mongodb.com/stitch/authentication/custom/
exports.logonWithGoogle = function(client) {
   return new Promise(function (resolve, reject) {
      client.auth.loginWithCredential(new stitch.CustomCredential(config.CUSTOM_CREDENTIAL))
         .then(user => {
            resolve(user);
         }).catch(err => {
            console.log('Error during login:', err)
            reject(err);
         });
   });
};

/**
 * Logs out the currently-authenticated user.
 * @param {*} client 
 * */
exports.logout = function(client) {
   return new Promise(function (resolve, reject) {
      client.auth.logout().then(user => {
         resolve(`Successfully logged out`);
      })
   });
}

// ** End Stitch Authentication Handlers ** //

// ** Data-Related Functions ** //

/** Calls a Stitch Function with an optional array of params.
 * 
 * @param {*} client -   the Stitch client 
 * @param {*} funcName - the name of the Stitch function to call
 * @param {*} params -   any number of string values that will get sent to 
 *                       the Stitch Function as args.
 */
exports.callFunction = function(client, funcName, ...params) {
   return new Promise(function (resolve, reject) {
      client.callFunction(funcName, params)
         .then(result => {
            resolve(result);
         })
         .catch(err => {
            console.log(err);
            reject(err);
         })
   })
}

/**
 * Makes a direct call to Atlas, finding documents in the specified
 * database and collection according to the provided query filter. 
 * @param {*} dbName -         the name of the database
 * @param {*} collectionName - the name of the collection
 * @param {*} queryFilter - a BSON object defining the query.
 */
exports.find = function(dbName, collectionName, queryFilter) {
   return new Promise(function (resolve, reject) {
      try{
         atlasClient.db(dbName).collection(collectionName).find(queryFilter)
         .asArray()
         .then(result=> {
            resolve(result);
         })
      } catch (err){
         reject(err);
      }
   });
}

/* You can create other helper methods for the methods supported by 
the RemoteMongoCollection object. See 
https://s3.amazonaws.com/stitch-sdks/js-react-native/docs/4.0.12/interfaces/remotemongocollection.html
for a list of supported methods. */