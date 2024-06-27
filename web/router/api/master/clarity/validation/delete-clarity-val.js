const { getClariytUsingId } = require("../query");

const { query } = rootRequire('db').pg;

exports.deleteClarityValidation = async (ctx, next) => {
  try {
    const id = ctx.request.params.id;
    const found = await checkClarityExist(id);
    if (!found) return ctx.error(ctx, "Clarity not found!");
    await next();
  } catch (error) {
    throw new Error(error.message);
  }
}

const checkClarityExist = async (clarityId) => {
  try {
    const check = await query(getClariytUsingId(clarityId));
    if (check.rowCount > 0) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}
