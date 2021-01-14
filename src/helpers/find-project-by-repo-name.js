const db = require('../db')

const findProjectByRepoName = async (repoName) => {
  const projects = await db.query('SELECT * FROM project WHERE name = ?', [repoName])
  console.log('found repos', projects)
  return projects[0]
}

module.exports = findProjectByRepoName
