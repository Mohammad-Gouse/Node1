const Joi = require('joi');

const validate = (schema) => {
  return (data) => {
    return schema.validate(data,{ abortEarly: false });
  };
};

const addColour = Joi.object()
  .keys({
    colour: Joi.string().required()
  })
  .unknown(true);

exports.createColour = validate(addColour);