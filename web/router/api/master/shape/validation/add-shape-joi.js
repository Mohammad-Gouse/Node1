const Joi = require('joi');

const validate = (schema) =>{
    return (data) => {
        return schema.validate(data,{abortEarly: false});
    }
}

const addShape = Joi.object()
    .keys({
        shape: Joi.string().required()
    })
    .unknown(true);

exports.addShapeVal = validate(addShape);
