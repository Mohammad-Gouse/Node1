const Joi=require("joi")

const { checkDuplicate } = require("../checkDuplicateProductMaster");

exports.productMasterValidation = async (ctx, next) => {
  try {
    let payload = ctx.request.body;
    const {error, value} = validateProductMaster(payload);
    if (error) return ctx.error(ctx, "Validation Error", error.message);
    const check = await checkDuplicate(payload.shape, payload.size, payload.clarity, payload.colour);
    if (check) return ctx.error(ctx, "Product already exists")
    await next();
  } catch (error) {
    ctx.error(ctx, "Interval Server error", error.message);
    await next();
  }
}

const validateProductMaster = (payload) => {
  try {
    const masterValidation = Joi.object({
      underlying_id: Joi.string().required(),
      shape: Joi.string().required(),
      clarity: Joi.string().required(),
      size: Joi.string().required(),
      colour: Joi.string().required(),
    });
    return masterValidation.validate(payload,  {abortEarly: false })
  } catch (error) {
    throw new Error(error.message);
  }
}
