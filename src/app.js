const express = require('express')
const api = require('./routes/api')
const { publicDir } = require('./config')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(publicDir))
app.use('/api', api)

module.exports = app
