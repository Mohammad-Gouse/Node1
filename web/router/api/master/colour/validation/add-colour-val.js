const { COLOUR_TBL, COLUMN_NAME } = require("../../../../../../constants/strings");
const { query } = require("../../../../../../db/pg");
const { createColour } = require("./add-colour-joi");

exports.colourJoiValidation = async (ctx, next) => {
  try {
    const body = ctx.request.body;
    const { value, error } = await createColour(body);
    if (error) return ctx.error(cts, "Validation Error", error.message);
    const check = await checkDuplicate(value.colour);
    if (check) return ctx.error(ctx, "Colour already exist");
    await next();
  } catch (error) {
    throw new Error(ctx.message);
  }
}

const checkDuplicate = async (name) => {
  try {
    const colourCount = await query(`SELECT id FROM ${COLOUR_TBL} WHERE name=$1 AND is_active = true`, [name]);
    if (colourCount.rowCount > 0) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}