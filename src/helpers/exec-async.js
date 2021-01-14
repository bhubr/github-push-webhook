const { exec } = require('child_process')

const execAsync = (cmd, opts = {}) => new Promise(
  (resolve, reject) => exec(cmd, opts, (err, stdout, stderr) => {
    console.error(`[err: ${stderr}]`)
    // console.log(`[out: ${stdout}]`)
    if (err) {
      reject(stderr)
    } else {
      resolve(stdout)
    }
  })
)

module.exports = execAsync
