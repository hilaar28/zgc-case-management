
const {
   CASE_SOURCES,
   CASE_STATUS,
   GENDER,
   MARITAL_STATUS,
   PROVINCES,
   USER_ROLES,

} = require('./backend-constants');


const ACTION_TYPES = {
   SET_AUTHENTICATED: 'set-authenticated',
   SET_CURRENT_ROUTE: 'set-current-route',
   SET_USER: 'set-user',
   OPEN_CASE_EDITOR: 'open-case-editor',
   CLOSE_CASE_EDITOR: 'close-case-editor',
}


export  {
   ACTION_TYPES,
   CASE_SOURCES,
   CASE_STATUS,
   GENDER,
   MARITAL_STATUS,
   PROVINCES,
   USER_ROLES,
}
