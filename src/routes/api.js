const express = require('express')
const webhook = require('./webhook')
const projects = require('./projects')

const router = express.Router()
router.use('/webhook', webhook)
router.use('/projects', projects)

module.exports = router
