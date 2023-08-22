const { USER_ROLES } = require("./constants");

function thisRoleOrHigher(minRole, role) {
   const roles = [
      USER_ROLES.AGENT,
      USER_ROLES.CASE_OFFICER,
      USER_ROLES.INVESTIGATING_OFFICER,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.SUPER_ADMIN,
   ];

   const minRolePos = roles.indexOf(minRole);
   if (minRolePos === -1)
      throw new Error('Unknown user role: ' + minRole);

   const rolePos = roles.indexOf(role);

   return rolePos >= minRolePos;
   
}

module.exports = {
   thisRoleOrHigher,
}