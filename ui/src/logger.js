
import * as Sentry from "@sentry/react";

function init() {
   Sentry.init({
      dsn: "https://49fa081b5b93425e580b722e6e373d25@o4504122577059840.ingest.sentry.io/4505727258198016",
      integrations: [
         new Sentry.BrowserTracing({}),
         new Sentry.Replay(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 1.0,
      replaysOnErrorSampleRate: 1.0,
   });
}

function error(err) {
   Sentry.captureException(err);
}

function log(msg) {
   Sentry.captureMessage(msg);
}

const logger = {
   init,
   error,
   log,
};


export default logger;