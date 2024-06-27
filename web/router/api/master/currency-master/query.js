const { CURRENCY_MASTER_TBL } = require("../../../../../constants/strings");
const { sort } = require("../../../../../globalFunction/paginationSort");

exports.getCurrencyCountQuery = () =>
    `SELECT COUNT(*) FROM ${CURRENCY_MASTER_TBL} WHERE is_active=true`;

exports.getAllCurrencysQuery = (name, skip, limit) => {
    let nameCondition = name !== undefined ? `name ILIKE '%${name}%' AND` : "";
    return `
      SELECT id, name
      FROM ${CURRENCY_MASTER_TBL}
      WHERE
        ${nameCondition}
        is_active = true
      ${sort(null, "updated_at", "desc")}
      LIMIT ${limit} OFFSET ${skip}
    `;
  };

exports.CurrencyExistQuery = (CurrencyId) => 
  `SELECT * FROM ${CURRENCY_MASTER_TBL} WHERE id='${CurrencyId}' AND is_active=true`;
  
  
exports.deleteCurrencyQuery = (CurrencyId) => 
  `UPDATE ${CURRENCY_MASTER_TBL} SET is_active = false WHERE id='${CurrencyId}' AND is_active=true`