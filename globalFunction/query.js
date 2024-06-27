const { USER_REPORTING_MAPPING, JWT_TOKENS } = require("../constants/strings");

fetchReportingUser =
  () => `select json_agg(user_id) user_id from ${USER_REPORTING_MAPPING}
where reporting_user_ids = $1
and is_active = true`;

checkIfVaildJwt =
  () => `select * from ${JWT_TOKENS} where is_valid = false and jwt_token = $1
`;

setJwtInvalid =
  () => `update ${JWT_TOKENS} set is_valid = false where token = $1
`;

module.exports = {
  fetchReportingUser,
  checkIfVaildJwt,
  setJwtInvalid,
};
