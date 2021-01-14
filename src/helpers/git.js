const { join } = require('path')
const { reposRoot } = require('../config')
const execAsync = require('./exec-async')

const gitBranch = async (repoName) => {
  const out = await execAsync('git branch', {
    cwd: join(reposRoot, repoName)
  })
  const current = out.split('\n').find(l => /^\*.*/.test(l))
  console.log(out, current)
  return current.substr(2)
}

const gitPull = async (repoName) => execAsync('git pull', {
  cwd: join(reposRoot, repoName)
})

const gitCheckout = async (repoName, branchName) => execAsync(`git checkout ${branchName}`, {
  cwd: join(reposRoot, repoName)
})

module.exports = {
  gitBranch, gitPull, gitCheckout
}
