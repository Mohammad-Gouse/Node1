const Joi = require('joi');

const validate = (schema) => {
  return (data) => {
    return schema.validate(data, {abortEarly: false});
  }
}

const clarityVal = Joi.object()
  .keys({
    clarity: Joi.string().required()
  })
  .unknown(true);

exports.createClarityVal = validate(clarityVal);