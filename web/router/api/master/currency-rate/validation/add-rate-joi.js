const Joi = require('joi');

const validate = (schema) =>{
    return (data) => {
        return schema.validate(data,{abortEarly: false});
    }
}

const addRate = Joi.object()
    .keys({
        currency_1: Joi.string().required(),
        currency_2: Joi.string().required(),
        price: Joi.number()
    })
    .unknown(true);

exports.addRateVal = validate(addRate);
