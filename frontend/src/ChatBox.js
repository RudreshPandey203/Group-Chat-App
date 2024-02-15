import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

function ChatBox({ socket, username }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState([]);
  const inputRef = useRef(null);


  const sendMessage = async () => {
    if (currentMessage && currentMessage.trim() !== "") {
      const messageData = {
        username,
        message: currentMessage.trim(),
        time: new Date(Date.now()).toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, messageData]);

      await socket.emit("chat_message", JSON.stringify(messageData));
      setCurrentMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const handleUserList = (userList) => {
      setUserList(JSON.parse(userList));
    };

    socket.on("user_list", handleUserList);

    // return () => {
    //   socket.off("user_list", handleUserList);
    // };
  }, [socket,messages]);

  useEffect(() => {
    const handleReceivedMessage = (msg) => {
      const messageData = JSON.parse(msg);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      console.log("messageData", messages);
    };

    socket.on("chat_message_recieve", handleReceivedMessage);

    return () => {
      socket.off("chat_message_recieve", handleReceivedMessage);
    };
  }, [socket]);

  return (
    <div className="chatBox flex h-[90vh]">
      <div className="w-1/5 bg-black p-3 flex flex-col">
        <h1 className="text-3xl text-white p-4 mx-auto">Users</h1>
        {userList.map((user, index) => (
          <div key={index} className="text-white">
            <p className="hover:bg-white hover:text-gray-800 rounded-md p-2 text-2xl">{user.username}</p>
          </div>
        ))}
      </div>
      <div className="w-4/5 h-[90vh]">
        <div className="head h-[5vh] bg-gray-100 p-2">
          <h1 className="text-gray-700">Live Chat</h1>
        </div>
        <div className="body h-[78vh] text-2xl flex flex-col overflow-y-auto bg-gray-300 p-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className="flex flex-col"
            >
              {message.username === "Admin" ? (
                <p className="text-gray-500 mx-auto">{message.message}</p>
              ) : (
                <>
                {message.username == username ? (
                  <div className="bg-blue-400 m-2 rounded-2xl p-3 right-0 flex-wrap w-full">
                  <h3 className="text-[2rem]">~You</h3>
                  <p className="text-[1.5rem]">{message.message}</p>
                  <p className="text-xs">{message.time}</p>
                  </div>
                ) : (
                  <div className="bg-black m-2 rounded-2xl p-3 right-0 flex-wrap w-full">
                  <h3 className="text-[2rem]">~{message.username}</h3>
                  <p className="text-[1.5rem]">{message.message}</p>
                  <p className="text-xs">{message.time}</p>
                  </div>
                )
                  
                }
                </>
              )}
            </div>
          ))}
        </div>
        <div className="footer h-[5vh]">
          <input
            ref={inputRef}
            className="p-2 w-[75vw] text-2xl rounded-l-sm h-[7.2vh]  bg-gray-100 text-black"
            name="message"
            placeholder="Type your message"
            value={currentMessage}
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="p-2 w-[5vw] absolute bottom-0 right-0 h-[7.2vh] bg-blue-700 hover:bg-blue-500 text-white rounded-r-sm"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;