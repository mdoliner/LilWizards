var lobbies = {}, lobbyNumber = 0, io;

var createServer = function (server) {
  io = require('socket.io')(server);
  io.on('connection', function (socket) {
    initialize(socket);

    socket.on('ping', function (data) {
      socket.emit('ping', data);
    });

    socket.on('getRooms', function () {
      socket.emit('getRooms', { rooms: Object.keys(lobbies) })
    });

    socket.on('makeRoom', function (data) {
      if (lobbies[data.room]) { return }
      lobbies[data.room] = [];
      enterRoom(data.room, socket);
    });

    socket.on('joinRoom', function (data) {
      enterRoom(data.room, socket);
    });
  });
};

function initialize(socket) {
  // socket.emit('test', { message: "connected" });
  socket.emit('getRooms', { rooms: Object.keys(lobbies) })
};

function enterRoom(room, socket) {
  socket.join(room);
  io.to(room).emit('enterRoom', { room: room, socket: socket.id });
  lobbies[room].push(socket);
};

module.exports = createServer;
