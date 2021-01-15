'use strict'
const fs = require('fs')
const db = require('../src/db')

const sqlCreateTable = fs.readFileSync('./sql/schema.sql', 'utf-8')

let dbm
let type
let seed

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function () {
  return db.query(sqlCreateTable)
}

exports.down = function (db) {
  return db.run('DROP TABLE project')
}

exports._meta = {
  version: 1
}
