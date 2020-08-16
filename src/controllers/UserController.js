const User = require('../models/User')
const sendEmail = require('../services/sendEmail')

//controller responsavel por administrar as operacoes em relacao aos usuarios
module.exports = {
    //funcao para editar as informacoes de um user
    async edit(req, res) {
        const _id = req.user._id

        const user = await User.findOne({_id: _id})

        if (!req.body.dataNasc || !req.body.nome || !req.body.endereco || !req.body.cpf) {
            return res.status(400).send('Campo(s) obrigatório(s) vazio(s)!')
        }

        user.nome = req.body.nome
        user.cpf = req.body.cpf
        user.dataNasc = req.body.dataNasc
        user.endereco = req.body.endereco
        
        //biografia opcional
        if (req.body.biografia) {
            user.biografia = req.body.biografia
        }

        //condicional para verificar se o email de confirmacao precisa ser reenviado
        if (req.body.email) {
            const emailAlreadyExists = await User.findOne({email: req.body.email})
            
            if (emailAlreadyExists) {
                return res.status(400).send("Email já cadastrado!")
            }

            user.email = req.body.email
            user.verificado = false
            
            const novoTokenVerificacao = Math.random().toString(36).slice(2)
            user.tokenVerificacao = novoTokenVerificacao
            sendEmail(req.body.email, novoTokenVerificacao)
        }

        const savedUser = await user.save()
        return res.json({completo: true})
    },

    //funcao que lista todos os users
    async index(req, res) {       
        const users = await User.find({_id: {$ne: req.user._id}})

        return res.json(users)
    },

    //funcao que promove um user a admin
    async promoteUser(req, res) {
        //se a variavel promote for true, o usuario eh promovido a admin
        if (req.body.promote) {
            const promotedUser = await User.findOne({_id: req.body.id})
            promotedUser.funcao = "admin"
            const savedUser = await promotedUser.save()
        } 
        //se a variavel promote for false, o usuario tem seu cargo de admin removido
        else {
            const removedUser = await User.findOne({_id: req.body.id})
            removedUser.funcao = "usuario"
            const savedUser = await removedUser.save()
        }

        const users = await User.find({_id: {$ne: req.user._id}})
        return res.json(users)
    }
}