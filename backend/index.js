const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');

const { Server } = require('socket.io');
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected - server side', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected - ', socket.id);
    });

    socket.on('join_chat', (username) => {
        console.log(`User ${username} joined the chat`);
    });

    socket.on('chat_message', (msg) => {
        const messageData = JSON.parse(msg);
        console.log('message: ' + messageData.message);
        socket.broadcast.emit('chat_message_recieve', JSON.stringify(messageData));
    });
});


app.use(cors());    


server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
