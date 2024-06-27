const { query } = require("../../../../../../db/pg");
const { findClarity } = require("../query");
const { createClarityVal } = require("./add-clarity-joi");

exports.clarityValidation = async (ctx, next) => {
  try {
    const body = ctx.request.body;
    const { value, error } = await createClarityVal(body);
    if (error) return ctx.error(ctx, "Validation Error", error.message);
    const check = await checkDuplicate(value.clarity);
    if (check) return ctx.success(ctx, "Clarity already exists");
    await next();
  } catch (error) {
    throw new Error(error.message);
  }
}

const checkDuplicate = async (clarityName) => {
  try {
    const clarityCount = await query(findClarity(clarityName));
    if (clarityCount.rowCount > 0) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}