const {query} = rootRequire('db').pg;
const {
  getDataCount,
  getSkipAndLimit,
  getPaginationResponseObject,
} = require("../../../../../globalFunction/paginationSort");
const { getRateCountQuery, getAllRatesQuery } = require("./query");

const rateList = async (reqQuery, page) => {
  try {
    let currency1 = reqQuery.currency1;
    let currency2 = reqQuery.currency2;
    const { skip, limit } = getSkipAndLimit(page, reqQuery.hitPerPage);
    const countResult = await query(getRateCountQuery());
    const result = await query(getAllRatesQuery(currency1,currency2, skip, limit));
    return getPaginationResponseObject(page, result.rows.length, getDataCount(countResult), reqQuery.hitPerPage, result.rows);
  } catch (error) {
    throw new Error(error.message) 
  }
}

const getRate = async (ctx) => {
  try {
    const page = ctx.request.params.num;
    const result = await rateList(ctx.request.query, page);
    if (result.displayCount === 0) return ctx.success(ctx, "No currency rate available for this request");
    return ctx.success(ctx, "Currency rate details", result)
  } catch (error) {
    return ctx.error(ctx, error.message);
  }
};

const handler = async (ctx,next) => {
  await getRate(ctx);
  await next();
}

module.exports = {
  handler,
}