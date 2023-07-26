const casual = require("casual");
const { waitForServer, createUser, createRequester } = require("./utils");
const { assert } = require("chai");
const { ACCESS_TOKEN_HEADER_NAME, REFRESH_TOKEN_HEADER_NAME } = require('@xavisoft/auth/constants');
const jwt = require('jsonwebtoken');


const requester = createRequester();


suite("Auth", function () {

   this.beforeAll(waitForServer);

   test("Login", async () => {
      
      // create user
      const password = casual.password;

      const user = await createUser({ password });
      const { email } = user;

      // send request
      const payload = { email, password };

      const res = await requester
         .post('/api/login')
         .send(payload);

      assert.equal(res.status, 200);

      // check headers
      const accessToken = res.headers[ACCESS_TOKEN_HEADER_NAME]
      assert.isString(accessToken);
      assert.isString(res.headers[REFRESH_TOKEN_HEADER_NAME]);

      // check access token
      const userInfo = jwt.decode(accessToken).user;
      assert.equal(userInfo._id, user._id.toHexString());
      
   });

});