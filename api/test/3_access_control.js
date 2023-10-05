const { assert } = require("chai");
const { createRequester, createUser, createAccessToken, createCase } = require("./utils");
const { ACCESS_TOKEN_HEADER_NAME } = require("@xavisoft/auth/constants");
const { USER_ROLES } = require("../constants");
const casual = require("casual");

// constants
const requester = createRequester();

// helper functions
async function requestShouldReturnHttp403(method, path, role, errorMessage=undefined) {

   const user = await createUser({ role });
   const accessToken = createAccessToken(user);

   const res = await requester
      [method.toLowerCase()](path)
      .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
      .send({});

   assert.equal(res.status, 403, errorMessage);

}

function excludeRoles(...excluded) {
   return Object
      .values(USER_ROLES)
      .filter(role => !excluded.includes(role));
}

// tests
suite("Access control", function() {

   suite("User management", function() {

      const rolesButSuperAdmin = excludeRoles(USER_ROLES.SUPER_ADMIN);

      test("Only SUPER_ADMIN should create a user", async () => {

         for (let i in rolesButSuperAdmin) {
            const role = rolesButSuperAdmin[i];
            await requestShouldReturnHttp403('POST', `/api/users`, role, `${role.toUpperCase()} should not create a user`);
         }
      });

      test("Only SUPER_ADMIN should retrieve users", async () => {
         for (let i in rolesButSuperAdmin) {
            const role = rolesButSuperAdmin[i];
            await requestShouldReturnHttp403('GET', `/api/users`, role, `${role.toUpperCase()} should not retrieve users`);
         }
      });

      test("Only SUPER_ADMIN should update a user", async () => {
         for (let i in rolesButSuperAdmin) {
            const role = rolesButSuperAdmin[i];
            await requestShouldReturnHttp403('PATCH', `/api/users/ANYTHING`, role, `${role.toUpperCase()} should not update a user`);
         }
      });

      test("Only SUPER_ADMIN delete  a user", async () => {
         for (let i in rolesButSuperAdmin) {
            const role = rolesButSuperAdmin[i];
            await requestShouldReturnHttp403('DELETE', `/api/users/ANYTHING`, role, `${role.toUpperCase()} should not delete a user`);
         }
      });
   });

   suite("Reports", function() {
      test("INVESTING_OFFICER should not view reports", async () => {
         const last4Week = Date.now() - 4 * 7 * 24 * 3600 * 1000;

         await requestShouldReturnHttp403('GET', `/api/cases/trend?period=WEEKLY&from=${last4Week}`, USER_ROLES.INVESTIGATING_OFFICER, "should not view trends");
         await requestShouldReturnHttp403('GET', `/api/cases/summary`, USER_ROLES.INVESTIGATING_OFFICER, "should not view summary statistics");
      });
   });

   suite("Case management", function () {

      suite("POST /api/cases", function () {
         test("MONITOR should not record a case", async () => {
            await requestShouldReturnHttp403('POST', '/api/cases', USER_ROLES.MONITOR);
         });
      });

      suite("GET /api/cases", function () {

         test("INVESTIGATING_OFFICER should only access cases recorded and assigned to", async () => {

            // create user
            const user = await createUser({ role: USER_ROLES.INVESTIGATING_OFFICER });

            // create cases
            await createCase({ recorded_by: user._id });
            await createCase({ assigned_to: user._id });

            // retrieve cases
            const accessToken = createAccessToken(user);

            const res = await requester
               .get('/api/cases')
               .set(ACCESS_TOKEN_HEADER_NAME, accessToken)
               .send();

            assert.equal(res.status, 200);
            assert.equal(res.body.length, 2);

         });

         test("MONITOR should not retrieve cases", async () => {
            await requestShouldReturnHttp403('GET', '/api/cases', USER_ROLES.MONITOR);
         });

      });

      suite("GET /api/cases/:id", function () {
   
         test("INVESTIGATING_OFFICER should not access a case unless they recorded it or working on it", async () => {
            const _case = await createCase();
            const caseIdEncoded = encodeURIComponent(_case._id);
            await requestShouldReturnHttp403('POST', `/api/cases/${caseIdEncoded}`, USER_ROLES.INVESTIGATING_OFFICER);
         });

         test("MONITOR should not access a case", async () => {
            await requestShouldReturnHttp403('POST', `/api/cases/SOMETHING`, USER_ROLES.MONITOR);
         });

      });

      suite("POST /api/cases/:id/status", function () {
         test("Only DIRECTOR and SUPER_ADMIN should be able to update case status", async () => {
            
            const rolesButDirector = excludeRoles(USER_ROLES.DIRECTOR, USER_ROLES.SUPER_ADMIN);

            for (let i in rolesButDirector) {
               const role = rolesButDirector[i];
               await requestShouldReturnHttp403('POST', `/api/cases/ANYTHING`, role, `${role.toUpperCase()} should not update case status`);
            }
         });
      });

      suite("GET /api/cases/officers", function () {
         test("Only MANAGER, DIRECTOR and SUPER_ADMIN should fetch list of investigating officers", async () => {
            const roles = excludeRoles(USER_ROLES.DIRECTOR, USER_ROLES.SUPER_ADMIN, USER_ROLES.MANAGER);

            for (let i in roles) {
               const role = roles[i];
               await requestShouldReturnHttp403('GET', `/api/cases/officers`, role, `${role.toUpperCase()} should not retrieve investigating officers`);
            }
         });
      });

      suite("POST /api/cases/:id/assignment", function () {
         test("Only DIRECTOR, SUPER_ADMIN should assign case", async () => {

            const roles = excludeRoles(USER_ROLES.DIRECTOR, USER_ROLES.SUPER_ADMIN);

            for (let i in roles) {
               const role = roles[i];
               await requestShouldReturnHttp403('GET', `/api/cases/ANYTHING/assignment`, role, `${role.toUpperCase()} should not assign cases`);
            }
         });
      });

      suite("PATCH /api/cases/:id", function () {
         test("Only DIRECTOR, MANAGER and SUPER_ADMIN should edit a case", async () => {

            const roles = excludeRoles(USER_ROLES.DIRECTOR, USER_ROLES.MANAGER, USER_ROLES.SUPER_ADMIN);

            for (let i in roles) {
               const role = roles[i];
               await requestShouldReturnHttp403('PATCH', `/api/cases/ANYTHING`, role, `${role.toUpperCase()} should not edit case`);
            }
         });
      });

      suite("POST /api/cases/:id/referral", function () {
         test("Only DIRECTOR and SUPER_ADMIN should refer a case", async () => {

            const roles = excludeRoles(USER_ROLES.DIRECTOR, USER_ROLES.SUPER_ADMIN);

            for (let i in roles) {
               const role = roles[i];
               await requestShouldReturnHttp403('POST', `/api/cases/ANYTHING/referral`, role, `${role.toUpperCase()} should not refer case`);
            }
         });
      });

      suite("POST /api/cases/:id/recommendation", function () {
         test("Only MANAGER and SUPER_ADMIN should add recommendation to a case", async () => {

            const roles = excludeRoles(USER_ROLES.MANAGER, USER_ROLES.SUPER_ADMIN);

            for (let i in roles) {
               const role = roles[i];
               await requestShouldReturnHttp403('POST', `/api/cases/ANYTHING/recommendation`, role, `${role.toUpperCase()} should not add recommendation to a case`);
            }
         });
      });

      suite("Case updates", function () {
         test("MONITOR should not add, delete or edit an update", async () => {
            await requestShouldReturnHttp403('POST', `/api/cases/SOMETHING/updates`, USER_ROLES.MONITOR);
            await requestShouldReturnHttp403('PATCH', `/api/cases/SOMETHING/updates/SOMETHING`, USER_ROLES.MONITOR);
            await requestShouldReturnHttp403('DELETE', `/api/cases/SOMETHING/updates/SOMETHING`, USER_ROLES.MONITOR);
         });

         test("INVESTIGATING_OFFICER should not add, delete or edit an update to a case they are not assigned to", async () => {
            const _case = await createCase();
            const caseIdEncoded = encodeURIComponent(_case._id);

            await requestShouldReturnHttp403('POST', `/api/cases/${caseIdEncoded}/updates`, USER_ROLES.INVESTIGATING_OFFICER);
            await requestShouldReturnHttp403('PATCH', `/api/cases/${caseIdEncoded}/updates/SOMETHING`, USER_ROLES.INVESTIGATING_OFFICER);
            await requestShouldReturnHttp403('DELETE', `/api/cases/${caseIdEncoded}/updates/SOMETHING`, USER_ROLES.INVESTIGATING_OFFICER);
         });
      });
      
   });

});