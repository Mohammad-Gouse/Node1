const { query } = require("../../../../../../db/pg");
const { findSize } = require("../query");

exports.sizeDeleteValidation = async (ctx, next) => {
  try {
    const sizeId = ctx.request.params.id;
    const found = checkSizeExist(sizeId);
    if (!found) return ctx.error(ctx, "Size not found");
    await next();
  } catch (error) {
    throw new Error(error.message);
  }
}

const checkSizeExist = async (shapeId) => {
  try {
    const check = await query(findSize(shapeId));
    if (check.rowCount > 0) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}