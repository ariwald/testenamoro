import React, { useEffect, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";

export function Chat() {
  const chatMessages = useSelector(state => state && state.msgs);
  const onlineUsers = useSelector(state => state && state.online);
  console.log("onlineUser : ", onlineUsers);

  const elemRef = useRef();

  useEffect(() => {
    console.log("chat mounted");
    console.log("elemRef: ", elemRef);
    let { clientHeight, scrollTop, scrollHeight } = elemRef.current;
    elemRef.current.scrollTop = scrollHeight - clientHeight;
  }, [chatMessages, onlineUsers]);

  const KeyCheck = e => {
    if (e.key === "Enter") {
      e.preventDefault(); //stops the moving to a new line
      console.log("what the user is typing: ", e.target.value);
      console.log("which key user pressed...", e.keyCode);
      socket.emit("chatMessage", e.target.value);
      e.target.value = "";
    }
  };
  //
  return (
    <div>
      <div className="chat">
        <p id="titleFindPeople">Chat</p>{" "}
        <div className="chatContainer" ref={elemRef}>
          {chatMessages &&
            chatMessages.map(msg => (
              <div className="message" key={msg.id}>
                <img id="chatPic" src={msg.url} alt={msg.first} />
                <div className="fontSize">
                  <p>
                    {msg.first} {msg.last}:
                  </p>
                  <p> {msg.message}</p>
                </div>
              </div>
            ))}{" "}
        </div>
        <textarea
          rows="3"
          className="chatTextArea"
          onKeyDown={KeyCheck}
          placeholder="Escreva sua mensagem aqui. Sem malcriação :-)"
        ></textarea>
      </div>
      <div id="online-users">
        <h2>Usuários online</h2>
        {onlineUsers &&
          onlineUsers.map(user => (
            <div key={user.id}>
              {user.url && <img id="chatPic" src={user.url} alt={user.last} />}
              {!user.url && (
                <img id="chatPic" src="/default.png" alt={user.last} />
              )}
              <p>
                {user.first} {user.last}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
