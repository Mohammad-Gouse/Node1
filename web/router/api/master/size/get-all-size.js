const { getSkipAndLimit, getPaginationResponseObject, getDataCount } = require("../../../../../globalFunction/paginationSort");
const { getSizeCount, getAllSizeQuery } = require("./query");
const { query } = rootRequire('db').pg;

const sizeList = async (reqQuery, page) => {
  try {
    const carat = reqQuery.carat;
    console.log(carat)
    const { skip, limit } = getSkipAndLimit(page, reqQuery.hitsPerPage);
    const sizeCount = await query(getSizeCount());
    const result = await query(getAllSizeQuery(carat, limit, skip));
    console.log(result)
    return getPaginationResponseObject(page, result.rows.length, getDataCount(sizeCount), reqQuery.hitsPerPage, result.rows);
  } catch (error) {
    throw new Error(error.message);
  }
}

const getAllSize = async (ctx) => {
  try {
    console.log(ctx)
    const page = ctx.request.params.num;
    const result = await sizeList(ctx.request.query, page);
    if (result.displayCount === 0) return ctx.success(ctx, "No sizes available for this request");
    return ctx.success(ctx, "Size Detail", result);
  } catch (error) {
    return ctx.error(ctx, "Error occurred while getting the sizes", error.message);
  }
}

const handler = async (ctx,next) => {
  await getAllSize(ctx);
  await next();
}

module.exports = {
  handler,
}