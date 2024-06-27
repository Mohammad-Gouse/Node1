const { query } = require("../../../../../db/pg");
const { getSkipAndLimit, getPaginationResponseObject, getDataCount } = require("../../../../../globalFunction/paginationSort");
const { getUserPriceCount, getUserPrice } = require("./query");

const configPayload = (reqQuery) => {
  const { underlying_id, shape, clarity, colour, size } = reqQuery;
  const queryParams = { underlying_id, shape, clarity, colour, size };
  let productData = {};
  for (const key in queryParams) {
    if (queryParams[key]) {
      productData[key] = queryParams[key];
    }
  }
  return productData;
}

const whereCondition = (payload) => {
  const whereClause = {};
    const keys = Object.keys(payload);
    const whereText = keys.map((key, index) => {
        return `${key} = $${index + 1}`;
    }).join(' AND ');

    whereClause.text = `${whereText}`;
    whereClause.values = Object.values(payload);
    return whereClause;
}

const userPriceList = async (reqQuery, page, userId) => {
  try {
    const { skip, limit } = getSkipAndLimit(page, reqQuery.hitPerPage);
    const payload = configPayload(reqQuery);
    const whereClause = whereCondition(payload);
    const countResult = await query(getUserPriceCount(userId, whereClause.text),whereClause.values);
    const result = await query(getUserPrice(userId, skip, limit, whereClause.text),whereClause.values);
    return getPaginationResponseObject(page, countResult.rows[0].count, getDataCount(countResult), reqQuery.hitPerPage, result.rows);
  } catch (error) {
    throw new Error(error.message);
  }
}

const addPrice = async(ctx) => {
  try {
    const page = ctx.request.params.num;
    const userId = ctx.userId;
    const result = await userPriceList(ctx.request.query, page, userId);
    if (result.displayCount === 0)  return ctx.success(ctx, "No price available");
    return ctx.success(ctx, "Price", result);
  } catch (error) {
    return ctx.error(ctx,"Error occurred while getting price history", error.message);
  }
}

const handler = async (ctx,next) => {
  await addPrice(ctx),
  await next();
}

module.exports = {
  handler,
}