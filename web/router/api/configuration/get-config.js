const { selectQuery } = require("./query");

const {query} = rootRequire('db').pg;

const getConfig = async (ctx) => {
  try {
    const result = await query(selectQuery);

    return ctx.success(ctx, result.rows);
  } catch (error) {
    return ctx.error(ctx, "Error while getting the data", error.message);
  }
}

const handler = async (ctx,next) => {
  await getConfig(ctx);
  await next();
}

module.exports = {
  handler,
}