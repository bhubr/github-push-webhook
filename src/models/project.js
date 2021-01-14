const db = require('../db')

const findAll = async () => db.query('SELECT * FROM project')

const findByRepoName = async (repoName) => {
  const projects = await db.query('SELECT * FROM project WHERE name = ?', [repoName])
  console.log('found repos', projects)
  return projects[0]
}

module.exports = {
  findAll,
  findByRepoName
}
