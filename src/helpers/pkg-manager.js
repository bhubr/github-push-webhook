const { join } = require('path')
const { each } = require('bluebird')
const runCommand = require('./run-command')
const { existsAsync } = require('./fs-async')
const { reposRoot } = require('../config')

const lockFiles = {
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
  pnpm: 'pnpm-lock.yaml'
}

const getPkgManager = async (repoName) => {
  const managers = Object.keys(lockFiles)
  const manager = await each(managers, async key => {
    console.log('check', key)
    const lockFile = lockFiles[key]
    const fullPath = join(reposRoot, repoName, lockFile)
    const exists = await existsAsync(fullPath)
    if (exists) {
      const error = new Error('found')
      error.manager = key
      throw error
    }
  }).catch(err => {
    if (!err.manager) throw err
    return err.manager
  })
  console.log('found', manager)
  return manager
}

const pkgInstall = async (pkgManager, repoName, onStdout, onStderr) => runCommand(`${pkgManager} install`, repoName, onStdout, onStderr)

module.exports = {
  getPkgManager,
  pkgInstall
}
