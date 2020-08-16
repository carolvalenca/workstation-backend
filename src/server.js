const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routes = require('./routes')
const cors = require('cors')

const app = express()

dotenv.config()

mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true }
)

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(3030)