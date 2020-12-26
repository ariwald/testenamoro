import { chatMessages, chatMessage, onlineUsers } from "./actions";
import * as io from "socket.io-client";

export let socket;

export const init = store => {
  if (!socket) {
    socket = io.connect();
    //listenig to web messages

    socket.on("chatMessages", msgs => {
      console.log("messsages: ", msgs);
      store.dispatch(chatMessages(msgs));
    });

    socket.on("chatMessage", msg => store.dispatch(chatMessage(msg)));
  }
  socket.on("onlineUsers", data => {
    store.dispatch(onlineUsers(data));
  });
};
