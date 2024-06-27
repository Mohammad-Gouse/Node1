const { UNDERLYING_ASSET } = require("../../../../../constants/strings");
const { sort } = require("../../../../../globalFunction/paginationSort");

exports.getAssetCountQuery = () =>
  `SELECT COUNT(*) FROM ${UNDERLYING_ASSET} WHERE is_active=true`;

exports.getAllAssetsQuery = (name, skip, limit) => {
  let nameCondition = name !== undefined ? `name ILIKE '%${name}%' AND` : "";
  return `
      SELECT id, name,description
      FROM ${UNDERLYING_ASSET}
      WHERE
        ${nameCondition}
        is_active = true
      ${sort(null, "updated_at", "desc")}
      LIMIT ${limit} OFFSET ${skip}
    `;
};

exports.assetExistQuery = (assetId) =>
  `SELECT * FROM ${UNDERLYING_ASSET} WHERE id='${assetId}' AND is_active=true`;

exports.deleteAssetQuery = (assetId) =>
  `UPDATE ${UNDERLYING_ASSET} SET is_active = false WHERE id='${assetId}' AND is_active=true`