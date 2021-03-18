const Joi = require('joi');

module.exports = (data) =>{

     const schema = Joi.object({
        name: Joi.string()
        .min(3)
        .max(30)
        .required(),

        firstname: Joi.string()
        .min(3)
        .max(30)
        .required(),

       password: Joi.string()
        .required(),

        gender: Joi.string()
        .required(),

        date: Joi.string()
        .min(10)
        .max(10)
        .required(),

        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
})
       return schema.validate(data)
}
