const CognitoExpress = require("cognito-express");

const cognitoExpress = new CognitoExpress({
  region: process.env.AWS_DEFAULT_REGION,
  cognitoUserPoolId: process.env.USER_POOL_ID,
  tokenUse: "access",
  tokenExpiration: 360000,
});

exports.validateAuth = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    cognitoExpress.validate(token, function (err, response) {
      if (err) {
        res.status(401).send(err);
      } else {
        next();
      }
    });
  } else {
    res.status(401).send("No token provided.");
  }
};
