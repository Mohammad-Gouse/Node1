const { SHAPE_TBL } = require("../../../../../constants/strings");
const {  update } = require("../../../../../db/pg");

const shapePayload = (body)=> {
  return {
    is_active: false,
    updated_by: body.userId 
  };
}

const updateCondition = (payload, shapeId) => {
  const whereClause = {};
  let length = Object.keys(payload).length;
  whereClause.text = `WHERE id=$${length + 1}`;
  whereClause.values = [shapeId];
  return whereClause;
}

const deleteShape = async (ctx) => {
  try {
    const shapeId = ctx.request.params.id;
    const payload = shapePayload(ctx);
    const whereClause = updateCondition(payload,shapeId);
    await update({
      whereClause,
      tableName: SHAPE_TBL,
      data: payload,
    });
    return ctx.success(ctx, "Shape deleted successfully")
  } catch (error) {
    return ctx.error(ctx, "Error occurred while deleting shape", ctx.message);
  }
}

const handler = async (ctx,next) => {
  await deleteShape(ctx);
  await next();
}

module.exports = {
  handler,
}