const { Router } = require("express");
const { USER_ROLES } = require("./constants");
const status_500 = require("./status_500");
const Joi = require('@xavisoft/joi');
const casual = require('casual');
const User = require("./db/User");
const capitalize = require("capitalize");
const mail = require('./mail');
const { default: mongoose } = require("mongoose");
const logger = require("./logger");
const Case = require("./db/Case");


const users = Router();

// auth middleware
users.use((req, res, next) => {

   if (!req.auth)
      return res.sendStatus(401);
   
   if (req.auth.user.role !== USER_ROLES.SUPER_ADMIN)
      return res.sendStatus(403);

   next();

});

// add user
users.post('/', async (req, res) => {

   try {

      // validate schema
      const schema = {
         name: Joi.string().required(),
         surname: Joi.string().required(),
         email: Joi.string().required(),
         role: Joi.valid(...Object.values(USER_ROLES)).required(),
      }

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      // save user and send password via email
      const session = await mongoose.startSession();
      session.startTransaction();

      let _id;

      try {
         // create user
         const password = casual.uuid;

         const user = new User({
            ...req.body,
            password,
         });

         await user.save({ session });
         _id = user._id;

         // send email
         const { name, email } = req.body;
         const text = `Hi ${capitalize.words(name)},\n\n.An account hase been created for you on the ZGC Case Management Platform. Here is your password:\n${password}`;
         const to = email;
         const subject  = "Account created";

         await mail.send({ to, subject, text });

         await session.commitTransaction();

      } catch (err) {
         
         try {
            await session.abortTransaction();
         } catch (err) {
            logger.error(err);
         }

         throw err;

      } finally {
         await session.endSession();
      }

      // respond
      res.send({ _id });

   } catch (err) {
      status_500(err, res);
   }
});

// update user
users.patch('/:id', async (req, res) => {

   try {

      // validate schema
      const schema = {
         set: Joi.object().keys({
            name: Joi.string(),
            surname: Joi.string(),
            email: Joi.string(),
            role: Joi.valid(...Object.values(USER_ROLES)),
         }).min(1).required(),
      }

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      // update user
      const updates = req.body.set;
      const { email } = updates;

      let password;
      
      if (email) {
         password = casual.uuid;
         updates.password = password;
      }

      const _id = req.params.id;
      const user = await User.findById(_id);

      for (let attr in updates) {
         user[attr] = updates[attr];
      }

      /// transaction
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
         // save
         await user.save({ session });

         // send email
         if (email) {
            const { name } = user;
            const text = `Hi ${capitalize.words(name)},\n\n.An account hase been created for you on the ZGC Case Management Platform. Here is your password:\n${password}`;
            const to = email;
            const subject  = "Account created";

            await mail.send({ to, subject, text });

         }
         
         await session.commitTransaction();

      } catch (err) {
         
         try {
            await session.abortTransaction();
         } catch (err) {
            logger.error(err);
         }

         throw err;

      } finally {
         await session.endSession();
      }

      // respond
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});

// retrieve users
users.get('/', async (req, res) => {

   try {

      // retrieve data 
      const users = await User
         .find()
         .select("_id name surname email role");

      // respond
      res.send(users);

   } catch (err) {
      status_500(err, res);
   }
});

// delete user
users.delete('/:id', async (req, res) => {

   try {

      // delete user
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
         // delete user
         const _id = req.params.id
         await User.deleteOne().where({ _id }).session(session);

         // remove case references reference
         await Case.updateMany({ case_officer: _id }, { $unset: { case_officer: 1 }}).session(session);
        
         // commit
         await session.commitTransaction();

      } catch (err) {
         
         try {
            await session.abortTransaction();
         } catch (err) {
            logger.error(err);
         }

         throw err;

      } finally {
         await session.endSession();
      }

      // respond
      res.send();
      
   } catch (err) {
      status_500(err, res);
   }
});



module.exports = users;