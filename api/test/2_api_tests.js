const casual = require("casual");
const { waitForServer, createRequester, createAccessToken, createUser, findLastInserted, createCase } = require("./utils");
const { USER_ROLES, MARITAL_STATUS, GENDER, CASE_SOURCES, CASE_STATUS, PROVINCES, AGE_RANGES } = require("../constants");
const User = require("../db/User");
const { ACCESS_TOKEN_HEADER_NAME } = require("@xavisoft/auth/constants");
const chai = require("chai");
const chaiSpies = require('chai-spies');
const mail = require("../mail");
const Case = require("../db/Case");
const Joi = require('@xavisoft/joi');
const { compare } = require("bcrypt");
const Temp = require("../db/Temp");

const { assert, expect } = chai;
const requester = createRequester();


// helpers
function generateSchemaObjectFromKeyList(values=[], joi) {
   const schema = {};
   values.forEach(value => schema[value] = joi);
   return schema;
}


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
               address: casual.address,
               telephone: casual.phone,
               mobile: casual.phone,
               email: casual.email,
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
               address: casual.address,
               telephone: casual.phone,
               mobile: casual.phone,
               email: casual.email,
               next_of_kin_phone: casual.phone,
               friend_phone: casual.phone,
            },
            defendants: [
               {
                  name: casual.text,
                  surname: casual.text,
                  national_id: casual.text,  
                  dob: casual.date('YYYY-MM-DD'), // datestring,
                  place_of_birth: casual.city,
                  gender: casual.random_element(Object.values(GENDER)), // enum
                  marital_status: casual.random_element(Object.values(MARITAL_STATUS)),
                  address: casual.address,
                  telephone: casual.phone,
                  mobile: casual.phone,
                  email: casual.email,
                  next_of_kin_phone: casual.phone,
                  friend_phone: casual.phone,
               }
            ],
            violation: {
               victim_age_range: casual.random_element(AGE_RANGES),
               continuing: casual.boolean,
               details: casual.text,
               location: casual.text,
               witness_details: casual.text,
               nature: casual.word,
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
            province: casual.random_element(Object.values(PROVINCES))
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
         const limit = 50;

         const res = await requester
            .get(`/api/cases/?offset=${offset}&limit=${limit}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200);

         // validate schema
         const schema = {
            cases: Joi.array().items({
               _id: Joi.string().required(),
               title: Joi.string().required(),
               applicant: Joi.object({
                  name: Joi.string().required(),
                  surname: Joi.string().required(),
               }).required(),
               defendants: Joi.array().items(Joi.object({
                  name: Joi.string().required(),
                  surname: Joi.string().required(),
               })).min(1).required(),
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
               createdAt: Joi.string().isoDate().required(),
            }),
            count: Joi.number().integer(),
         }

         const error = Joi.getError(res.body, schema);
         assert.isNull(error);

         assert.isAtLeast(res.body.count, res.body.cases.length);

         // compare with db
         const dbCount = await Case.countDocuments();
         assert.equal(dbCount, res.body.cases.length);

      });

      test("Retrieve case", async () => {

         // create case
         const case_ = await createCase();

         // retrieve cases
         const res = await requester
            .get(`/api/cases/${case_._id}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200);

         // validate schema
         const schema = {
            _id: Joi.string().required(),
            title: Joi.string().required(),
            applicant: Joi.object().required(),
            defendants: Joi.array().items(Joi.object()).min(1).required(),
            victim: Joi.object(),
            violation: Joi.object().required(),
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
            source: Joi.string().required(),
            other_entity_reported_to: Joi.object(),
            why_violation_is_important_to_our_mandate: Joi.string().required(),
            expectations_from_us: Joi.string(),
            lawyer_details: Joi.string(),
            language: Joi.string(),
            who_referred_you_to_us: Joi.string(),
            province: Joi.valid(...Object.values(PROVINCES)),
            updates: Joi.array().items({
               _id: Joi.string().required(),
               description: Joi.string().required(),
               createdAt: Joi.date().required(),
            }),
            createdAt: Joi.date().required(),
            updatedAt: Joi.date(),
            evidence: Joi.array().items(Joi.string()),
         };

         const error = Joi.getError(res.body, schema);
         assert.isNull(error);

         assert.equal(res.body._id, String(case_._id));

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

      test("Update case status", async () => {

         // send request
         let case_ = await findLastInserted(Case);

         const payload = {
            status: casual.random_element([ CASE_STATUS.REJECTED, CASE_STATUS.NOT_ASSIGNED ])
         }

         const res = await requester
            .post(`/api/cases/${case_._id}/status`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert.equal(res.status, 200);

         // check db
         case_ = await Case.findById(case_._id);
         assert.equal(case_.status, payload.status);

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

         assert.equal(case_.status, CASE_STATUS.IN_PROGRESS);
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

      test("Retrive case officers", async () => {

         // send request
         const res = await requester
            .get(`/api/cases/officers`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200);

         // check schema
         const schema = Joi.array().items({
            _id: Joi.string().required(),
            name: Joi.string().required(),
            surname: Joi.string().required(),
            active_cases: Joi.number().integer().required(),
         });

         const error = Joi.getError(res.body, schema);
         assert.isNull(error);

         // check db
         const count = await User.countDocuments().where({ role: USER_ROLES.CASE_OFFICER });
         assert.equal(res.body.length, count);


      });

      test("Assign a case", async () => {

         // send request
         let case_ = await createCase();
         const user = await createUser({ role: USER_ROLES.CASE_OFFICER });

         const payload = {
            case_officer: user._id
         }

         const res = await requester
            .post(`/api/cases/${case_._id}/assignment`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert.equal(res.status, 200);

         // check db
         case_ = await Case.findById(case_._id);
         assert.equal(case_.case_officer, String(payload.case_officer));
         assert.equal(case_.status, CASE_STATUS.IN_PROGRESS);


      });
   });

   suite("Account management", function () {

      let accessToken, userId;
      let password = casual.password;

      this.beforeAll(async () => {

         const user = await createUser({ password });
         userId = user._id;
         accessToken = createAccessToken(user);

      });

      test("Retrieve account info", async () => {

         // send request

         const res = await requester 
            .get('/api/accounts')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200)

         // verify schema
         const schema = {
            _id: Joi.string().hex().required(),
            name: Joi.string().required(),
            surname: Joi.string().required(),
            email: Joi.string().email().required(),
            role: Joi.valid(...Object.values(USER_ROLES)).required(),
            createdAt: Joi.date().required(),
            case_duration: Joi.number().integer().required(),
         };

         const error = Joi.getError(res.body, schema);
         assert.isNull(error);

      });

      test("Update password", async () => {

         // send request
         const payload = {
            old_password: password,
            new_password: casual.password,
         }

         const res = await requester 
            .post('/api/accounts/new-password')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send(payload);

         assert.equal(res.status, 200)

         // verify db changes
         const user = await User.findById(userId);
         const isPasswordvalid = await compare(payload.new_password, user.password);

         assert.isTrue(isPasswordvalid);

      });

      test("Reset password", async () => {

         // setup spy
         chai.spy.restore();
         chai.spy.on(mail, 'send', () => {})

         // send request
         const user = await User.findById(userId);

         const payload = {
            email: user.email,
         }

         const res = await requester 
            .post('/api/accounts/password-reset')
            .send(payload);

         assert.equal(res.status, 200)

         // verify db changes
         const temp = await findLastInserted(Temp);
         assert.equal(temp.data.user.toHexString(), userId);

         // verify spy
         expect(mail.send).to.have.been.called(1);

      });

      test("Verify password reset", async () => {

         // send request
         let temp = await findLastInserted(Temp);

         const res = await requester 
            .post(`/api/accounts/password-reset/${temp._id}/verification`)
            .send();

         assert.equal(res.status, 200)

         // verify db changes
         /// password change
         const user = await User.findById(userId);
         const isPasswordvalid = await compare(temp.data.password, user.password);
         assert.isTrue(isPasswordvalid);

         /// temp instance deletion
         temp = await Temp.findById(temp._id);
         assert.isNull(temp)
         
      });
   });

   suite("Reports", function () {

      let accessToken;

      this.beforeAll(async () => {
         const user = await createUser({ role: USER_ROLES.SUPERVISOR });
         accessToken = createAccessToken(user);
      });

      test("Retrieve summary statistics", async () => {

         // create some cases
         for (let i = 0; i < 10; i++) {
            await createCase()
         }

         // send request
         const res = await requester 
            .get('/api/cases/summary')
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200)

         // verify schema
         const schema = {
            gender: {
               male: Joi.number().integer().required(),
               female: Joi.number().integer().required(),
            },
            province: generateSchemaObjectFromKeyList(Object.values(PROVINCES), Joi.number().integer()),
            status: generateSchemaObjectFromKeyList(Object.values(CASE_STATUS), Joi.number().integer()),
            age_range: generateSchemaObjectFromKeyList(AGE_RANGES, Joi.number().integer()),
         };

         const error = Joi.getError(res.body, schema);
         assert.isNull(error);

         // tally with db
         const sumNumbers = (obj) => {
            return Object.values(obj).reduce((sum, value) => sum + value, 0);
         }

         const caseCount = await Case.countDocuments();
         const totalFromGender = sumNumbers(res.body.gender);
         const totalFromProvince = sumNumbers(res.body.province);
         const totalFromStatus = sumNumbers(res.body.status);

         assert.equal(caseCount, totalFromGender);
         assert.equal(caseCount, totalFromProvince);
         assert.equal(caseCount, totalFromStatus);

      });

      test("Retrieve trend data", async () => {

         // send request
         const last4Week = Date.now() - 4 * 7 * 24 * 3600 * 1000;

         const res = await requester 
            .get(`/api/cases/trend?period=WEEKLY&from=${last4Week}`)
            .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
            .send();

         assert.equal(res.status, 200)

         // check schema
         const schema = Joi.array().items({
            start: Joi.date().required(),
            count: Joi.number().integer().required(),
         });

         const error = Joi.getError(res.body, schema);
         assert.isNull(error);

      });

   });

});   