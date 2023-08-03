const { Router } = require("express");
const { USER_ROLES, CASE_SOURCES, MARITAL_STATUS, GENDER, CASE_STATUS, PROVINCES } = require("./constants");
const status_500 = require("./status_500");
const Joi = require("@xavisoft/joi");
const Case = require("./db/Case");
const { flattenDocumentUpdate } = require("./utils");
const { default: mongoose } = require("mongoose");
const User = require("./db/User");

// constants
const personalDetailsSchema = {
   name: Joi.string(),
   surname: Joi.string(),
   national_id: Joi.string(),      
   dob: Joi.string(), // datestring,
   place_of_birth: Joi.string(),
   gender: Joi.valid(...Object.values(GENDER)), // enum
   marital_status: Joi.valid(...Object.values(MARITAL_STATUS)),
   residential_address: Joi.string(),
   work_address: Joi.string(),
   postal_address: Joi.string(),
   telephone: Joi.string(),
   mobile: Joi.string(),
   fax: Joi.string(),
   email: Joi.string(),
   next_of_kin_phone: Joi.string(),
   friend_phone: Joi.string(),
}


const caseJoiSchema = {
   applicant: Joi.object({
      ...personalDetailsSchema,
      institution_name: Joi.string(),
      relationship_to_victim: Joi.string(),
      relationship_to_incident: Joi.string(),
      why_completing_form_on_behalf: Joi.string(),
      location: Joi.string(),
   }),
   defendant: Joi.object({
      ...personalDetailsSchema,
      institution_name: Joi.string(),
   }),
   victim: Joi.object().keys(personalDetailsSchema),
   violation: Joi.object({
      date: Joi.array().items(Joi.date()),
      continuing: Joi.boolean(),
      details: Joi.string(),
      location: Joi.string(),
      witness_details: Joi.string(),
      nature: Joi.string(),
      nature_gender: Joi.string(),
      impact: Joi.string(),
   }),
   other_entity_reported_to: Joi.object().keys({
      details: Joi.string(),
      actions: Joi.string(),
      why_reporting_to_us_as_well: Joi.string(),
   }),
   why_violation_is_important_to_our_mandate: Joi.string(),
   expectations_from_us: Joi.string(),
   lawyer_details: Joi.string(),
   language: Joi.string(),
   who_referred_you_to_us: Joi.string(),
   source: Joi.valid(...Object.values(CASE_SOURCES)),
   title: Joi.string(),
   province: Joi.valid(...Object.values(PROVINCES)),
   more_assistance_required: Joi.string(),
}

// helpers
function thisRoleOrHigher(minRole, role) {
   const roles = [
      USER_ROLES.AGENT,
      USER_ROLES.CASE_OFFICER,
      USER_ROLES.INVESTIGATING_OFFICER,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.SUPER_ADMIN,
   ];

   const minRolePos = roles.indexOf(minRole);
   if (minRolePos === -1)
      throw new Error('Unknown user role: ' + minRole);

   const rolePos = roles.indexOf(role);

   return rolePos >= minRolePos;
   
}

async function areYouAssignedToThisCase(userId, caseId) {
   const count = await Case.countDocuments().where({ _id: caseId, case_officer: userId });
   return count == 1;
}

async function doYouHaveCaseOfficerPriviledgesOnCase(userRole, userId, caseId ) {
   if (userRole === USER_ROLES.CASE_OFFICER) {
      return  await areYouAssignedToThisCase(userId, caseId);
   } else {
      return thisRoleOrHigher(USER_ROLES.INVESTIGATING_OFFICER, userRole)
   }
}


function canViewReports(req, res, next) {

   const userRole = req.auth.user.role;

   if (!thisRoleOrHigher(USER_ROLES.SUPERVISOR, userRole))
      return res.sendStatus(403);

   next();
}


async function countCasesByField(from, to, attr) {

   const results = await Case.aggregate([
      {
         $match: {
            $and: [
               { createdAt: { $gte: new Date(from) } },
               { createdAt: { $lte: new Date(to) } }
            ]
         },
      },
      {
         $group: {
            _id: `$${attr}`,
            count: { $sum: 1 }
         }
      }
   ]);

   return results.reduce((obj, item) => {
      obj[item._id] = item.count;
      return obj;
   }, {});

}



const cases = Router();

// auth middleware
cases.use((req, res, next) => {

   if (!req.auth)
      return res.sendStatus(401);

   next();

});

// routes
/// add case
cases.post('/', async (req, res) => {

   try {
      // validate
      const error = Joi.getError(req.body, caseJoiSchema);
      if (error)
         return res.status(400).send(error);

      // add case
      const case_ = await Case.create({
         ...req.body,
         recorded_by: req.auth.user._id,
      });

      // respond
      res.send({ _id: case_._id });

   } catch (err) {
      status_500(err, res);
   }
});

/// retrieve cases
cases.get('/', async (req, res) => {

   try {

      // retrieve
      const where = {};

      if (req.auth.user.role === USER_ROLES.AGENT) {
         where.recorded_by = req.auth.user._id;
      } else if (req.auth.user.role === USER_ROLES.CASE_OFFICER) {
         where.case_officer = req.auth.user._id;
      }

      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 50;

      const cases = await Case
         .find()
         .where(where)
         .select("_id title applicant.name applicant.surname defendant.name defendant.surname victim.name victim.surname violation.details status ")
         .skip(offset)
         .limit(limit)
         .populate("recorded_by", "_id name surname")
         .populate("case_officer", "_id name surname")

      // respond
      res.send(cases);

   } catch (err) {
      status_500(err, res);
   }
});

/// retrieve summary statistics
cases.get('/summary', canViewReports,async (req, res) => {

   try {

      // retrieve stats
      const from = req.query.from || 0
      const to = req.query.to || Date.now();

      /// gender
      const male = await Case
         .countDocuments({
            createdAt: {
               $gte: from,
               $lte: to,
            },
            $or: [
               { "victim.gender": GENDER.MALE, },
               {
                  victim: {
                     $exists: false,
                  },
                  "applicant.gender": GENDER.MALE,
               }
            ],
         });
      
      const count = await Case.countDocuments();
      const female = count - male;

      const gender = { male, female };
      
      /// location
      const province = await countCasesByField(from, to, "province");

      /// status
      const status = await countCasesByField(from, to, "status");
   
      // respond
      res.send({
         gender,
         province,
         status,
      });

   } catch (err) {
      status_500(err, res);
   }
});

/// retrieve case trend
cases.get('/trend', canViewReports,async (req, res) => {

   try {

      const TREND_PERIODS = {
         WEEKLY: 'WEEKLY',
         MONTHLY: 'MONTHLY',
      }

      // retrieve stats
      const from = parseInt(req.query.from) || 0;
      const to = parseInt(req.query.to) || Date.now();
      let period = req.query.period || TREND_PERIODS.WEEKLY;

      let interval;
      const DAY_MILLIS = 24 * 3600 * 1000;

      switch (period) {
         case TREND_PERIODS.WEEKLY:
            interval = 7 * DAY_MILLIS;
            break;
      
         case TREND_PERIODS.MONTHLY:
            interval = 30 * DAY_MILLIS;
            break

         default:
            return res.status(400).send('Invalid period param: ' + period);
      }
      
      const results = [];
      let start = from;
      let end = start + interval;

      while (true) {

         if (end > to)
            end = to;

         const count = await Case.countDocuments({
            createdAt: {
               $gte: start,
               $lt: end
            }
         });

         results.push({ start, count });
         
         if (end == to)
            break;

         start = end;
         end = start + interval;
      }

      // respond
      res.send(results);

   } catch (err) {
      status_500(err, res);
   }
});

/// retrieve case 
cases.get('/:id', async (req, res) => {

   try {

      // retrieve
      const caseId = req.params.id;

      const where = {
         _id: caseId
      };

      /// authorization
      if (req.auth.user.role === USER_ROLES.AGENT) {
         where.recorded_by = req.auth.user._id;
      } else if (req.auth.user.role === USER_ROLES.CASE_OFFICER) {
         where.case_officer = req.auth.user._id;
      }

      const case_ = await Case
         .findOne()
         .where(where)
         .populate("recorded_by", "_id name surname")
         .populate("case_officer", "_id name surname")

      if (!case_)
         return res.sendStatus(404);

      // respond
      const result = case_.toObject();
      delete result.__v;
      res.send(result);

   } catch (err) {
      status_500(err, res);
   }
});

/// update case
cases.patch('/:id', async (req, res) => {

   try {

      // validate
      const schema = {
         set: caseJoiSchema,
      }

      const error = Joi.getError(req.body, schema); 
      if (error)
         return res.status(400).send(error);

      // authorize
      const userRole = req.auth.user.role;
      const userId = req.auth.user._id;
      const caseId = req.params.id;

      if (userRole === USER_ROLES.AGENT) {
         // did you record this case
         const count = await Case.countDocuments().where({ recorded_by: userId, _id: caseId });

         if (count === 0)
            return res.sendStatus(403);
      } else if (userRole === USER_ROLES.CASE_OFFICER) {
         // are you assigned to this case
         const assignedToThisCase = await areYouAssignedToThisCase(userId, caseId);

         if (!assignedToThisCase)
            return res.sendStatus(403);
      }

      // update
      const $set = flattenDocumentUpdate(req.body.set);
      await Case.updateOne({ _id: caseId }, { $set });

      // respond
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});

/// update case status
cases.post('/:id/status', async (req, res) => {

   try {

      // validate
      const schema = {
         status: Joi.valid(...Object.values(CASE_STATUS)).required(),
      }

      const error = Joi.getError(req.body, schema); 
      if (error)
         return res.status(400).send(error);

      // authorize
      const userRole = req.auth.user.role;
      const userId = req.auth.user._id;
      const caseId = req.params.id;

      const proceed = await doYouHaveCaseOfficerPriviledgesOnCase(userRole, userId, caseId);
      if (!proceed)
         return res.sendStatus(403);

      // update
      const $set = {
         status: req.body.status,
      }

      await Case.updateOne({ _id: caseId }, { $set });

      // respond
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});

/// assign person to case
cases.post('/:id/assignment', async (req, res) => {

   try {

      // validate
      const schema = {
         case_officer: Joi.string().hex().required(),
      }

      const error = Joi.getError(req.body, schema); 
      if (error)
         return res.status(400).send(error);

      // authorize
      const userRole = req.auth.user.role;
      const caseId = req.params.id;

      if (!thisRoleOrHigher(USER_ROLES.INVESTIGATING_OFFICER, userRole)) 
         return res.sendStatus(403);


      // is case_officer really a case officer
      const caseOfficerId = req.body.case_officer;
      const count = await User.countDocuments().where({ _id: caseOfficerId, role: USER_ROLES.CASE_OFFICER });

      if (count === 0)
         return res.status(400).send('Not a case officer');

      // update
      const $set = {
         case_officer: caseOfficerId,
      }

      await Case.updateOne({ _id: caseId }, { $set });

      // respond
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});

/// refer case
cases.post('/:id/referral', async (req, res) => {

   try {

      // validate
      const schema = {
         refer_to: Joi.string().required(),
      }

      const error = Joi.getError(req.body, schema); 
      if (error)
         return res.status(400).send(error);

      // authorize
      const userRole = req.auth.user.role;
      const caseId = req.params.id;

      if (!thisRoleOrHigher(USER_ROLES.INVESTIGATING_OFFICER, userRole)) 
         return res.sendStatus(403);

      // update
      const $set = {
         status: CASE_STATUS.REFERRED,
         referred_to: req.body.refer_to,
      }

      await Case.updateOne({ _id: caseId }, { $set });

      // respond
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});

/// add update to case
cases.post('/:id/updates', async (req, res) => {

   try {

      // validate
      const schema = {
         description: Joi.string().required(),
      }

      const error = Joi.getError(req.body, schema); 
      if (error)
         return res.status(400).send(error);

      // authorize
      const userRole = req.auth.user.role;
      const userId = req.auth.user._id;
      const caseId = req.params.id;

      const proceed = await doYouHaveCaseOfficerPriviledgesOnCase(userRole, userId, caseId);
      if (!proceed)
         return res.sendStatus(403);


      // add update
      const { description } = req.body;
      const _id = new mongoose.mongo.ObjectId();
      
      const $push = {
         updates: { _id, description }
      }

      await Case.updateOne({ _id: caseId }, { $push });

      // respond
      res.send({ _id });

   } catch (err) {
      status_500(err, res);
   }
});

/// edit case update 
cases.patch('/:caseId/updates/:updateId', async (req, res) => {

   try {

      // validate
      const schema = {
         set: {
            description: Joi.string().required(),
         },
      }

      const error = Joi.getError(req.body, schema); 
      if (error)
         return res.status(400).send(error);

      // authorize
      const userRole = req.auth.user.role;
      const userId = req.auth.user._id;
      const { caseId } = req.params;

      const proceed = await doYouHaveCaseOfficerPriviledgesOnCase(userRole, userId, caseId);
      if (!proceed)
         return res.sendStatus(403);

      // edit update
      const { description } = req.body.set;
      const { updateId } = req.params;
      
      const $set = {
         "updates.$.description": description,
      }

      await Case.updateOne({ _id: caseId, "updates._id": updateId }, { $set });

      // respond
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});

/// delete case update 
cases.delete('/:caseId/updates/:updateId', async (req, res) => {

   try {

      // authorize
      const userRole = req.auth.user.role;
      const userId = req.auth.user._id;
      const { caseId } = req.params;

      const proceed = await doYouHaveCaseOfficerPriviledgesOnCase(userRole, userId, caseId);
      if (!proceed)
         return res.sendStatus(403);

      // delete update
      const { updateId } = req.params;
      
      const $pull = {
         "updates": { _id: updateId },
      }

      await Case.updateOne({ _id: caseId }, { $pull });

      // respond
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});


module.exports = cases;