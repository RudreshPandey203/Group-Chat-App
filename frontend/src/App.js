import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ChatBox from "./ChatBox";

const socket = io("http://localhost:4000");

function App() {
  const [username, setUsername] = useState("");
  const [chat, setChat] = useState(false);
  const [userError, setUserError] = useState(false);

  const joinChat = () => {
    if (username.trim() !== "") {
      socket.emit("join_chat", username);
      console.log(`User ${username} joined the chat`);
      setChat(true);
    } else {
      setUserError(true);
      setTimeout(() => {
        setUserError(false);
      }, 3000);
    }
  };

  useEffect(() => {

  const handleUserLeave = () => {
    socket.emit("leave_chat", username);

    handleUserLeave();
  }},[chat])

  return (
    <div className="bg-black h-[100vh] text-white ">
      <div className="flex justify-between p-3">
        <h1 className="p-2 text-4xl">Chat App</h1>
        {chat && <button className="m-3 bg-red-600 p-2 rounded-md" onClick={()=>{  setChat(false)}}>Leave Chat</button>
}
      </div>
      {!chat && <div className="h-[80vh] text-center flex flex-col justify-center items-center">
        <h1 className="p-5 text-5xl">Enter your Username</h1>

        <div>
          <input className="rounded-md p-2 m-3 w-[20vw] h-16 text-gray-700 text-3xl font-semibold" type="text"
            name="username"
            placeholder="John"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            required
          />
          {userError && (
            <p className="text-red-500 p-1 float">Please enter a valid username</p>
          )}
          <div>
            <button className="rounded-md bg-blue-700 px-6 py-4 m-3 text-2xl hover:bg-blue-500 font-semibold" onClick={joinChat}>Join Chat</button>
          </div>
        </div>
      </div>}
      {chat && <div>
        <ChatBox socket={socket} username={username} />
      </div>}
    </div>
  );
}

export default App;

// import React, { useState } from "react";
// import io from "socket.io-client";
// import ChatBox from "./ChatBox";

// const socket = io("http://localhost:4000");

// function App() {
//   const [username, setUsername] = useState("");
//   const [chat, setChat] = useState(false);
//   const [userError, setUserError] = useState(false);

//   const joinChat = () => {
//     if (username.trim() !== "") {
//       socket.emit("join_chat", username);
//       console.log(`User ${username} joined the chat`);
//       setChat(true);
//     } else {
//       setUserError(true);
//       setTimeout(() => {
//         setUserError(false);
//       }, 3000);
//     }
//   };

//   return (
//     <div className="bg-black h-[100vh] text-white ">
//       <div className="flex justify-between p-3">
//         <h1 className="p-2 text-4xl">Chat App</h1>
//         {chat && <button className="m-3 bg-red-600 p-2 rounded-md" onClick={() => { setChat(false); }}>Leave Chat</button>
// }
//       </div>
//       {!chat && <div className="h-[80vh] text-center flex flex-col justify-center items-center">
//         <h1 className="p-5 text-5xl">Enter your Username</h1>

//         <div>
//           <input className="rounded-md p-2 m-3 w-[20vw] h-16 text-gray-700 text-3xl font-semibold" type="text"
//             name="username"
//             placeholder="John"
//             onChange={(event) => {
//               setUsername(event.target.value);
//             }}
//             required
//           />
//           {userError && (
//             <p className="text-red-500 p-1 float">Please enter a valid username</p>
//           )}
//           <div>
//             <button className="rounded-md bg-blue-700 px-6 py-4 m-3 text-2xl hover:bg-blue-500 font-semibold" onClick={joinChat}>Join Chat</button>
//           </div>
//         </div>
//       </div>}
//       {chat && <div>
//         <ChatBox socket={socket} username={username} />
//       </div>}
//     </div>
//   );
// }

// export default App;
