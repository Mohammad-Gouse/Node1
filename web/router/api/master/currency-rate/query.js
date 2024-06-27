const { CURRENCY_RATE_TBL } = require('../../../../../constants/strings');
const { sort } = require("../../../../../globalFunction/paginationSort");

exports.findDuplicateRate = (currency1,currency2) => 
  `SELECT * FROM ${CURRENCY_RATE_TBL} WHERE currency_1='${currency1}' AND currency_2='${currency2}' and is_active=true`

exports.getRateCountQuery = () =>
    `SELECT COUNT(*) FROM ${CURRENCY_RATE_TBL} WHERE is_active=true`;

exports.getAllRatesQuery = (currency1,currency2, skip, limit) => {
  let nameCondition = 
        (currency1 !== undefined ? `currency_1 ILIKE '%${currency1}%'` : "") +
        (currency1 !== undefined && currency2 !== undefined ? " AND " : "") +
        (currency2 !== undefined ? `currency_2 ILIKE '%${currency2}%'` : "");
  
  if (nameCondition !== "") {
      nameCondition = `(${nameCondition}) AND`;
  }
    return `
      SELECT id, currency_1,currency_2,price
      FROM ${CURRENCY_RATE_TBL}
      WHERE
        ${nameCondition}
        is_active = true
      ${sort(null, "updated_at", "desc")}
      LIMIT ${limit} OFFSET ${skip}
    `;
  };

exports.RateExistQuery = (RateId) => 
  `SELECT * FROM ${CURRENCY_RATE_TBL} WHERE id='${RateId}' AND is_active=true`;
  
exports.deleteRateQuery = (RateId) => 
  `UPDATE ${CURRENCY_RATE_TBL} SET is_active = false WHERE id='${RateId}' AND is_active=true`