const { CURRENCY_MASTER_TBL } = require("../../../../../constants/strings");
const {  update } = require("../../../../../db/pg");

const currencyPayload = (body)=> {
  return {
    is_active: false,
    updated_by: body.userId
  };
};

const updateCondition = (payload, currencyId) => {
  const whereClause = {};
  let length = Object.keys(payload).length;
  whereClause.text = `WHERE id=$${length + 1}`;
  whereClause.values = [currencyId];
  return whereClause;
}

const deletecurrency = async (ctx) => {
  try {
    const currencyId = ctx.request.params.id;
    const body = ctx.request.body;
    body.userId = process.env.DEFAULT_USER_ID;
    const payload = currencyPayload(ctx);
    const whereClause = updateCondition(payload,currencyId);

    await update({
      whereClause,
      tableName: CURRENCY_MASTER_TBL,
      data: payload,
    });
    return ctx.success(ctx, "Currency deleted successfully")
  } catch (error) {
    return ctx.error(ctx, "Error occurred while deleting currency", ctx.message);
  }
}

const handler = async (ctx,next) => {
  await deletecurrency(ctx);
  await next();
}

module.exports = {
  handler,
}