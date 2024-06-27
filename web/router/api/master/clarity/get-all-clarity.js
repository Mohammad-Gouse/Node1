const { query } = rootRequire('db').pg;
const { getSkipAndLimit, getPaginationResponseObject, getDataCount } = require("../../../../../globalFunction/paginationSort");
const { getClarityCount, getAllClarityQuery } = require("./query");

const clarityList = async (reqQuery, page) => {
  try {
    let name = reqQuery.name;
    const { skip, limit } = getSkipAndLimit(page, reqQuery.hitPerPage);
    const countResult = await query(getClarityCount());
    const result = await query(getAllClarityQuery(name, limit, skip));

    return getPaginationResponseObject(page,result.rows.length, getDataCount(countResult), reqQuery.hitPerPage, result.rows)
  } catch (error) {
    throw new Error(error.message);
  }
}

const getClarity = async (ctx) => {
  try {
    const page = ctx.request.params.num;
    const result = await clarityList(ctx.request.query, page);
    if (result.displayCount === 0) return ctx.success(ctx, "No clarity available for this request");
    return ctx.success(ctx, "Clarity details", result);
  } catch (error) {
    return ctx.error(ctx, "Error occured while getting clarity", error.message);
  }
}

const handler = async (ctx, next) => {
  await getClarity(ctx);
  await next();
}

module.exports = {
  handler,
}