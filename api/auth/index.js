
const { init: initAuth } = require('@xavisoft/auth/backend');
const authenticator = require('./authenticator');

function init(app) {
   initAuth({
      app,
      authenticator,
      SECRET_KEY: process.env.JWT_SECRET,
   });
}

module.exports =  {
   init,
}