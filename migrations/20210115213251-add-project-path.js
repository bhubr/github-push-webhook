'use strict'
const db = require('../src/db')

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
  return db.query('ALTER TABLE project ADD COLUMN path VARCHAR(255)')
}

exports.down = function (db) {
  return db.run('LTER TABLE project DROP COLUMN name')
}

exports._meta = {
  version: 1
}
