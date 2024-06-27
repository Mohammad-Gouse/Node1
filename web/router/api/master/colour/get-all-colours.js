const { getSkipAndLimit, getPaginationResponseObject, getDataCount } = require("../../../../../globalFunction/paginationSort");
const { getColourCountQuery, getAllColourQuery } = require("./query");
const {query} = rootRequire('db').pg;

const colourList = async (reqQuery, page) => {
  try {
    let name = reqQuery.name;
    const { skip, limit } = getSkipAndLimit(page, reqQuery.hitPerPage);
    const countResult = await query(getColourCountQuery());
    const result = await query(getAllColourQuery(name, skip, limit));
    return getPaginationResponseObject(page, result.rows.length, getDataCount(countResult), reqQuery.hitPerPage, result.rows);
  } catch (error) {
    throw new Error(error.message);
  }
}

const getAllColour = async (ctx) => {
  try {
    const page = ctx.request.params.num;
    const result = await colourList(ctx.request.query, page);
    if (result.displayCount === 0) return ctx.success(ctx, "No colours available for this request");
    return ctx.success(ctx, "Colour detail", result)
  } catch (error) {
    return ctx.error(ctx,"Error occurred while getting colours", error.message);
  }
}

const handler = async (ctx,next) => {
  await getAllColour(ctx);
  await next();
}

module.exports = {
  handler,
}