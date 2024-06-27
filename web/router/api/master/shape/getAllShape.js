const {query} = rootRequire('db').pg;
const {
  getDataCount,
  getSkipAndLimit,
  getPaginationResponseObject,
} = require("../../../../../globalFunction/paginationSort");
const { getShapeCountQuery, getAllShapesQuery } = require("./query");

const shapeList = async (reqQuery, page) => {
  try {
    let name = reqQuery.name;
    const { skip, limit } = getSkipAndLimit(page, reqQuery.hitPerPage);
    const countResult = await query(getShapeCountQuery());
    const result = await query(getAllShapesQuery(name, skip, limit));
    return getPaginationResponseObject(page, result.rows.length, getDataCount(countResult), reqQuery.hitPerPage, result.rows);
  } catch (error) {
    throw new Error(error.message) 
  }
} 

const getShapes = async (ctx) => {
  try {
    const page = ctx.request.params.num;
    const result = await shapeList(ctx.request.query, page);
    if (result.displayCount === 0) return ctx.success(ctx, "No shapes available for this request");
    return ctx.success(ctx, "Shape details", result)
  } catch (error) {
    return ctx.error(ctx, error.message);
  }
};

const handler = async (ctx,next) => {
  await getShapes(ctx);
  await next();
}

module.exports = {
  handler,
}