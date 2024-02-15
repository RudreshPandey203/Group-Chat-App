const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');

const { Server } = require('socket.io');
const server = http.createServer(app);

const users = [];

const io = new Server(server, {
    cors: {
        origin: "https://group-chat-app-ruddy.vercel.app/",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected - server side', socket.id);
    const handleDisconnect = () => {
        const disconnectedUser = users.find(user => user.id === socket.id);
        if (disconnectedUser) {
            const { username } = disconnectedUser;
            console.log(`User ${username} left the chat`);
            users.splice(users.findIndex(user => user.id === socket.id), 1);
            socket.broadcast.emit('user_list', JSON.stringify(users));
            socket.broadcast.emit('chat_message_recieve', JSON.stringify({ username: 'Admin', message: `User ${username} left the chat`, time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds() }));
        }
    };
    socket.on('disconnect', () => {
        console.log('user disconnected - ', socket.id);
        handleDisconnect();
    });

    socket.on('join_chat', (username) => {
        console.log(`User ${username} joined the chat`);
        users.push({ id: socket.id, username });
        socket.emit('user_list', JSON.stringify(users));
        socket.emit('chat_message_recieve', JSON.stringify({ username: 'Admin', message: `User ${username} joined the chat`, time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds() }));
        socket.broadcast.emit('user_list', JSON.stringify(users));
        socket.broadcast.emit('chat_message_recieve', JSON.stringify({ username: 'Admin', message: `User ${username} joined the chat`, time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds() }));

    });

    

    socket.on('leave_chat', (username) => {
        console.log(`User ${username} left the chat`);
        users.splice(users.findIndex(user => user.id === socket.id), 1);
        socket.broadcast.emit('user_list', JSON.stringify(users));
        socket.broadcast.emit('chat_message_recieve', JSON.stringify({ username: 'Admin', message: `User ${username} left the chat`, time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds() }));
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
