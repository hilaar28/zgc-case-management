
const mongoose = require("mongoose");
const CaseUpdate = require("./CaseUpdate");


const personalDetails = {
   name: {
      type: String,
      required: true,
   },
   surname: {
      type: String,
      required: true,
   },
   national_id: {
      type: String,
      required: true,
   },
   dob: {
      type: Date,
      required: true,
   },
   place_of_birth: {
      type: String,
      required: true,
   },
   gender: {
      type: String,
      required: true,
   },
   marital_status: {
      type: String,
      required: true,
   },
   residential_address: {
      type: String,
      required: true,
   },
   work_address: {
      type: String,
      required: true,
   },
   postal_address: {
      type: String,
      required: true,
   },
   telephone: {
      type: String,
      required: true,
   },
   mobile: {
      type: String,
      required: true,
   },
   fax: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
   },
   next_of_kin_phone: {
      type: String,
      required: true,
   },
   friend_phone: {
      type: String,
      required: true,
   },
}


const schema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   source: {
      type: String,
      required: true,
   },
   case_officer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
   },
   applicant: {
      ...personalDetails,
      relationship_to_victim: {
         type: String,
         required: true,
      },
      institution_name: String,
      why_completing_form_on_behalf: String,
   },
   victim: {
      type: personalDetails,
      required: false,
   },
   violation: {
      date: {
         type: [ Date ],
         required: true
      },
      continuing: {
         type: Boolean,
         required: true,
      },
      details: {
         type: Boolean,
         required: true,
      },
      location: {
         type: Boolean,
         required: true,
      },
      witness_details: {
         type: Boolean,
         required: true,
      },
   },
   other_entity_reported_to: {
      type: {
         details: {
            type: String,
            required: true,
         },
         actions: {
            type: String,
            required: true,
         },
         why_reporting_to_us_as_well: {
            type: String,
            required: true,
         },
      },
      required: false,
   },
   why_violation_is_important_to_our_mandate: String,
   expectations_from_us: String,
   lawyer_details: String,
   language: String,
   who_referred_you_to_us: {
      type: String,
      required: true,
   },
   updates: {
      type: [ CaseUpdate.schema ],
      required: true,
   }
}, { timestamps: true });


const Case = mongoose.model('Case', schema);
module.exports = Case;