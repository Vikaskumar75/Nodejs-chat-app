require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const http = require("http");
const path = require("path");
const app = express();

const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log("successfuly connected to socket");

  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      if (callback) callback("The message contains profanity");
      return;
    }
    io.emit("message", message);
    if (callback) callback();
  });

  socket.on("locationMessage", (position, callback) => {
    io.emit(
      "locationMessage",
      `https://google.com/maps?q=${position.latitude},${position.longitude}`
    );
    if (callback) callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "User has been disconnected");
  });
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log("app started listening on port: " + port);
});
