
const mongoose = require("mongoose");
const { MARITAL_STATUS, CASE_SOURCES, CASE_STATUS, GENDER, PROVINCES } = require("../constants");


const caseUpdateSchema = new mongoose.Schema({
   description: {
      type: String,
      required: true,
   },
}, { timestamps: true });


const personalDetails = {
   name: {
      type: String,
      required: true,
   },
   surname: {
      type: String,
      required: true,
   },
   national_id: String,
   dob: String,
   place_of_birth: String,
   gender: {
      type: String,
      enum: Object.values(GENDER),
      required: true,
   },
   marital_status: {
      type: String,
      enum: Object.values(MARITAL_STATUS),
      required: true,
   },
   residential_address: String,
   work_address: String,
   postal_address: String,
   telephone: String,
   mobile: {
      type: String,
      required: true,
   },
   fax: String,
   email: String,
   next_of_kin_phone: String,
   friend_phone: String,
}


const schema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   source: {
      type: String,
      enum: Object.values(CASE_SOURCES),
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
   defendant: {
      ...personalDetails,
      institution_name: String,
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
         type: String,
         required: true,
      },
      location: {
         type: String,
         required: true,
      },
      witness_details: {
         type: String,
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
      type: [ caseUpdateSchema ],
      required: true,
   },
   status: {
      type: String,
      enum: Object.values(CASE_STATUS),
      default: CASE_STATUS.NOT_ASSESSED,
      required: true,
   },
   referred_to: String,
   recorded_by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
   },
   province: {
      type: String,
      enum: Object.values(PROVINCES),
      required: true,
   }
}, { timestamps: true });


const Case = mongoose.model('Case', schema);
module.exports = Case;