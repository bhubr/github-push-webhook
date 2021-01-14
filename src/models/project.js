const db = require('../db')
const { v4: uuidv4 } = require('uuid')

const findAll = async () => db.query('SELECT * FROM project')

const findByRepoName = async (repoName) => {
  const projects = await db.query('SELECT * FROM project WHERE name = ?', [repoName])
  console.log('found repos', projects)
  return projects[0]
}

const create = async ({ url, name, path }) => {
  const sql = 'INSERT INTO project (uuid, name, repo, branch_regex, command, path) VALUES (?, ?, ?, ?, ?, ?)'
  const uuid = uuidv4()
  const args = [
    uuid, name, url, '.*', 'npm run build', path
  ]
  console.log(sql, args)
  return db.query(sql, args)
}

module.exports = {
  findAll,
  findByRepoName,
  create
}
