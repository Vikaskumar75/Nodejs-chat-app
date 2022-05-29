const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const http = require("http");
const path = require("path");
const { getMessage, generateLocationMessages } = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUsersInRoom,
  getUser,
} = require("./utils/users");

const app = express();

const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log("successfuly connected to socket");

  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) return callback(error);

    socket.join(user.room);
    socket.emit("message", getMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", getMessage("Admin", `${user.username} has joined 😃`));
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      if (callback) callback("The message contains profanity");
      return;
    }

    const { error, user } = getUser(socket.id);
    if (error) {
      if (callback) callback("Currently not able to send message");
      return;
    }

    io.to(user.room).emit("message", getMessage(user.username, message));
    if (callback) callback();
  });

  socket.on("locationMessage", (position, callback) => {
    const { error, user } = getUser(socket.id);
    if (error) {
      if (callback) callback("Currently not able to send message");
      return;
    }

    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessages(
        user.username,
        position.latitude,
        position.longitude
      )
    );
    if (callback) callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (!user) return;
    socket
      .to(user.room)
      .emit("message", getMessage("Admin", `${user.username} has left 🥹`));
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("app started listening on port: " + port);
});
