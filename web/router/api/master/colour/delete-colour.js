const { COLOUR_TBL } = require("../../../../../constants/strings");
const { update } = require("../../../../../db/pg");

const colourPayload = (body) => {
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

const deleteColour = async (ctx) => {
  try {
    const colourId = ctx.request.params.id;
    const body = ctx.request.body;
    body.userId = process.env.DEFAULT_USER_ID;
    const payload = colourPayload(ctx);
    const whereClause = updateCondition(payload, colourId);
    await update({
      whereClause,
      tableName: COLOUR_TBL,
      data: payload,
    });
    return ctx.success(ctx, "Colour deleted successfully");
  } catch (error) {
    return ctx.error(ctx, "Error occurred while deleting colour", error.message);
  }
}

const handler = async (ctx, next) => {
  await deleteColour(ctx);
  await next();
}

module.exports = {
  handler,
}