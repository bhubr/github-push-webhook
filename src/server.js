const app = require('./app')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const { port } = require('./config')
const emitter = require('./event-emitter')

io.on('connection', (socket) => {
  console.log('a user connected')
  const pushListener = (data) => console.log('recv push') || socket.emit('push', data)
  const installListener = (data) => console.log('recv build') || socket.emit('install', data)
  const buildListener = (data) => console.log('recv install') || socket.emit('build', data)
  emitter.on('push', pushListener)
  emitter.on('install', installListener)
  emitter.on('build', buildListener)
  socket.on('disconnect', () => {
    console.log('user disconnected')
    emitter.off('push', pushListener)
    emitter.off('install', installListener)
    emitter.off('build', buildListener)
  })
})

http.listen(port, err => {
  if (err) throw err
  console.log(`Express server listening on ${port}`)
})
