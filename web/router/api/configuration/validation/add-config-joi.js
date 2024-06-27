const Joi = require("joi");

const validate = (schema) => {
  return (data) => {
    return schema.validate(data, { abortEarly: false });
  };
};

const configVal = Joi.object()
  .keys({
    percentage: Joi.number().allow(null).empty(""),
    count: Joi.number().allow(null).empty(""),
    days_count: Joi.number().integer(),
    days_type: Joi.string(),
    threshold_value: Joi.number().integer(),
  })
  .or("percentage", "count")
  .unknown(true);

exports.createConfigVal = validate(configVal);
