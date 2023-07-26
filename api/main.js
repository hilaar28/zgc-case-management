
console.clear();

require('dotenv').config();
require('./env');

const express = require('express');
const { init: initAuth } = require('./auth');
const { init: initDB } = require('./db');
const morgan = require('morgan');

const app = express();

// middlewares
app.use(express.json());

if (process.env.NODE_ENV !== 'test')
   app.use(morgan('tiny'));

initAuth(app);

// routes
const PORT = process.env.PORT;

// initialization
(async () => {
   
   // db init
   await initDB();

   // start server
   app.listen(PORT, () => {
      console.log("Server started!!!");
   });
})();
