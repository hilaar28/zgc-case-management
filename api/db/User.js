const mongoose = require("mongoose");
const { USER_ROLES } = require("../constants");
const { hash } = require("bcrypt");


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


schema.pre("save", async function(next) {
   
   if (this.password) {
      const passwordSaltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS) || 12;
      this.password = await hash(this.password, passwordSaltRounds);
   }

   if (this.email) {
      this.email = this.email.toLowerCase();
   }

   next();
   
})


const User = mongoose.model('User', schema);
module.exports = User;