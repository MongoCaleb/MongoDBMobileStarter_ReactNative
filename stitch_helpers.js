const stitch = require('mongodb-stitch-react-native-sdk');
const config = require('./config');

var atlasClient = null;

exports.initStitchClient = function() {
   return new Promise(function (resolve, reject) {
      stitch.Stitch.initializeDefaultAppClient(config.STITCH_APP_ID)
      .then(client => {
         atlasClient = client.getServiceClient(stitch.RemoteMongoClient.factory, "mongodb-atlas");
         resolve(client);
      });
   });
};

/// Stitch Authentication handlers

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


exports.logout = function(client) {
   return new Promise(function (resolve, reject) {
      client.auth.logout().then(user => {
         resolve(`Successfully logged out`);
      })
   });
}
/// End Stitch Authentication handlers

//Call a Stitch Function with an optional array of params
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

exports.findAllDocs = function(dbName, collectionName) {
   return new Promise(function (resolve, reject) {
      try{
         atlasClient.db(dbName).collection(collectionName).find().asArray()
         .then(result=> {
            resolve(result);
         })
      } catch (err){
         reject(err);
      }
   });
}
