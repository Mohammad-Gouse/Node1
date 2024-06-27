const { createVal } = require("./userVal");
const { USERS } = require("../../../../../constants/strings");

exports.userJoiValidation = async (ctx, next) => {
  try {
    let body = ctx.request.body;
    const { value, error } = await createVal(body);
    if (error) return ctx.error(ctx, "Validation Error", error.message);
    const check = await checkDuplicate(value.email);
    if (check) return ctx.error(ctx, "Email already exists")
    await next();
  } catch (error) {
    await next();
  }
}

async function checkDuplicate(email) {
  try {
    const userCount = await query(`select * from ${USERS} where email=$1 and is_active=true`,[email]);
    if (userCount.rowCount > 0) return true;
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}
