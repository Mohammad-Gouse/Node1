const { insert } = rootRequire("db").pg;
const { USERS, USER_ROLE_MAPPING } = require("../../../../constants/strings");
const { query } = require("../../../../db/pg");
const { encrypt } = require("../../../../utils/encrypt-password");

const userRoleMapping = async (role_id,user_id) => {

  try {
    let data={
      role_id,
      user_id
    }
    return insert({
      data,
      tableName: USER_ROLE_MAPPING,
      returnClause: ["id"],
    });

  } catch (error) {
    throw new Error(error.message)
  }
};

const register = async (ctx) => {
  try {
    await query("BEGIN")
    let data = ctx.request.body;
    let role_id=data.role;
    delete data.role
    const encryptPassword = await encrypt(data.password);
    data.password = encryptPassword;
    const { rows } = await insert({
      data,
      tableName: USERS,
      returnClause: ["id"],
    });
    let user_id = rows[0].id;
    await userRoleMapping(role_id,user_id)
    await query("COMMIT")
    return ctx.success(ctx, "User register successfully");
  } catch (error) {
    await query("ROLLBACK")

    return ctx.error(ctx, "Error occurred while adding user", error.message);
  }
};

const handler = async (ctx, next) => {
  await register(ctx);
  await next();
};

module.exports = {
  handler,
};  
