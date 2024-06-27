const { UNDERLYING_ASSET_TBL: UNDERLYING_ASSET } = require("../../../../../constants/strings");
const {  update } = require("../../../../../db/pg");

const assetPayload = (body)=> {
  return {
    is_active: false,
    updated_by: body.userId
  };
}

const updateCondition = (payload, assetId) => {
  const whereClause = {};
  let length = Object.keys(payload).length;
  whereClause.text = `WHERE id=$${length + 1}`;
  whereClause.values = [assetId];
  return whereClause;
}

const deleteAsset = async (ctx) => {
  try {
    const assetId = ctx.request.params.id;
    const body = ctx.request.body;
    body.userId = process.env.DEFAULT_USER_ID;
    const payload = assetPayload(ctx);
    const whereClause = updateCondition(payload,assetId);
    await update({
      whereClause,
      tableName: UNDERLYING_ASSET,
      data: payload,
    });
    return ctx.success(ctx, "Underlying asset deleted successfully")
  } catch (error) {
    return ctx.error(ctx, "Error occurred while deleting underlying asset", ctx.message);
  }
}

const handler = async (ctx,next) => {
  await deleteAsset(ctx);
  await next();
}

module.exports = {
  handler,
}