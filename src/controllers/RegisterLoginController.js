const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../services/sendEmail')

//controller responsavel por administrar as operacoes de cadastro e login
module.exports = {
    //funcao de login
    async login(req, res) {
        const user = await User.findOne({email: req.body.email})
        if (!user) return res.status(400).send('Email não cadastrado')

        const validPass = await bcrypt.compare(req.body.senha, user.senha)
        if (!validPass) return res.status(400).send('Senha inválida')

        //seta um token de login para o usuario recem logado
        const token = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN)
        
        //seta uma variavel para dizer se o user eh admin ou nao
        let funcao = false
        if (user.funcao == "admin") funcao = true

        //seta uma constante para verificar se o user ta com as informaçoes completas
        const completo = ((user.nome && user.cpf && user.endereco && user.dataNasc) !== undefined)
        
        return res.header('auth-token', token).json({token, email: user.email, funcao, verificado: user.verificado, completo})
    },

    //funcao de cadastro de um usuario
    async register(req, res) {        
        const emailExist = await User.findOne({email: req.body.email})
        if (emailExist) return res.status(400).send('Email já cadastrado')

        //fazendo hash da senha
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.senha, salt)

        //gerando um token aleatorio de verificacao de email
        const tokenVerificacao = Math.random().toString(36).slice(2)

        const user = new User({
            email: req.body.email,
            senha: hashedPassword,
            funcao: req.body.funcao,
            verificado: false,
            tokenVerificacao
        })

        try {
            const savedUser = await user.save()
            sendEmail(req.body.email, tokenVerificacao)
            return res.send(savedUser)
        } catch(err) {
            return res.status(400).send(err)
        }
    },

    //funcao para reenviar email de verificacao
    async resendEmail(req, res) {
        const user = await User.findOne({email: req.body.email})
        if (!user) return res.status(400).send('Email não cadastrado')

        sendEmail(req.body.email, user.tokenVerificacao)

        return res.status(200).send('Email reenviado!')
    },

    //funcao para verificar um email pelo token de verificacao
    async verifyEmail(req, res) {
        const token = req.body.token
        const user = await User.findOne({tokenVerificacao: `${token}`})

        if (!user) return res.status(400).send('Usuário não existe')

        user.verificado = true
        const savedUser = await user.save()
        return res.send(savedUser)
    }
}