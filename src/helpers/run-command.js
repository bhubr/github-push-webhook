const { join } = require('path')
const { spawn } = require('child_process')
const { reposRoot } = require('../config')

const runCommand = async (command, repoName, onStdout, onStderr) => new Promise(
  (resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    const opts = { cwd: join(reposRoot, repoName), shell: true }
    const child = spawn(cmd, args, opts)

    child.stdout.on('data', data => onStdout(data.toString()))
    child.stderr.on('data', data => onStderr(data.toString()))

    child.on('close', (code) => {
      if (!code) return resolve()
      const error = new Error(`Command \`${command}\` exited with code ${code}`)
      return reject(error)
    })
  }
)

module.exports = runCommand
