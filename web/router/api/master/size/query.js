const { SIZE_TBL } = require("../../../../../constants/strings");
const { sort } = require("../../../../../globalFunction/paginationSort");

exports.checkDuplicateSize = (carat) => 
  `SELECT id 
  FROM ${SIZE_TBL} 
  WHERE carat=${carat} 
  AND is_active=true`;

exports.getSizeCount = () => `SELECT COUNT(*) FROM ${SIZE_TBL} WHERE is_active=true`;

exports.getAllSizeQuery = (carat,limit,skip) => {

  let rangeQuery = (carat !== undefined ? `carat = ${carat}` : "")

  if (rangeQuery !== "") rangeQuery = `(${rangeQuery}) AND`;

  return `SELECT id,carat
  FROM ${SIZE_TBL}
  WHERE ${rangeQuery} 
  is_active=true
  ${sort(null,"carat","asc")}
  LIMIT ${limit} OFFSET ${skip}`
}

exports.findSize = (sizeId) =>
  `SELECT id FROM ${SIZE_TBL} WHERE id=${sizeId} AND is_active=true`;