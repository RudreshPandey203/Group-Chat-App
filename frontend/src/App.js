import React from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  return (
    <div className="App">
      <h1>Welcome to Chat</h1>
      <div>
        <input name='username' placeholder='John' required/>
        <div>
          <button>Join Chat</button>
        </div>
      </div>
    </div>
  );
}

export default App;
