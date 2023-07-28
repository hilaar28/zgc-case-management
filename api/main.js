
console.clear();

require('dotenv').config();
require('./env');

const express = require('express');
const { init: initAuth } = require('./auth');
const { init: initDB } = require('./db');
const morgan = require('morgan');
const users = require('./users');
const cases = require('./cases');
const accounts = require('./accounts');

const app = express();

// middlewares
app.use(express.json());

if (process.env.NODE_ENV !== 'test')
   app.use(morgan('tiny'));

initAuth(app);

// routes
const api = express.Router();
app.use('/api', api);

api.use('/users', users);
api.use('/cases', cases);
api.use('/accounts', accounts);

// initialization
const PORT = process.env.PORT;

(async () => {
   
   // db init
   await initDB();

   // start server
   app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'test')
         console.log("Server started!!!");
   });
})();
