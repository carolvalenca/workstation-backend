const Meeting = require('../models/Meeting')
const MeetingRoom = require('../models/MeetingRoom')
const User = require('../models/User')

//controller responsavel por administrar as operacoes relacionadas a reunioes
module.exports = {
    //lista todas as reunioes
    async index(req, res) {
        const meetings = await Meeting.find({})

        return res.json(meetings)
    },

    //lista apenas as reunioes do user logado
    async indexUserMeetings(req, res) {
        const meetings = await Meeting.find({criadorId: req.user._id})

        return res.json(meetings)
    },

    //lista apenas as reunioes que nao sao do user logado
    async indexOtherMeetings(req, res) {
        const meetings = await Meeting.find({criadorId: {$ne: req.user._id}})

        return res.json(meetings)
    },

    //cria uma nova reuniao
    async create(req, res) {
        const actualUser = await User.findOne({_id: req.user._id})

        //pega o id da sala desejada para reuniao e o horario desejado
        const salaDesejada = req.body.sala.idSala
        const horarioDesejado = req.body.sala.horario

        const sala = await MeetingRoom.findOne({_id: salaDesejada})
        
        //checa se o horario disponivel ta ocupado
        if (sala.horariosOcupados.indexOf(horarioDesejado) !== -1) {
            return res.status(400).send('Horário indisponível')
        }

        //torna o horario desejado da reuniao antes disponivel em ocupado
        sala.horariosDisp = sala.horariosDisp.filter(horario => horario !== horarioDesejado)
        sala.horariosOcupados.push(horarioDesejado)

        const meeting = new Meeting({
            nome: req.body.nome,
            desc: req.body.desc,
            sala: sala._id,
            nomeSala: sala.nome,
            horario: horarioDesejado,
            criador: actualUser.nome,
            criadorId: actualUser._id,
            participantes: []
        })

        try {
            const savedMeeting = await meeting.save()
            const savedRoom = await sala.save()
            return res.send(savedRoom)
        } catch(err) {
            return res.status(400).send(err)
        }
    },

    //deleta uma determinada reuniao
    async delete(req, res) {
        const actualUser = await User.findOne({_id: req.user._id})

        const meeting = await Meeting.findOne({_id: req.params.id})

        //torna o horario da sala ocupado pela reuniao em um horario livre
        const sala = await MeetingRoom.findOne({_id: meeting.sala})
        sala.horariosOcupados = sala.horariosOcupados.filter(horario => horario !== meeting.horario)

        sala.horariosDisp.push(meeting.horario)

        await sala.save()
            
        await Meeting.deleteOne({_id: req.params.id})

        //se o user logado for admin, retorna todas as reunioes
        if (actualUser.funcao === "admin") {
            const meetings = await Meeting.find({})
            return res.json(meetings)
        }

        //se nao for admin, retorna apenas as reunioes do user logado
        const meetings = await Meeting.find({criadorId: actualUser._id})
        return res.json(meetings)
        
    },

    //faz o user logado participar da reuniao
    async participate(req, res) {
        const actualUser = await User.findOne({_id: req.user._id})

        const meeting = await Meeting.findOne({_id: req.body.id})

        //checa a variavel participate, se for true faz o user se tornar um participante da reuniao
        if (req.body.participate) {
            if (meeting.participantes.indexOf(actualUser.email) !== -1) {
                return res.send('Já participa da reunião')
            }

            meeting.participantes.push(actualUser.email)
            await meeting.save()
            const allMeetings = await Meeting.find({criadorId: {$ne: req.user._id}})

            return res.json(allMeetings)
        } 
           
        //se a variavel participate for false, o user deixa de ser um participante da reuniao
        meeting.participantes = meeting.participantes.filter(participante => participante !== actualUser.email)
        await meeting.save()
        const allMeetings = await Meeting.find({criadorId: {$ne: req.user._id}})

        return res.json(allMeetings)
    }
}