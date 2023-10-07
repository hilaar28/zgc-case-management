import { USER_ROLES } from "./backend-constants";
import { deepFreezeObject } from "./shared-utils";



const ACTION_TYPES = deepFreezeObject({
   SET_AUTHENTICATED: 'set-authenticated',
   SET_CURRENT_ROUTE: 'set-current-route',
   SET_USER: 'set-user',
   OPEN_CASE_EDITOR: 'open-case-editor',
   CLOSE_CASE_EDITOR: 'close-case-editor',
});

const NON_SU_ROLES = {  ...USER_ROLES };
delete NON_SU_ROLES.SUPER_ADMIN
deepFreezeObject(NON_SU_ROLES);

export  {
   ACTION_TYPES,
   NON_SU_ROLES,
}
