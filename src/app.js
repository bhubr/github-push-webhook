const express = require('express')
const api = require('./routes')
const db = require('./db')

// const { v4: uuidv4 } = require('uuid')
// db.query('INSERT INTO project (uuid, name, repo) VALUES (?, ?, ?)', [
//   uuidv4(), 'test1', 'https://github.com/user/test1'
// ])

const app = express()

app.use(express.json())
app.use('/api', api)

module.exports = app