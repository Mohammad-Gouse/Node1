const { query } = require("../../../../../../db/pg");
const { shapeExistQuery } = require("../query");

exports.deleteShapeValidation = async(ctx,next) => {
  try {
    const shapeId = ctx.request.params.id;
    const found = await checkShapeExist(shapeId);
    if (!found) return ctx.error(ctx, "Shape not found!");
    await next();
  } catch (error) {
    throw new Error(error.message);
  }
}

const checkShapeExist = async(shapeId) => {
  try {
    const shapeCount = await query(shapeExistQuery(shapeId));
    if (shapeCount.rowCount > 0) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}