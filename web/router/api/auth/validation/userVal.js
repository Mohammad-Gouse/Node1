const Joi = require('joi');

const validate = schema =>{
    return (data)=>{
        return schema.validate(data,{abortEarly: false});
    }
}

const createUser = Joi.object()
    .keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        role: Joi.string().required()
    })
    .unknown(true);

exports.createVal = validate(createUser);