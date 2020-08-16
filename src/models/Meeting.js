const mongoose = require('mongoose')


//model de uma reuniao
const meetingSchema = new mongoose.Schema({
    nome: {
        type: String, 
    },
    desc: {
        type: String,
    },
    sala: {
        type: String,
    },
    nomeSala: {
        type: String,
    },
    horario: {
        type: String,
    },
    criador: {
        type: String,
    },
    criadorId: {
        type: String,
    },
    participantes: {
        type: [String],
    }
})

module.exports = mongoose.model('Meeting', meetingSchema)