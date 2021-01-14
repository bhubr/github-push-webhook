const fs = require('fs')
const { join } = require('path')
const { promisify, each } = require('bluebird')
const execAsync = require('./exec-async')
const { reposRoot } = require('../config')

const statAsync = promisify(fs.stat)
const existsAsync = (file) => statAsync(file)
  .then(() => true)
  .catch(() => false)
  .then(res => console.log('file exists', file, res) || res)

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

const pkgInstall = async (pkgManager, repoName) => execAsync(`${pkgManager} install`, {
  cwd: join(reposRoot, repoName)
})

module.exports = {
  getPkgManager,
  pkgInstall
}
