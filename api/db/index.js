const mongoose = require("mongoose");
const User = require('./User');
const Case = require('./Case');
const { USER_ROLES } = require("../constants");


const DB_URL = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/test': process.env.DB_URL;

async function init() {

   // connect to db server
   await mongoose.connect(DB_URL);

   // initialize models
   await User.init();
   await Case.init();

   // create default super user
   try {
      await User.create({
         name: 'Super',
         surname: 'Admin',
         email: process.env.SUPER_USER_EMAIL,
         password: process.env.SUPER_USER_PASSWORD,
         role: USER_ROLES.SUPER_ADMIN,
      });
   } catch (err) {
      console.log(err.message);
   }

}


module.exports = {
   init
}