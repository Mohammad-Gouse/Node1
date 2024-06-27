const { query } = rootRequire("db").pg;
const {
  getSkipAndLimit,
  getPaginationResponseObject,
  getDataCount,
} = require("../../../../../globalFunction/paginationSort");
const { getProductCount, getFilteredData } = require("./query");

const configPayload = (ctx) => {
  const { underlying_id, shape, clarity, colour, size } = ctx.request.query;
  const queryParams = { underlying_id, shape, clarity, colour, size };
  let productData = {};
  for (const key in queryParams) {
    if (queryParams[key]) {
      productData[key] = queryParams[key];
    }
  }
  return productData;
};

const whereCondition = (payload) => {
  const whereClause = {};
  const keys = Object.keys(payload);
  const whereText = keys
    .map((key, index) => {
      return `${key} = $${index + 1}`;
    })
    .join(" AND ");

  whereClause.text = `${whereText}`;
  whereClause.values = Object.values(payload);
  return whereClause;
};

const productList = async (reqQuery, page, ctx) => {
  try {
    const { skip, limit } = getSkipAndLimit(page, reqQuery.hitsPerPage);
    const countResult = await query(getProductCount());
    const payload = configPayload(ctx);
    const whereClause = whereCondition(payload);
    const result = await query(
      getFilteredData(whereClause.text, skip, limit),
      whereClause.values
    );
    // console.log(query(getFilteredData(whereClause.text, skip, limit),whereClause.values))
    return getPaginationResponseObject(
      page,
      result.rowCount,
      getDataCount(countResult),
      reqQuery.hitPerPage,
      result.rows
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

const multiFilter = async (ctx) => {
  console.log({ ctx });
  try {
    const page = ctx.request.params.num;
    const result = await productList(ctx.request.query, page, ctx);
    if (result.displayCount === 0) return ctx.success(ctx, "No data present");

    return ctx.success(ctx, result);
  } catch (error) {
    return ctx.error(ctx, error.message);
  }
};

const handler = async (ctx, next) => {
  await multiFilter(ctx);
  await next();
};

module.exports = {
  handler,
};
