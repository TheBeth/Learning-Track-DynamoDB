const {
  AuthenticationDetails,
  CognitoUser,
} = require("amazon-cognito-identity-js");
const UserPool = require("../middlewares/userPool");

exports.login = (req, res) => {
  const { userName, password } = req.body;
  const user = new CognitoUser({
    Username: userName,
    Pool: UserPool,
  });
  const AuthDetail = new AuthenticationDetails({
    Username: userName,
    Password: password,
  });
  user.authenticateUser(AuthDetail, {
    onSuccess(data) {
      console.log;
      res.status(200).json(data.accessToken.jwtToken);
    },
    onFailure(data) {
      res.status(400).json(data);
    },
    newPasswordRequired(data) {
      res.status(200).json(data);
    },
  });
};
