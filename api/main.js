
console.clear();

require('dotenv').config();
require('./logger').init();
require('./env');

const express = require('express');
const { init: initAuth } = require('./auth');
const { init: initDB } = require('./db');
const morgan = require('morgan');
const cors = require('cors');
const users = require('./users');
const cases = require('./cases');
const accounts = require('./accounts');
const { ACCESS_TOKEN_HEADER_NAME, REFRESH_TOKEN_HEADER_NAME } = require('@xavisoft/auth/constants');
const CaseNumberGenerator = require('./CaseNumberGenerator');

const app = express();

// middlewares
app.use(express.json());

if (process.env.NODE_ENV !== 'test')
   app.use(morgan('tiny'));

const allowedHeaders = [ ACCESS_TOKEN_HEADER_NAME, REFRESH_TOKEN_HEADER_NAME, 'content-type', 'baggage', 'sentry-trace' ];

app.use(cors({
   allowedHeaders: allowedHeaders,
   exposedHeaders: allowedHeaders,
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

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
   await CaseNumberGenerator.init();

   // start server
   app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'test')
         console.log("Server started!!!");
   });
})();
