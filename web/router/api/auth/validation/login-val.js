const { loginVal } = require("./login-joi");
const { USERS } = require("../../../../../constants/strings");
const { query } = require("../../../../../db/pg");
const { decryptPassword } = require("../../../../../utils/encrypt-password");

exports.loginJoiValidation = async (ctx, next) => {
  try {
    let body = ctx.request.body;
    const { value, error } = await loginVal(body);
    if (error) return ctx.error(ctx, "Validation Error", error.message);
    const check = await checkExist(value.email, value.password);
    if (!check) return ctx.error(ctx, "Email or password does not match");
    await next();
  } catch (error) {
    throw new Error(error.message);
  }
}

async function checkExist(email,userPassword) {
  try {
    const userLogin = await query(`SELECT password FROM ${USERS} WHERE email=$1 AND is_active=true`,[email]);
    if (userLogin.rowCount>0) {
      const result = await decryptPassword(userPassword, userLogin.rows[0].password);
      return result;
    }
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}
