const { resolve } = require('path')
const Project = require('../src/models/project')
const { gitClone } = require('../src/helpers/git')
const getRepoInfo = require('../src/helpers/get-repo-info')

// 1f663a26-b114-45ab-b443-821011a12538|bhubr/webhook-test|https://github.com/bhubr/webhook-test|abc|dev|npm run build|path

const createProject = async (url, parentDir, force = 0) => {
  const [owner, repo] = getRepoInfo(url)
  try {
    await gitClone(url, parentDir)
  } catch (err) {
    console.log('Cloning failed! If it already exists, pass true as 3rd arg to force project creation.')
    if (!force) throw err
  }
  const name = `${owner}/${repo}`
  const path = resolve(parentDir, repo)
  await Project.create({ url, name, path })
  console.log('done')
}

if (process.argv.length < 4) {
  console.error(`
Usage:
  node tools/create-project <repo url> <local path>
  `)
}

const [,, url, localPath, force] = process.argv

createProject(url, localPath, force === 'true')
  .then(() => process.exit())
  .catch((err) => console.error(err) || process.exit(1))
