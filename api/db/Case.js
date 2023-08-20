
const mongoose = require("mongoose");
const { MARITAL_STATUS, CASE_SOURCES, CASE_STATUS, GENDER, PROVINCES, AGE_RANGES, CASE_TYPE } = require("../constants");


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
      index: true,
   },
   marital_status: {
      type: String,
      enum: Object.values(MARITAL_STATUS),
      index: true,
   },
   address: String,
   telephone: String,
   mobile: String,
   email: String,
   next_of_kin_phone: String,
   friend_phone: String,
}


const schema = new mongoose.Schema({
   type: {
      type: String,
      enum: Object.values(CASE_TYPE),
      index: true,
      required: true,
   },
   title: {
      type: String,
      required: true,
   },
   source: {
      type: String,
      enum: Object.values(CASE_SOURCES),
      required: true,
      index: true,
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
      anonymous: Boolean,
   },
   defendants: [
      new mongoose.Schema({
         ...personalDetails,
         institution_name: String,
      }, { _id: false })
   ],
   victim: personalDetails,
   violation: {
      dates: {
         from: {
            year: Number,
            month: Number,
            day: Number,
         },
         to: {
            year: Number,
            month: Number,
            day: Number,
         }
      },
      victim_age_range: {
         type: String,
         enum: AGE_RANGES,
         required: true,
         index: true,
      },
      continuing: Boolean,
      details: {
         type: String,
         required: true,
      },
      location: String,
      witness: {
         anonymous: Boolean,
         details: String,
      },
      natures: [ 
         new mongoose.Schema({
            nature: {
               type: String,
               required: true,
               index: true,
            },
            sub_nature: String,
         }, { _id: false })
      ],
      impact: {
         type: String,
         required: true,
         index: true,
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
      index: true,
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
      index: true,
   },
   referred_to: String,
   recorded_by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
   },
   province: {
      type: String,
      enum: Object.keys(PROVINCES),
      required: true,
      index: true,
   },
   district: String,
   constituency: String,
   ward: String,
   village: String,
   evidence: [ String ],
   more_assistance_required: String,
}, { timestamps: true, });


schema.index({
   createdAt: 1,
})


const Case = mongoose.model('Case', schema);
module.exports = Case;