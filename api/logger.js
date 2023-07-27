
const Sentry = require("@sentry/node");


Sentry.init({
   dsn: process.env.SENTRY_DSN,
   tracesSampleRate: 1.0,
});



function error(err) {
   Sentry.captureException(err);
}

function log(err) {
   Sentry.captureMessage(err);
}


const sentryLogger = {
   error,
   log
}

const logger = process.env.NODE_ENV === 'development' ? console : sentryLogger;

module.exports = logger;