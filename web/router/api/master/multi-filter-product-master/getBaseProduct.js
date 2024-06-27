const { query } = rootRequire("db").pg;

const {
  getProductCount,
  getFilteredData,
  getBaseProductQuery,
} = require("./query");

const getBaseProductService = async (ctx) => {
  try {
    let result = await query(getBaseProductQuery());
    console.log(result);
    return ctx.success(ctx, result.rows);
  } catch (error) {
    return ctx.error(ctx, error.message);
  }
};

const handler = async (ctx, next) => {
  await getBaseProductService(ctx);
  await next();
};

module.exports = {
  handler,
};
