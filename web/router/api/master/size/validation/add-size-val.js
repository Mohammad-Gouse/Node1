const { SIZE_TBL } = require("../../../../../../constants/strings");
const { checkDuplicateSize } = require("../query");
const { createSizeVal } = require("./add-size-joi");
const {query} = rootRequire('db').pg;

exports.sizeValidation = async (ctx,next) => {
  try {
    const body = ctx.request.body;
  const {value,error} = await createSizeVal(body);
  if(error) return ctx.error(ctx, "Validation error", error.message);
  const check = await checkDuplicate(value.carat);
  if (check) return ctx.error(ctx, "Size already exists");
  await next();
  } catch (error) {
    return ctx.error(ctx, "Error",error.message);
  }
}

const checkDuplicate = async (carat) => {
  try {
    const result = await query(`SELECT id 
    FROM ${SIZE_TBL} 
    WHERE carat=${carat} 
    AND is_active=true`);
    if (result.rowCount > 0) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}