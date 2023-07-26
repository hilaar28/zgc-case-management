const mongoose = require("mongoose");


const schema = new mongoose.Schema({
   description: {
      type: String,
      required: true,
   },
}, { timestamps: true });


const CaseUpdate = mongoose.model('CaseUpdate', schema);
module.exports = CaseUpdate;