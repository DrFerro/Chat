const app = require('./app');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio.listen(server);
require('./sockets')(io);

async function main() {
  server.listen(app.get('port'));
  console.log(`server on port ${app.get('port')}`);
}

main();