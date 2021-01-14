const express = require('express')
const Project = require('../models/project')
const { gitBranch, gitPull, gitCheckout } = require('../helpers/git')
const { getPkgManager, pkgInstall } = require('../helpers/pkg-manager')
const runCommand = require('../helpers/run-command')
const emitter = require('../event-emitter')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    // GitHub payload
    const { ref, before, after, repository } = req.body
    console.log(req.body)
    if (!ref || !repository) {
      console.log('#0 not a push payload', req.body)
      return res.sendStatus(422)
    }
    const { full_name: fullName } = repository
    console.log('#1 recv', ref, before, after, fullName)
    // trouver projet à partir du repo name
    const project = await Project.findByRepoName(fullName)
    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }

    const [, pushedBranch] = ref.match(/refs\/heads\/(.*)/)
    console.log('#2 pushed branch', pushedBranch)
    const branchRe = new RegExp(project.branch_regex)
    if (!branchRe.test(pushedBranch)) {
      console.log('pushed branch not matching', project.branch_regex)
      return res.sendStatus(204)
    }

    // pull
    console.log('#3 pull')
    const pullOut = await gitPull(fullName)
    console.log(pullOut)

    // vérifie la branche courante
    const localBranch = await gitBranch(fullName)
    console.log('#4 local branch', localBranch)

    // checkout la bonne branche
    if (localBranch !== pushedBranch) {
      console.log('#5 checkout & re-pull', pushedBranch)
      await gitCheckout(fullName, pushedBranch)
      const pullAgain = await gitPull(fullName)
      console.log(pullAgain)
    }
    // return res.sendStatus(204)
    // const {  }
    // vérifie yarn.lock/package-lock.json/pnpm-lock.yaml
    const pkgManager = await getPkgManager(fullName)
    console.log('#6', pkgManager)

    emitter.emit('push', JSON.stringify({ name: project.name, pushedBranch, localBranch, pkgManager }))
    res.json({ project, pushedBranch, localBranch, pkgManager })

    // installe les deps avec le bon tool
    const onInstallData = (data) => emitter.emit('install', JSON.stringify({ name: project.name, stdout: data }))
    const installOut = await pkgInstall(pkgManager, fullName, onInstallData, onInstallData)

    console.log('#7', installOut)
    // run build
    const onBuildData = (data) => emitter.emit('build', JSON.stringify({ name: project.name, stdout: data }))
    const runOut = await runCommand(project.command, fullName, onBuildData, onBuildData)
    console.log('#8', runOut)

    console.log('#9 done ', project, localBranch)
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: err.message
    })
  }
})

module.exports = router
