const Joi = require('@hapi/joi')


const registerValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
                .required()
                .email(),
        senha: Joi.string()
                .required()
                .min(6),
        cpf: Joi.string()
                .required()
                .min(11)
    
    })

    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
