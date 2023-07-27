
console.clear();

require('dotenv').config();
require('./env');

const express = require('express');
const { init: initAuth } = require('./auth');
const { init: initDB } = require('./db');
const morgan = require('morgan');
const users = require('./users');

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

// initialization
const PORT = process.env.PORT;

(async () => {
   
   // db init
   await initDB();

   // start server
   app.listen(PORT, () => {
      console.log("Server started!!!");
   });
})();
