const { v4: uuidv4 } = require('uuid')

const db = require('../src/db')
const { gitClone } = require('../src/helpers/git')
// 1f663a26-b114-45ab-b443-821011a12538|bhubr/webhook-test|https://github.com/bhubr/webhook-test|abc|dev|npm run build

const createProject = async (url) => {
  const [username, repo] = await gitClone(url)
  const fullname = `${username}/${repo}`
  const uuid = uuidv4()
  const sql = 'INSERT INTO project (uuid, name, repo, branch_regex, command) VALUES (?, ?, ?, ?, ?)'
  const args = [
    uuid, fullname, url, '.*', 'npm run build'
  ]
  console.log(sql, args)
  await db.query(sql, args)
  console.log('done')
}
createProject(process.argv[2])
  .then(() => process.exit())
  .catch((err) => console.error(err) || process.exit(1))
