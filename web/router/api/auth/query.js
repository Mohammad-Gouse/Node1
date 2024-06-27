const { USERS, JWT_TOKENS, USER_EMAIL, USER_PASSWORD } = require("../../../../constants/strings");

exports.checkLoginCredentials = () =>
  `select id, email,password from ${USERS} where email = $1 and is_active = true`;

exports.insertJwtToken = () =>
  `insert into ${JWT_TOKENS} (user_id, jwt_token, is_valid) values($1, $2, true)
`;

exports.InvalidToken = () =>
  `update ${JWT_TOKENS} set is_valid = false where jwt_token = $1
`;


