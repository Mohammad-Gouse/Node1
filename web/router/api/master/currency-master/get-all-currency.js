const {query} = rootRequire('db').pg;
const {
  getDataCount,
  getSkipAndLimit,
  getPaginationResponseObject,
} = require("../../../../../globalFunction/paginationSort");
const { getCurrencyCountQuery, getAllCurrencysQuery } = require("./query");

const currencyList = async (reqQuery, page) => {
  try {
    let name = reqQuery.name;
    const { skip, limit } = getSkipAndLimit(page, reqQuery.hitPerPage);
    const countResult = await query(getCurrencyCountQuery());
    const result = await query(getAllCurrencysQuery(name, skip, limit));
    return getPaginationResponseObject(page, result.rows.length, getDataCount(countResult), reqQuery.hitPerPage, result.rows);
  } catch (error) {
    throw new Error(error.message) 
  }
}

const getCurrency = async (ctx) => {
  try {
    const page = ctx.request.params.num;
    const result = await currencyList(ctx.request.query, page);
    if (result.displayCount === 0) return ctx.success(ctx, "No currency available for this request");
    return ctx.success(ctx, "Currency details", result)
  } catch (error) {
    return ctx.error(ctx, error.message);
  }
};

const handler = async (ctx,next) => {
  await getCurrency(ctx);
  await next();
}

module.exports = {
  handler,
}