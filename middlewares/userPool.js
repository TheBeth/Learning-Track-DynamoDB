require("dotenv").config();
const { CognitoUserPool } = require("amazon-cognito-identity-js");

const poolData = {
  UserPoolId: process.env.USER_POOL_ID,
  ClientId: process.env.CLIENT_ID,
};

module.exports = new CognitoUserPool(poolData);
