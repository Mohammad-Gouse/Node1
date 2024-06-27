const { PRODUCT_MASTER_TBL,SHAPE_TBL,SIZE_TBL,COLOUR_TBL,CLARITY_TBL,UNDERLYING_ASSET_TBL,USER_PRICE_TBL } = require("../../../../constants/strings");
const {
    pagination,
    sort,
  } = require("../../../../globalFunction/paginationSort");


exports.userPriceDirtyPriceCalculationQuery = (filters) => {
    let fields = `up.product_id,up.price`;
    let count = `COUNT(*)`;
    return `
    SELECT ${isCount ? count : "*"} FROM (
        SELECT ${fields}
      FROM ${USER_PRICE_TBL} AS up
    ) as subquery
      WHERE ${filters}   
    `;
};