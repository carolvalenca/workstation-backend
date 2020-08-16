const express = require('express')
const routes = express.Router()

const User = require('./models/User')

const RegisterLoginController = require('./controllers/RegisterLoginController')
const UserController = require('./controllers/UserController')
const MeetingController = require('./controllers/MeetingController')
const MeetingRoomController = require('./controllers/MeetingRoomController')

const verifyToken = require('./services/verifyToken')

routes.post('/login', RegisterLoginController.login)
routes.post('/register', RegisterLoginController.register)
routes.post('/resendEmail', RegisterLoginController.resendEmail)
routes.put('/verify', RegisterLoginController.verifyEmail)

routes.put('/editUser', verifyToken, UserController.edit)
routes.get('/indexUsers', verifyToken, UserController.index)
routes.put('/promoteUser', verifyToken, UserController.promoteUser)

routes.get('/indexAllMeetings', verifyToken, MeetingController.index)
routes.get('/indexUserMeetings', verifyToken, MeetingController.indexUserMeetings)
routes.get('/indexOtherMeetings', verifyToken, MeetingController.indexOtherMeetings)
routes.post('/createMeeting', verifyToken, MeetingController.create)
routes.delete('/deleteMeeting/:id', verifyToken, MeetingController.delete)
routes.put('/participate', verifyToken, MeetingController.participate)

routes.get('/indexRooms', verifyToken, MeetingRoomController.index)
routes.get('/indexOneRoom/:id', verifyToken, MeetingRoomController.indexOne)
routes.post('/createRoom', verifyToken, MeetingRoomController.create)
routes.put('/editRoom', verifyToken, MeetingRoomController.edit)
routes.delete('/deleteRoom/:id', verifyToken, MeetingRoomController.delete)


module.exports = routes
