const { CURRENCY_RATE_TBL } = require("../../../../../constants/strings");
const {  update } = require("../../../../../db/pg");

const ratePayload = (body,ctx)=> {
  return {
    price: body.price,
    updated_by: ctx.userId
  };
}

const updateCondition = (payload, rateId) => {
  const whereClause = {};
  let length = Object.keys(payload).length;
  whereClause.text = `WHERE id=$${length + 1}`;
  whereClause.values = [rateId];
  return whereClause;
}

const updatePrice = async (ctx) => {
  try {
    const rateId = ctx.request.params.id;
    const body = ctx.request.body;
    body.userId = process.env.DEFAULT_USER_ID;
    const payload = ratePayload(body,ctx);
    const whereClause = updateCondition(payload,rateId);
    await update({
      whereClause,
      tableName: CURRENCY_RATE_TBL,
      data: payload,
    });
    return ctx.success(ctx, "Price updated successfully")
  } catch (error) {
    return ctx.error(ctx, "Error occurred while updating price", ctx.message);
  }
}

const handler = async (ctx,next) => {
  await updatePrice(ctx);
  await next();
}

module.exports = {
  handler,
}