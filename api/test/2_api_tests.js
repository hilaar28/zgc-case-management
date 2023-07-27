const casual = require("casual");
const { waitForServer, createRequester, createAccessToken, createUser, findLastInserted, createCase } = require("./utils");
const { USER_ROLES, MARITAL_STATUS, GENDER, CASE_SOURCES, CASE_STATUS } = require("../constants");
const User = require("../db/User");
const { ACCESS_TOKEN_HEADER_NAME } = require("@xavisoft/auth/constants");
const chai = require("chai");
const chaiSpies = require('chai-spies');
const mail = require("../mail");
const Case = require("../db/Case");
const Joi = require('@xavisoft/joi');

const { assert, expect } = chai;
const requester = createRequester();


chai.use(chaiSpies);

suite("API Tests", function () {

   this.beforeAll(waitForServer);

   suite("User management", function () {

      let accessToken;

      this.beforeAll(async () => {
         const user = await User.findOne().where({ email: process.env.SUPER_USER_EMAIL });
         accessToken = createAccessToken(user);
      });

      test("Add user", async () => {

         // setup spy
         chai.spy.restore();
         chai.spy.on(mail, 'send', () => {});

         // send request
         const payload = {
            name: casual.first_name,
            surname: casual.last_name,
            email: casual.email.toLowerCase(),
            role: casual.random_element(Object.values(USER_ROLES)),  
         };

         const res  = await requester
            .post('/api/users')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert .equal(res.status, 200);

         // validate schema
         assert.isString(res.body._id);

         // check db
         const user = await User.findOne().where({ email: payload.email });
         assert.isObject(user);

         assert.equal(user.name, payload.name);
         assert.equal(user.surname, payload.surname);
         assert.equal(user.role, payload.role);

         // check spy
         expect(mail.send).to.have.been.called(1);

      }); 
      
      test("Retrieve users", async () => {

         // create some more users
         const iMax = casual.integer(0, 3);

         for (let i = 0; i <= iMax; i++)
            await createUser();

         // send request
         const res  = await requester
            .get('/api/users')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert .equal(res.status, 200);

         // check schema
         assert.isArray(res.body);

         assert.isString(res.body[0]._id);
         assert.isString(res.body[0].name);
         assert.isString(res.body[0].surname);
         assert.isString(res.body[0].email);
         assert.isString(res.body[0].role);

         // check with db
         const dbUserCount = await User.countDocuments();
         assert.equal(dbUserCount, res.body.length);

      });  

      test("Update user", async () => {

         // setup spy
         chai.spy.restore();
         chai.spy.on(mail, 'send', () => {});

         // send request
         let user = await findLastInserted(User);
      
         const payload = {
            set: {
               email: casual.email.toLowerCase(),
            }
         }

         const res  = await requester
            .patch(`/api/users/${user._id}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert .equal(res.status, 200);

         // check  db
         user = await User.findById(user._id);
         assert.equal(user.email, payload.set.email);

         // check spy
         expect(mail.send).to.have.been.called(1);

      }); 
      
      test("Delete user", async () => {

         // send request
         let user = await findLastInserted(User);
      
         const res  = await requester
            .delete(`/api/users/${user._id}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert .equal(res.status, 200);

         // check  db
         user = await User.findById(user._id);
         assert.isNull(user);

      });  
   });
   
   suite("Case management", function () {

      let accessToken;

      this.beforeAll(async () => {
         const user = await createUser({ role: USER_ROLES.SUPER_ADMIN });
         accessToken = createAccessToken(user);
      });

      test("Register case", async () => {

         // send request
         const payload = {
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
               date: [ casual.date('YYYY-MM-DD') ],
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
         }

         const res = await requester
            .post('/api/cases')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert.equal(res.status, 200);

         // check schema
         const _id = res.body._id;
         assert.isString(_id);

         // check db
         const case_ = await Case.findById(_id);
         assert.isObject(case_);

         assert.equal(case_.title, payload.title);
         assert.equal(case_.applicant.work_address, payload.applicant.work_address);

      });


      test("Retrieve cases", async () => {

         // add some more cases
         const iMax = casual.integer(5, 10);

         for (let i = 0; i <= iMax; i++)
            await createCase();
         
         // retrieve cases
         const offset = 0;
         const limit = casual.integer(10, 20);

         const res = await requester
            .get(`/api/cases/?offset=${offset}&limit=${limit}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200);

         // validate schema
         const schema = Joi.array().items({
            _id: Joi.string().required(),
            title: Joi.string().required(),
            applicant: {
               name: Joi.string().required(),
               surname: Joi.string().required(),
            },
            victim: {
               name: Joi.string().required(),
               surname: Joi.string().required(),
            },
            violation: {
               details: Joi.string().required(),
            },
            status: Joi.string().required(),
            recorded_by: Joi.object({
               _id: Joi.string(),
               name: Joi.string().required(),
               surname: Joi.string().required(),
            }).allow(null),
            case_officer: Joi.object({
               _id: Joi.string(),
               name: Joi.string().required(),
               surname: Joi.string().required(),
            }).allow(null),
         });

         const error = Joi.getError(res.body, schema);
         assert.isNull(error);

         // compare with db
         const dbCount = await Case.countDocuments();
         assert.equal(dbCount, res.body.length);

      });

      test("Update case", async () => {

         // send request
         let case_ = await findLastInserted(Case);

         const payload = {
            set: {
               applicant: {
                  name: casual.first_name,
               },
            }
         }

         const res = await requester
            .patch(`/api/cases/${case_._id}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert.equal(res.status, 200);

         // check db
         case_ = await Case.findById(case_._id);
         assert.equal(case_.applicant.name, payload.set.applicant.name);

      });

      test("Refer case", async () => {

         // send request
         let case_ = await createCase();

         const payload = {
            refer_to: casual.sentence,
         }

         const res = await requester
            .post(`/api/cases/${case_._id}/referral`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert.equal(res.status, 200);

         // check db
         case_ = await Case.findById(case_._id);

         assert.equal(case_.status, CASE_STATUS.REFERRED);
         assert.equal(case_.referred_to, payload.refer_to);

      });

      test("Add update to case", async () => {

         // send request
         let case_ = await createCase();

         const payload = {
            description: casual.catch_phrase,
         }

         const res = await requester
            .post(`/api/cases/${case_._id}/updates`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert.equal(res.status, 200);

         // check schema
         const { _id } = res.body;
         assert.isString(_id);

         // check db
         case_ = await Case.findById(case_._id);

         assert.isArray(case_.updates);
         assert.equal(case_.updates.length, 1);
         assert.equal(case_.updates[0]._id.toHexString(), _id);
         assert.equal(case_.updates[0].description, payload.description);

      });

      test("Edit case update", async () => {

         // send request
         let case_ = await findLastInserted(Case);

         const payload = {
            set: {
               description: casual.catch_phrase,
            }
         }

         const caseUpdateId = case_.updates[0]._id;

         const res = await requester
            .patch(`/api/cases/${case_._id}/updates/${caseUpdateId}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert.equal(res.status, 200);

         // check db
         case_ = await Case.findById(case_._id);
         assert.equal(case_.updates[0].description, payload.set.description);

      });

      test("Delete case update", async () => {

         // send request
         let case_ = await findLastInserted(Case);
         const caseUpdateId = case_.updates[0]._id;

         const res = await requester
            .delete(`/api/cases/${case_._id}/updates/${caseUpdateId}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200);

         // check db
         case_ = await Case.findById(case_._id);
         const update = case_.updates.find(item => String(item.id) === String(caseUpdateId));
         assert.isUndefined(update);
         
      });
   });
});   