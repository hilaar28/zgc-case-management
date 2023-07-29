
const jwt = require('jsonwebtoken');
const casual = require('casual');
const User = require('../../db/User');
const chai = require('chai');
const chaiHttp = require('chai-http');
const axios = require('axios');
const { default: mongoose } = require('mongoose');
const { USER_ROLES, GENDER, MARITAL_STATUS, CASE_SOURCES, PROVINCES } = require('../../constants');
const Case = require('../../db/Case');


chai.use(chaiHttp);


function createAccessToken(user) {

   if (user._doc)
      user = { ...user, ...user._doc };
      
   const payload = {
      user,
      exp: Date.now() + 10 * 60 * 1000,
   }

   return jwt.sign(payload, process.env.JWT_SECRET);

}


/**
 * 
 * @param {class} Model 
 * @param {String} attr 
 * @returns {Promise<Model>}
 */
function findLastInserted(Model) {
   return Model.findOne().limit(1).sort({ createdAt: -1 })
}


function createUser(attributes={}) {

   return User.create({
      name: casual.first_name,
      surname: casual.last_name,
      password: casual.password,
      email: casual.email.toLowerCase(),
      role: casual.random_element(Object.values(USER_ROLES)),
      ...attributes,
   })
 
}


function createCase(attributes={}) {
   return Case.create({
      applicant: {
         name: casual.first_name,
         surname: casual.last_name,
         national_id: casual.text,      
         dob: casual.date('YYYY-MM-DD'), // datestring,
         place_of_birth: casual.city,
         gender: casual.random_element(Object.values(GENDER)), // enum
         marital_status: casual.random_element(Object.values(MARITAL_STATUS)),
         residential_address: casual.address,
         work_address: casual.address,
         postal_address: casual.address,
         telephone: casual.phone,
         mobile: casual.phone,
         fax: casual.phone,
         email: casual.phone,
         next_of_kin_phone: casual.phone,
         friend_phone: casual.phone,
         institution_name: casual.text,
         relationship_to_victim: casual.text,
         why_completing_form_on_behalf: casual.text,
      },
      defendant: {
         name: casual.first_name,
         surname: casual.last_name,
         national_id: casual.text,      
         dob: casual.date('YYYY-MM-DD'), // datestring,
         place_of_birth: casual.city,
         gender: casual.random_element(Object.values(GENDER)), // enum
         marital_status: casual.random_element(Object.values(MARITAL_STATUS)),
         residential_address: casual.address,
         work_address: casual.address,
         postal_address: casual.address,
         telephone: casual.phone,
         mobile: casual.phone,
         fax: casual.phone,
         email: casual.phone,
         next_of_kin_phone: casual.phone,
         friend_phone: casual.phone,
         institution_name: casual.text,
      },
      victim: {
         name: casual.text,
         surname: casual.text,
         national_id: casual.text,  
         dob: casual.date('YYYY-MM-DD'), // datestring,
         place_of_birth: casual.city,
         gender: casual.random_element(Object.values(GENDER)), // enum
         marital_status: casual.random_element(Object.values(MARITAL_STATUS)),
         residential_address: casual.address,
         work_address: casual.address,
         postal_address: casual.address,
         telephone: casual.phone,
         mobile: casual.phone,
         fax: casual.phone,
         email: casual.phone,
         next_of_kin_phone: casual.phone,
         friend_phone: casual.phone,
      },
      violation: {
         date: casual.date('YYYY-MM-DD'),
         continuing: casual.boolean,
         details: casual.text,
         location: casual.text,
         witness_details: casual.text,
      },
      other_entity_reported_to: {
         details: casual.text,
         actions: casual.text,
         why_reporting_to_us_as_well: casual.text,
      },
      why_violation_is_important_to_our_mandate: casual.text,
      expectations_from_us: casual.text,
      lawyer_details: casual.text,
      language: casual.word,
      who_referred_you_to_us: casual.text,
      source: casual.random_element(Object.values(CASE_SOURCES)),
      title: casual.text,
      recorded_by: new mongoose.mongo.ObjectId(),
      province: casual.random_element(Object.values(PROVINCES)),

      ...attributes,
   });
}

async function waitForServer(url = `http://localhost:${process.env.PORT}`) {

   let success = false;

   while (!success) {
      try {
         await axios.get(url);
         success = true;
      } catch (err) {
         if (err.code !== 'ECONNREFUSED')
            success = true;
      }
   }
}

function createRequester() {
   return chai.request(`http://localhost:${process.env.PORT}`).keepOpen();
}


module.exports = {
   createAccessToken,
   createCase,
   createRequester,
   createUser,
   findLastInserted,
   waitForServer,
}