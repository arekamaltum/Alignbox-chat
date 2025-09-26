const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
app.use(express.static(path.join(__dirname,'public')));
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


app.use(express.static(path.join(__dirname, 'public')));

let userMap={};

io.on("connection", (socket) => {
    socket.on('newuseradded', ({ username, socketId }) => {
      userMap[socketId] = username;
      console.log(username);
      io.emit('activeusers', {
        activeUsers: io.engine.clientsCount
      });
    });
  
    // Handle normal + incognito messages
    socket.on('newmessage', ({ message, socketId, username, incognito, attachment }) => {
      io.emit('messagereceived', {
        message,
        username,
        socketId,
        incognito,
        attachment
      });
    });
  });
  

httpServer.listen(3000);