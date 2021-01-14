const app = require('./app')
const { port } = require('./config')

app.listen(port, err => {
  if (err) throw err
  console.log(`Express server listening on ${port}`)
})
