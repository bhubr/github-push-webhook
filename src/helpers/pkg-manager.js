const { join } = require('path')
const { each } = require('bluebird')
const runCommand = require('./run-command')
const { existsAsync } = require('./fs-async')

const lockFiles = {
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
  pnpm: 'pnpm-lock.yaml'
}

const getPkgManager = async (repoPath) => {
  const managers = Object.keys(lockFiles)
  let manager
  await each(managers, async key => {
    const lockFile = lockFiles[key]
    const fullPath = join(repoPath, lockFile)
    const exists = await existsAsync(fullPath)
    if (exists) {
      manager = key
      throw new Error('found')
    }
  }).catch(err => {
    if (err.message !== 'found') throw err
  })
  return manager || 'npm'
}

const pkgInstall = async (pkgManager, repoPath, onStdout, onStderr) => runCommand(`${pkgManager} install`, repoPath, onStdout, onStderr)

module.exports = {
  getPkgManager,
  pkgInstall
}
