const express = require('express')
const Project = require('../models/project')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll()
    return res.json(projects)
  } catch (err) {
    return res.status(500).json({
      error: err.message
    })
  }
})

module.exports = router
