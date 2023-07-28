const { Router } = require("express");
const status_500 = require("./status_500");
const User = require("./db/User");
const { compare } = require("bcrypt");
const Joi = require("@xavisoft/joi");
const { default: mongoose } = require("mongoose");
const logger = require("./logger");
const casual = require("casual");
const Temp = require("./db/Temp");
const capitalize = require("capitalize");
const mail = require("./mail");


const accounts = Router();

// middlewares
accounts.use((req, res, next) => {

   if (!req.auth) {
      if (req.path.indexOf('/password-reset') !== 0)
         return res.sendStatus(401);
   }

   next();
});


// routes
/// get account info
accounts.get('/', async (req, res) => {

   try {

      // retrieve data
      const userId = req.auth.user._id;
      const user = await User.findById(userId).select('-password -updatedAt -__v');

      // respond
      res.send(user);

   } catch (err) {
      status_500(err, res);
   }
});

/// update password
accounts.post('/new-password', async (req, res) => {

   try {

      // verify schema
      const schema = {
         old_password: Joi.string().required(),
         new_password: Joi.string().required(),
      }

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      // verify old password
      const userId = req.auth.user._id;
      const user = await User.findById(userId);

      const { old_password } = req.body;
      const isOldPasswordValid = await compare(old_password, user.password);

      if (!isOldPasswordValid)
         return res.status(400).send('Invalid old password');

      // update password
      const { new_password } = req.body;
      user.password = new_password;
      await user.save();

      // respond
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});

/// reset password
accounts.post('/password-reset', async (req, res) => {

   try {

      // verify schema
      const schema = {
         email: Joi.string().email().required(),
      }

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      // check if email exists
      const email = req.body.email.toLowerCase();
      const user = await User.findOne().where({ email });

      if (!user)
         return res.status(400).send('No user with that email');

      // reset password
      /// create transaction
      const session = await mongoose.startSession();
      session.startTransaction();

      try {

         // create a temporary document
         const password = casual.uuid;
         const userId = user._id;

         const temp = new Temp({
            data: {
               password,
               user: userId,
            }
         });

         await temp.save({ session });

         // send new password to email
         const link = `${process.env.SYSTEM_URL}/reset-password/${temp._id}`;
         
         let text = `Hi ${capitalize.words(user.name)},\n\n`;
         text += `We received a request to reset your password. The new password is "${password}". Click the link below to activate it:\n`;
         text += link;

         const to = email;
         const subject = 'Password reset';

         await mail.send({ to, subject, text });

         // commit transaction
         await session.commitTransaction();

      } catch (err) {
         
         try {
            await session.abortTransaction();
         } catch (err) {
            logger.log(err);
         }

         throw err;

      } finally {
         session.endSession();
      }

      // respond
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});

/// verify password password
accounts.post('/password-reset/:ref_code/verification', async (req, res) => {

   try {
      
      // validate ref_code
      const tempId = req.params.ref_code;
      const temp = await Temp.findById(tempId);

      if (!temp)
         return res.sendStatus(404);

      // update password
      /// create transaction
      const session = await mongoose.startSession();
      session.startTransaction();

      try {

         // update password
         const { user: userId, password } = temp.data;
         const user = await User.findById(userId);

         user.password = password;
         await user.save({ session });

         // delete temp
         await temp.deleteOne({ session });

         // commit transaction
         await session.commitTransaction();

      } catch (err) {
         
         try {
            await session.abortTransaction();
         } catch (err) {
            logger.log(err);
         }

         throw err;

      } finally {
         session.endSession();
      }
     
      // respond
      res.send();

   } catch (err) {
      status_500(err, res);
   }
});



module.exports = accounts;