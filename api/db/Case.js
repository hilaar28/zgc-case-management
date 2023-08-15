
const mongoose = require("mongoose");
const { MARITAL_STATUS, CASE_SOURCES, CASE_STATUS, GENDER, PROVINCES, AGE_RANGES } = require("../constants");


const caseUpdateSchema = new mongoose.Schema({
   description: {
      type: String,
      required: true,
   },
}, { timestamps: true });


const personalDetails = {
   name: String,
   surname: String,
   national_id: String,
   dob: String,
   place_of_birth: String,
   gender: {
      type: String,
      enum: Object.values(GENDER),
   },
   marital_status: {
      type: String,
      enum: Object.values(MARITAL_STATUS),
   },
   address: String,
   telephone: String,
   mobile: String,
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
      location: String,
      relationship_to_victim: String,
      relationship_to_incident: String,
      institution_name: String,
      why_completing_form_on_behalf: String,
   },
   defendants: [
      {
         ...personalDetails,
         institution_name: String,
      } 
   ],
   victim: {
      type: personalDetails,
      required: false,
      _id: false,
   },
   violation: {
      date: {
         year: Number,
         month: Number,
         day: Number,
      },
      victim_age_range: {
         type: String,
         enum: AGE_RANGES,
         required: true,
      },
      continuing: Boolean,
      details: {
         type: String,
         required: true,
      },
      location: String,
      witness_details: String,
      nature: String,
      nature_gender: String,
      impact: String,
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
   who_referred_you_to_us: String,
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
   },
   evidence: [ String ],
   more_assistance_required: String,
}, { timestamps: true });


const Case = mongoose.model('Case', schema);
module.exports = Case;