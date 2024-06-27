const { query } = rootRequire("db").pg;
const { InvalidToken } = require("./query");

const logic = async (ctx) => {
  try {
    const authHeader = ctx.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const body = ctx.request.body;

    if (!body.deviceId)
      return ctx.success(ctx, `device ID missing`, null, null, 200);
    const text = InvalidToken();
    const res = await query(text, [token]);
    return ctx.success(ctx, `Logout successfully`);
  } catch (error) {
    return ctx.error(ctx, error.message);
  }
};

const handler = async (ctx, next) => {
  await logic(ctx);
  await next();
};

module.exports = {
  handler,
};
