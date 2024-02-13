import React, { useEffect } from "react";
import { useState } from "react";

function ChatBox({ socket, username }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = async() => {
        if (currentMessage && currentMessage !== "") {
            const messageData = {
                username,
                message: currentMessage,
                time : new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds()
            };
            console.log(messageData);
            // socket.emit("chat_message", JSON.stringify(messageData));
            setCurrentMessage("");
            setMessages((messages) => [...messages, messageData]);

            await socket.emit("chat_message", JSON.stringify(messageData));
        }
    }

    useEffect(() => {
        socket.on("chat_message_recieve", (msg) => {
            const messageData = JSON.parse(msg);
            setMessages((messages) => [...messages, messageData]);
        });
    }, [socket]);

  return (
    <div className="chatBox">
      <div className="head">
        <h1>Live Chat</h1>
      </div>
      <div className="body">
        {messages.map((message, index) => {
            return (
                <div key={index} className="message">
                <h3>{message.username}</h3>
                <p>{message.message}</p>
                <p>{message.time}</p>
                </div>
            );
        }
        )}
      </div>
      <div className="footer">
        <input name="message" placeholder="Type your message" onChange={(event)=>{
            setCurrentMessage(event.target.value);
        }} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
