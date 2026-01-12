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
         email: Joi.string().email().required(),
         role: Joi.valid(...Object.values(USER_ROLES)).required(),
      }

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      // check if email is taken
      const { email } = req.body;

      const count = await User
         .countDocuments()
         .where({ email });

      if (count > 0)
         return res.status(409).send(`Email "${email}" already exists`);

      // save user and send password via email
      let _id;

      try {
         // create user
         const password = casual.uuid;

         const user = new User({
            ...req.body,
            password,
         });

         await user.save();
         _id = user._id;

         // log password for dev
         console.log(`New user password for ${req.body.email}: ${password}`);

      } catch (err) {
         throw err;
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
            email: Joi.string().email(),
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

      try {
         // save
         await user.save();

         // log password for dev
         if (email) {
            console.log(`Updated user password for ${user.email}: ${password}`);
         }

      } catch (err) {
         throw err;
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

      try {
         // delete user
         const _id = req.params.id
         await User.deleteOne().where({ _id });

         // remove case references reference
         await Case.updateMany({ case_officer: _id }, { $unset: { case_officer: 1 }});

      } catch (err) {
         throw err;
      }

      // respond
      res.send();
      
   } catch (err) {
      status_500(err, res);
   }
});



module.exports = users;