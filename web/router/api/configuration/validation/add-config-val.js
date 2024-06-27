const { createConfigVal } = require("./add-config-joi");

exports.configValidation = async (ctx, next) => {
  try {
    const body = ctx.request.body;
    const { value, error } = createConfigVal(body);
    if (error) return ctx.error(ctx, error.message);
    
    await next();
  } catch (error) {
    throw new Error(error.message);
  }
}