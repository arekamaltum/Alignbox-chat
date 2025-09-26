const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
    cors: {
        origin: "https://alignbox-chat-6d59.vercel.app", // 
        methods: ["GET", "POST"]
    }
});

let userMap = {};

io.on("connection", (socket) => {

    socket.on('newuseradded', ({ username, socketId }) => {
        userMap[socketId] = username;
        console.log(username);
        io.emit('activeusers', {
            activeUsers: io.engine.clientsCount
        });
    });

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

// Use dynamic port for Render / fallback to 3000 locally
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
