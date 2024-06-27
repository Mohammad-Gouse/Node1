const Joi = require('joi');

const validate = (schema) => {
  return (data) => {
    return schema.validate(data,{abortEarly: false});
  }
}

const sizeVal = Joi.object()
  .keys({
    carat: Joi.number().precision(2).min(0.01).required(),
    
  })
  .unknown(true);

exports.createSizeVal = validate(sizeVal);