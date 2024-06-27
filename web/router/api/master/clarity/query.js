const { CLARITY_TBL } = require("../../../../../constants/strings");
const { sort } = require("../../../../../globalFunction/paginationSort");

exports.findClarity = (clarityName) => `SELECT id FROM ${CLARITY_TBL} WHERE name='${clarityName}' and is_active=true`

exports.getClarityCount = () => `SELECT COUNT(*) FROM ${CLARITY_TBL} WHERE is_active=true`;

exports.getAllClarityQuery = (name,limit,skip) => {
  let nameCondition = name !== undefined ? `name ILIKE '${name}' AND `: "";
  return `SELECT id, name 
  FROM ${CLARITY_TBL}
  WHERE ${nameCondition}
  is_active = true
  ${sort(null, "name", "asc")}
  LIMIT ${limit} OFFSET ${skip}`
}

exports.getClariytUsingId = (clarityId) => `SELECT id FROM ${CLARITY_TBL} WHERE id='${clarityId}' AND is_active=true`;