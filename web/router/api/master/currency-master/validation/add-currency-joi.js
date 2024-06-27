const Joi = require('joi');

const validate = (schema) =>{
    return (data) => {
        return schema.validate(data,{abortEarly: false});
    }
}

const addCurrency = Joi.object()
    .keys({
        currency: Joi.string().required()
    })
    .unknown(true);

exports.addCurrencyVal = validate(addCurrency);
