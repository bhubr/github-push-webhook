const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./data.db')

const query = (...args) => new Promise(
  // eslint-disable-next-line no-useless-call
  (resolve, reject) => db.all.apply(
    db, [...args, (err, status) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve(status)
    }]
  )
)

module.exports = {
  query
}
