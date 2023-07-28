

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
   data: {
      type: Object,
      required: true,
   },
   expires: {
      type: Date,
      required: true,
      default: () => {
         return Date.now() + 3600 * 1000;
      }
   }
});


const Temp = mongoose.model('Temp', schema);
module.exports = Temp;