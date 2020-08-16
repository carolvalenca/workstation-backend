const MeetingRoom = require('../models/MeetingRoom')
const Meeting = require('../models/Meeting')
const User = require('../models/User')

//controller responsavel por administrar as oprecoes relacionadas as salas de reuniao
module.exports = {
    //lista todas as salas de reuniao 
    async index(req, res) {
        const rooms = await MeetingRoom.find({})
        return res.send(rooms)
    },

    //lista apenas a sala de reuniao requisitada
    async indexOne(req, res) {
        const room = await MeetingRoom.find({_id: req.params.id})
        return res.json(room)
    },

    //cria uma nova sala de reuniao
    async create(req, res) {
        //apenas adms
        const _id = req.user._id
        const atualUser = await User.findOne({_id: _id})

        if (atualUser.funcao !== "admin") return res.send("Acesso negado: usuário não é administrador.")

        //seta um array de horarios disponiveis para a sala 
        const horariosDisp = ['seg8h', 'seg9h', 'seg10h', 'seg11h', 'seg12h',
                            'ter8h', 'ter9h', 'ter10h', 'ter11h', 'ter12h',
                            'qua8h', 'qua9h', 'qua10h', 'qua11h', 'qua12h',
                            'qui8h', 'qui9h', 'qui10h', 'qui11h', 'qui12h',
                            'sex8h', 'sex9h', 'sex10h', 'sex11h', 'sex12h'
                            ]

        const horariosOcupados = []

        const room = new MeetingRoom({
            nome: req.body.nome,
            desc: req.body.desc,
            horariosDisp,
            horariosOcupados
        })

        try {
            const savedRoom = await room.save()
            return res.json(savedRoom)
        } catch(err) {
            return res.status(400).send(err)
        }
    },

    //edita a sala de reuniao requisitada
    async edit(req, res) {
        //apenas adms
        const _id = req.user._id
        const atualUser = await User.findOne({_id: _id})

        if (atualUser.funcao !== "admin") return res.send("Acesso negado: usuário não é administrador.")

        const room = await MeetingRoom.findOne({_id: req.body.id})

        if (req.body.nome) {
            room.nome = req.body.nome
        }

        if (req.body.desc) {
            room.desc = req.body.desc
        }

        const savedRoom = await room.save()
        return res.json(savedRoom)
    },

    //deleta uma sala de reuniao
    async delete(req, res) {
        //apenas adms
        const _id = req.user._id
        const atualUser = await User.findOne({_id: _id})

        if (atualUser.funcao !== "admin") return res.send("Acesso negado: usuário não é administrador.")

        await MeetingRoom.deleteOne({_id: req.params.id})
        //deleta todas as reunioes associadas a tal sala
        await Meeting.deleteMany({sala: req.params.id})

        const allRooms = await MeetingRoom.find({})

        return res.json(allRooms)
    }
}