const { query } = rootRequire("db").pg;
const {
  getAllTagsQuery,
  getTagCountQuery,
  productMasterQuery,
} = require("./query");
const {
  getDataCount,
  getSkipAndLimit,
  getPaginationResponseObject,
} = require("../../../../utils/pagination");

const getProductMasterDetails = async (ctx) => {
  try {
    const page = ctx.request.data.product_id;
    let whereCondition = filterBy
      ? `${filterBy} ILIKE '%${filterValue}%' AND`
      : "";
    const count = await query(
      productMasterQuery(whereCondition, null, null, true)
    );
    const productQuery = productMasterQuery(
      whereCondition,
      limit,
      skip,
      false,
      sortBy,
      sort
    );
    let { rows } = await query(productQuery);
    let result = getPaginationResponseObject(
      page,
      getDataCount(count),
      hitsPerPage,
      rows
    );
    return ctx.success(ctx, "Product details", result);
  } catch (error) {
    return ctx.error(
      ctx,
      "Error occurred while getting product master details",
      error.message
    );
  }
};

const handler = async (ctx, next) => {
  await getProductMasterDetails(ctx);
  await next();
};

module.exports = {
  handler,
};
