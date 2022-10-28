const {
  AuthenticationDetails,
  CognitoUser,
} = require("amazon-cognito-identity-js");
const UserPool = require("../middlewares/userPool");

exports.login = async (req, res) => {
  const { userName, password, newPassword } = req.body;

  const user = new CognitoUser({
    Username: userName,
    Pool: UserPool,
  });

  const AuthDetail = new AuthenticationDetails({
    Username: userName,
    Password: password,
  });

  try {
    const result = () => {
      return new Promise(function (resolve, reject) {
        user.authenticateUser(AuthDetail, {
          onSuccess: resolve,
          onFailure: reject,

          newPasswordRequired: (userAttributes, requiredAttributes) => {
            Object.keys(userAttributes).forEach((key) => {
              if (key != "email") {
                delete userAttributes[key];
              }
            });

            user.completeNewPasswordChallenge(newPassword, userAttributes, {
              onSuccess() {
                res.status(200).json({ message: "Password Changed" });
              },
              onFailure(data) {
                if (data.name === "InvalidPasswordException") {
                  return res
                    .status(200)
                    .json({ message: "InvalidPasswordException" });
                } else if (
                  data.message.toString() === "New password is required."
                ) {
                  return res
                    .status(200)
                    .json({ message: "New password is required" });
                } else {
                  return res.status(400).json(err.message);
                }
              },
            });
          },
        });
      });
    };
    const token = await result();
    if (token) {
      let accessToken = token.getAccessToken().getJwtToken();
      let idToken = token.getIdToken().getJwtToken();
      let refreshToken = token.getRefreshToken().getToken();

      return res.status(200).json({ accessToken, idToken, refreshToken });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
