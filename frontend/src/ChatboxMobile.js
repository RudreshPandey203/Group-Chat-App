import React, { useEffect, useState, useRef } from "react";

function ChatBox({ socket, username }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
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
    <div className="chatBox h-[90vh] flex overflow-y-auto">
      <div className="w-full ">
        <div className="head sticky z-1 h-[5vh] bg-gray-100 p-2">
          <h1 className="text-gray-700 float">Live Chat</h1>
        </div>
        <div className="body text-xl flex flex-col h-[80vh] overflow-y-auto bg-gray-300 p-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className="flex flex-col mr-3"
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
        <div className="flex items-center justify-between">
          <input
            ref={inputRef}
            className="p-2 w-full rounded-l-sm h-[5vh] bg-gray-100 text-black absolute bottom-0"
            name="message"
            placeholder="Type your message"
            value={currentMessage}
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="p-2 w-[25%] h-[5vh] bg-blue-700 hover:bg-blue-500 text-white rounded-r-sm absolute bottom-0 right-0"
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
