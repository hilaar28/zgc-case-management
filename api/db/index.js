const mongoose = require("mongoose");
const User = require('./User');
const Case = require('./Case');


const DB_URL = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/test': process.env.DB_URL;

async function init() {

   // connect to db server
   await mongoose.connect(DB_URL);

   // initialize models
   await User.init();
   await Case.init();

}


module.exports = {
   init
}