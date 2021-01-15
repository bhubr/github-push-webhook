const { join } = require('path')
const { reposRoot } = require('../config')
const execAsync = require('./exec-async')
const { existsAsync, mkdirAsync } = require('./fs-async')

const gitClone = async (url) => {
  const urlRe = /https:\/\/github\.com\/(.*)\/(.*)/
  const matches = url.match(urlRe)
  if (!matches) throw new Error(`Not a repo: ${url}`)
  const [, username, repo] = matches
  const userRoot = join(reposRoot, username)
  if (!await existsAsync(userRoot)) {
    await mkdirAsync(userRoot)
  }
  const outcome = await execAsync(`git clone ${url}`, { cwd: userRoot })
  console.log('git clone outcome', outcome, username, repo)
  return [username, repo]
}

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
  gitClone, gitBranch, gitPull, gitCheckout
}
