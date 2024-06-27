const { query } = require("../../../../db/pg");
const { checkLoginCredentials } = require("./query");
const jwt = require("jsonwebtoken");

const userObj = (data) => {
  let user = {
    userId: data.id,
    email: data.email,
  };
  return user;
};

const createJwtToken = async (data) => {
  try {
    const token = jwt.sign(data, process.env.JWT_SECRET_TOKEN_SOCKET, {
      expiresIn: "48h",
    });
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

const login = async (ctx) => {
  try {
    const body = ctx.request.body;
    const text = checkLoginCredentials();
    const userdata = await query(text, [body.email]);
    const object = userObj(userdata.rows[0]);
    const token = await createJwtToken(object);

    const role = await query(
      `select rr.name as name from user_role_mapping as urm left join  rbac_roles rr on rr.id=urm.role_id where user_id='${object.userId}'`
    );

    console.log("user roel:", role.rows[0].name);
    let data = {
      token: token,
      role: role.rows[0].name,
    };
    return ctx.success(ctx, data);
  } catch (error) {
    return ctx.error(ctx, "Error occurred while login", error.message);
  }
};

const handler = async (ctx, next) => {
  await login(ctx);
  await next();
};

module.exports = {
  handler,
};
