const { join } = require('path')
const execAsync = require('./exec-async')
const { reposRoot } = require('../config')

const runCommand = async (command, repoName) => execAsync(command, {
  cwd: join(reposRoot, repoName)
})

module.exports = runCommand
