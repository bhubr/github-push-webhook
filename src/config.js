const { resolve } = require('path')

module.exports = {
  port: process.env.PORT || 8000,
  reposRoot: process.env.REPOS_ROOT || resolve(__dirname, '..', 'repos'),
  publicDir: resolve(__dirname, '..', 'public')
}
