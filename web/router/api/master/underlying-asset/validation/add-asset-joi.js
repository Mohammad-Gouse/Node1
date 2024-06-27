const Joi = require('joi');

const validate = (schema) =>{
    return (data) => {
        return schema.validate(data,{abortEarly: false});
    }
}

const addAsset = Joi.object()
    .keys({
        name: Joi.string().required(),
        description: Joi.string()
    })
    .unknown(true);

exports.addAssetVal = validate(addAsset);
