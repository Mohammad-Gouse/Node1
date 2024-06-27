const { insert } = rootRequire("db").pg;
const { query } = rootRequire("db").pg;
const {
  createUpdateUser,
  createUpdate,
} = require("../../../../../globalFunction/createdUpdated");

const {
  USER_PRICE_TBL,
  PRODUCT_MASTER_TBL,
  DCX_PRICE,
} = require("../../../../../constants/strings");

const saveDcxPriceService = async (ctx) => {
  try {
    const data = ctx.request.body;
    console.log({ data });
    for (const tag of data) {
      // Iterate directly over data
      console.log({ tag });
      const price_data = {
        product_id: tag.product_id,
        price: tag.price,
        created_by: ctx.userId,
        updated_by: ctx.userId,
      };
      await insert({
        data: await createUpdate(price_data, ctx), // Pass price_data to createUpdate
        returnClause: ["id"],
        tableName: DCX_PRICE,
      });
    }
    // Move the success response outside of the loop
    return ctx.success(ctx, "User added Price successfully");
  } catch (error) {
    // Handle errors
    return ctx.error(ctx, error.message);
  }
};

const handler = async (ctx, next) => {
  await saveDcxPriceService(ctx);
  await next();
};

module.exports = {
  handler,
};
