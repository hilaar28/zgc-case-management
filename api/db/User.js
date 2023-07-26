const mongoose = require("mongoose");
const { USER_ROLES } = require("../constants");


const schema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   surname: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
   }
}, { timestamps: true });


const User = mongoose.model('User', schema);
module.exports = User;