const {query} = rootRequire('db').pg;
const {
  getDataCount,
  getSkipAndLimit,
  getPaginationResponseObject,
} = require("../../../../../globalFunction/paginationSort");
const { getAssetCountQuery, getAllAssetsQuery } = require("./query");

const assetList = async (reqQuery, page) => {
  try {
    let name = reqQuery.name;
    const { skip, limit } = getSkipAndLimit(page, reqQuery.hitPerPage);
    const countResult = await query(getAssetCountQuery());
    const result = await query(getAllAssetsQuery(name, skip, limit));
    return getPaginationResponseObject(page, result.rows.length, getDataCount(countResult), reqQuery.hitPerPage, result.rows);
  } catch (error) {
    throw new Error(error.message) 
  }
}

const getAsset = async (ctx) => {
  try {
    const page = ctx.request.params.num;
    const result = await assetList(ctx.request.query, page);
    if (result.displayCount === 0) return ctx.success(ctx, "No underlying asset available for this request");
    return ctx.success(ctx, "Underlying asset details", result)
  } catch (error) {
    return ctx.error(ctx,"Error occurred while getting underlying asset", error.message);
  }
};

const handler = async (ctx,next) => {
  await getAsset(ctx);
  await next();
}

module.exports = {
  handler,
}