const mongoose = require("mongoose");
const User = require('./User');
const Case = require('./Case');
const { USER_ROLES } = require("../constants");
const Temp = require("./Temp");

async function init() {

   // connect to db server
   const DB_URL = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017': process.env.DB_URL;
   let user, pass;

   if (!process.env.SKIP_DB_AUTH) {
      user = process.env.DB_USER;
      pass = process.env.DB_PWD;
   }

   // Connect to MongoDB
   await mongoose.connect(DB_URL, { user, pass, dbName: 'admin' });

   // Try to create the zgc-case-management database user
   try {
      const db = mongoose.connection.db;
      try {
         await db.command({
            createUser: 'zgc-case-management',
            pwd: 'b6bd0174-7449-4f01-b5eb-9afcf4213694',
            roles: [{ role: "readWrite", db: 'zgc-case-management' }]
         });
         console.log('Database user created successfully');
      } catch (err) {
         if (err.code === 51003 || err.message.includes('already exists')) {
            console.log('Database user already exists');
         } else {
            console.log('User creation note:', err.message);
         }
      }
   } catch (err) {
      console.log('Note:', err.message);
   }

   // Now connect to the actual database
   await mongoose.disconnect();
   await mongoose.connect(DB_URL, { user, pass, dbName: 'zgc-case-management' });

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
