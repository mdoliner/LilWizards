(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.EstablishConnection = function () {
    if (LW.Socket) {
      LW.Socket.emit('getRooms');
    } else {
      LW.Socket = io();
    }

    var socket = LW.Socket;

    socket.on('test', function (data) {
      alert(data.message);
    });

    socket.on('getRooms', function (data) {
      makeRoom(data.rooms);
    });

    socket.on('enterRoom', function (data) {
      alert(data.room);
    });

    //ping(socket)
  };

  function makeRoom(rooms) {
    var lobbies = new LW.MainMenu({
      title: "Online Game",
      tooltip: "Hey, these are games peoples are playingas.",
      commands: rooms.concat(["host", "Back"]),
      events: {
        "host": function () {
          var roomName = prompt("Please enter the name of the room", "");
          if (roomName !== "") {
            LW.Socket.emit("makeRoom", { room: roomName });
          }
        },
        "Back": function () {
          LW.GlobalSL.playSE('menu-cancel.ogg', 100)

          LW.Menus.TopMenu.swapTo();
        }
      },
      commandTooltips: {
      },
      selector: '.main-menu-items'
    })
    for (var i = 0; i < rooms.length; i++) {
      var room = rooms[i];
      if (room === "host" || room === "Back") { continue }
      lobbies.events[room] = Util.args(function (selectedRoom) {
        LW.Socket.emit("joinRoom", {room: selectedRoom})
      }, room);
    }
    lobbies.swapTo();
  };

  LW.PingSocket = function ping(socket) {
    var pings = {}
    setInterval(function () {
      id = Math.random() * 10000000000;
      pings[id] = Date.now();
      socket.emit('ping', {id: id});
    }, 1000/60);

    socket.on('ping', function (data) {
      console.log("Ping: " + (Date.now() - pings[data.id]));
      delete pings[data.id];
    });
  };

})();
