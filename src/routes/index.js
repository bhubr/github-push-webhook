const express = require('express')
const findProjectByRepoName = require('../helpers/find-project-by-repo-name')
const { gitBranch, gitPull, gitCheckout } = require('../helpers/git')
const { getPkgManager, pkgInstall } = require('../helpers/pkg-manager')
const runCommand = require('../helpers/run-command')

const router = express.Router()

router.post('/webhook', async (req, res) => {
  try {
    // GitHub payload
    const { ref, before, after, repository } = req.body
    if (!ref || !repository) {
      console.log('#0 not a push payload', req.body)
      return res.sendStatus(422)
    }
    const { full_name: fullName } = repository
    console.log('#1 recv', ref, before, after, fullName)
    // trouver projet à partir du repo name
    const project = await findProjectByRepoName(fullName)
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
      console.log('#5 checkout', pushedBranch)
      await gitCheckout(fullName, pushedBranch)
    }
    // return res.sendStatus(204)
    // const {  }
    // vérifie yarn.lock/package-lock.json/pnpm-lock.yaml
    const pkgManager = await getPkgManager(fullName)
    console.log('#6', pkgManager)
    // installe les deps avec le bon tool
    const installOut = await pkgInstall(pkgManager, fullName)
    console.log('#7', installOut)
    // run build
    const runOut = await runCommand(project.command, fullName)
    console.log('#8', runOut)

    console.log('#12 done ', project, localBranch)
    res.json({ project, branch: localBranch })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: err.message
    })
  }
})

module.exports = router
