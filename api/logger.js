
const Sentry = require("@sentry/node");


function init() {
   Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
   });
}



function error(err) {
   Sentry.captureException(err);
}

function log(err) {
   Sentry.captureMessage(err);
}


const sentryLogger = {
   init,
   error,
   log
}

const logger = process.env.NODE_ENV === 'development' ? console : sentryLogger;

module.exports = logger;