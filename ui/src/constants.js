import { USER_ROLES } from "./backend-constants";



const ACTION_TYPES = {
   SET_AUTHENTICATED: 'set-authenticated',
   SET_CURRENT_ROUTE: 'set-current-route',
   SET_USER: 'set-user',
   OPEN_CASE_EDITOR: 'open-case-editor',
   CLOSE_CASE_EDITOR: 'close-case-editor',
}

const NON_SU_ROLES = {  ...USER_ROLES };
delete NON_SU_ROLES.SUPER_ADMIN

export  {
   ACTION_TYPES,
   NON_SU_ROLES,
}
