const mongoose = require('mongoose')

//model de um usuario
const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        
    },
    email: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true,
    },
    dataNasc: {
        type: String,
    },
    cpf: {
        type: String,
    },
    endereco: {
        type: String,
    },
    biografia: {
        type: String, 
    },
    funcao: {
        type: String,
        required: true
    },
    verificado: {
        type: Boolean,
        required: true
    },
    tokenVerificacao: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)