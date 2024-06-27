const { query } = require("../../../../../../db/pg");
const { getSpecificColour } = require("../query");

exports.colourValidation = async (ctx, next) => {
  try {
    const colourId = ctx.request.params.id;
    const found = await checkExist(colourId);
    if (!found) return ctx.error(ctx, "Colour not found!");
    await next();
  } catch (error) {
    throw new Error(error.message);
  }
}

const checkExist = async (colourId) => {
  try {
    const check = await query(getSpecificColour(colourId));
    if (check.rowCount > 0) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}
