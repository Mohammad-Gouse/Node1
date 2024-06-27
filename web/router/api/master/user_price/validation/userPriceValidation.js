const Joi = require("joi");
const { validator } = require("../../../../../../helpers/validator");
const { PRODUCT_MASTER_TBL } = require("../../../../../../constants/strings");

exports.userPriceValidation = async (ctx, next) => {
  try {
    let payload = ctx.request.body;
    const { error, value } = validateUserPrice(payload);
    if (error) return ctx.error(ctx, "Validation Error", error.message);
    // const check = await checkDuplicate(payload.shape, payload.size, payload.clarity, payload.colour);
    // if (check) return ctx.error(ctx, "Product already exists")
    await next();
  } catch (error) {
    ctx.error(ctx, "Interval Server error", error.message);
    await next();
  }
};

const validateUserPrice = (payload) => {
  try {
    const masterValidation = Joi.object({
      // shape: Joi.string().required(),
      // size: Joi.string().required(),
      // clarity: Joi.string().required(),
      // colour: Joi.string().required(),
      tags: Joi.array(),
      // product_id: Joi.string().required(),
      // price: Joi.number().positive().precision(2).required(),
      remark: Joi.string().optional(),
    });
    return masterValidation.validate(payload, { abortEarly: false });
  } catch (error) {
    throw new Error(error.message);
  }
};
