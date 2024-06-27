const { CURRENCY_RATE_TBL } = require("../../../../../constants/strings");
const {  update } = require("../../../../../db/pg");

const ratePayload = (body)=> {
  return {
    is_active: false,
    updated_by: body.userId
  };
}

const updateCondition = (payload, rateId) => {
  const whereClause = {};
  let length = Object.keys(payload).length;
  whereClause.text = `WHERE id=$${length + 1}`;
  whereClause.values = [rateId];
  return whereClause;
}

const deleteRate = async (ctx) => {
  try {
    const rateId = ctx.request.params.id;
    const body = ctx.request.body;
    body.userId = process.env.DEFAULT_USER_ID;
    const payload = ratePayload(ctx);
    const whereClause = updateCondition(payload,rateId);
    await update({
      whereClause,
      tableName: CURRENCY_RATE_TBL,
      data: payload,
    });
    return ctx.success(ctx, "Currency rate deleted successfully")
  } catch (error) {
    return ctx.error(ctx, "Error occurred while deleting currency rate", ctx.message);
  }
}

const handler = async (ctx,next) => {
  await deleteRate(ctx);
  await next();
}

module.exports = {
  handler,
}