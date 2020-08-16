const mongoose = require('mongoose')


//model de uma sala de reuniao
const meetingRoomSchema = new mongoose.Schema({
    nome: {
        type: String, 
    },
    desc: {
        type: String,
    },
    horariosDisp: {
        type: [String],
    },
    horariosOcupados: {
        type: [String]
    }
})

module.exports = mongoose.model('MeetingRoom', meetingRoomSchema)