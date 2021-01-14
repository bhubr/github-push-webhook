const fs = require('fs')
const { promisify } = require('util')

const statAsync = promisify(fs.stat)
const mkdirAsync = promisify(fs.mkdir)

const existsAsync = (file) => statAsync(file)
  .then(() => true)
  .catch(() => false)
  .then(res => console.log('file exists', file, res) || res)

module.exports = {
  existsAsync, mkdirAsync
}
