
const { compare } = require('bcrypt');
const User = require('../db/User');

async function getUserInfo(credentials={}) {

   // retrieve user
   let { email, password } = credentials;
   email = email.toLowerCase();

   const user = await User.findOne().where({ email }).select('_id role password');

   if (!user)
      return null;

   // validate password
   const isPasswordValid = await compare(password, user.password);

   if (!isPasswordValid)
      return null;

   // return user info
   const { _id, role } = user;
   
   return {
      _id,
      role,
   }

}

const authenticator = {
   getUserInfo,
}

module.exports = authenticator;