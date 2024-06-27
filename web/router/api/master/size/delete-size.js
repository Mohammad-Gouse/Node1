const { SIZE_TBL } = require("../../../../../constants/strings");
const { update } = require("../../../../../db/pg");

const sizePayload = (body) => {
  return {
    is_active: false,
    updated_by: body.userId
  };
};

const updateCondition = (payload, sizeId) => {
  const whereClause = {};
  const length = Object.keys(payload).length;
  whereClause.text = `WHERE id=$${length + 1}`;
  whereClause.values = [sizeId];
  return whereClause;
}

const deleteSize = async (ctx) => {
  try {
    const sizeId = ctx.request.params.id;
    const payload = sizePayload(ctx);
    const whereClause = updateCondition(payload, sizeId);
    await update({
      whereClause,
      tableName: SIZE_TBL,
      data: payload
    })
    return ctx.success(ctx, "Size deleted successfully")
  } catch (error) {
    return ctx.error(ctx, "Error occurred while deleting size", error.message);
  }
}

const handler = async (ctx, next) => {
  await deleteSize(ctx);
  await next();
}

module.exports = {
  handler,
}