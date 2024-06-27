const Joi = require('joi');

const validate = schema =>{
    return (data)=>{
        return schema.validate(data,{abortEarly: false});
    }
}

const loginUser = Joi.object()
    .keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    .unknown(true);

exports.loginVal = validate(loginUser);