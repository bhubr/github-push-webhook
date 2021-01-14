const db = require('../db')

const findProjectByRepoName = async (repoName) => {
  const repos = await db.query('SELECT * FROM project WHERE name = ?', [repoName])
  return repos[0]
}

module.exports = findProjectByRepoName
