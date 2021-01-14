// const { join } = require('path')
// const { reposRoot } = require('../config')
const execAsync = require('./exec-async')
// const { existsAsync, mkdirAsync } = require('./fs-async')

const gitClone = async (url, parentDir) => execAsync(`git clone ${url}`, { cwd: parentDir })

const gitBranch = async (repoPath) => {
  const out = await execAsync('git branch', {
    cwd: repoPath
  })
  const current = out.split('\n').find(l => /^\*.*/.test(l))
  console.log(out, current)
  return current.substr(2)
}

const gitPull = async (repoPath) => execAsync('git pull', { cwd: repoPath })

const gitCheckout = async (repoPath, branchName) => execAsync(`git checkout ${branchName}`, {
  cwd: repoPath
})

module.exports = {
  gitClone, gitBranch, gitPull, gitCheckout
}
