import React from 'react';
import io from 'socket.io-client';
import { useState } from 'react';
import ChatBox from './ChatBox';

const socket = io('http://localhost:4000');

function App() {

  const [username, setUsername] = useState('');

  const joinChat = () => {
    if(username){
      socket.emit('join_chat', username);
      console.log(`User ${username} joined the chat`);
    }
  }

  return (
    <div className="App">
      <h1>Welcome to Chat</h1>
      <div>
        <input name='username' placeholder='John' onChange={(event) =>{
          setUsername(event.target.value);
        }} required/>
        <div>
          <button onClick={joinChat}>Join Chat</button>
        </div>
        <ChatBox socket={socket} username={username}/>
      </div>
    </div>
  );
}

export default App;
