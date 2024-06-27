const { CLARITY_TBL } = require("../../../../../constants/strings");
const { update } = rootRequire('db').pg;

const clarityPayload = (body) => {
  return {
    is_active: false,
    updated_by: body.userId
  }
}

const updateCondition = (payload, id) => {
  const whereClause = {};
  let length = Object.keys(payload).length;
  whereClause.text = `WHERE id=$${length + 1}`;
  whereClause.values = [id];
  return whereClause;
}

const deleteClarity = async (ctx) => {
  try {
    const clarityId = ctx.request.params.id;
    const body = ctx.request.body;
    body.userId = process.env.DEFAULT_USER_ID;
    const payload = clarityPayload(ctx);
    const whereClause = updateCondition(payload, clarityId);
    await update({
      whereClause,
      tableName: CLARITY_TBL,
      data: payload,
    })
    return ctx.success(ctx, "Clarity deleted successfully");
  } catch (error) {
    return ctx.error(ctx, "Error occurred while deleting clarity", error.message);
  }
}

const handler = async (ctx, next) => {
  await deleteClarity(ctx);
  await next();
}

module.exports = {
  handler,
}