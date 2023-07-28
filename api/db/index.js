const mongoose = require("mongoose");
const User = require('./User');
const Case = require('./Case');
const { USER_ROLES } = require("../constants");
const Temp = require("./Temp");

async function init() {

   // connect to db server
   const DB_URL = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/test': process.env.DB_URL;
   await mongoose.connect(DB_URL);

   // initialize models
   await User.init();
   await Case.init();
   await Temp.init();

   // empty test database
   if (process.env.NODE_ENV === 'test') {
      
      const modelNames = Object.keys(mongoose.models);

      for (let i in modelNames) {
         const modelName = modelNames[i];
         const model = mongoose.models[modelName];
         await model.deleteMany({});
      }
   }

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