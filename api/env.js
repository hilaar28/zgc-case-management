


function presenceChecker(keys=[]) {
   keys.forEach(key => {

      if (!process.env[key]) {
         throw new Error(`Environment variable '${key}' is essential`);
      }
   });
}

const BASE_KEYS = [
   'IMAP_USERNAME',
   'IMAP_PASSWORD',
   'PASSWORD_SALT_ROUNDS',
   'NODE_ENV',
   'JWT_SECRET',
   'SYSTEM_URL',
   'SENTRY_DSN',
   'DB_URL',
   'PORT',
];


presenceChecker(BASE_KEYS);

const CONDITIONAL_KEYS = [];

presenceChecker(CONDITIONAL_KEYS);