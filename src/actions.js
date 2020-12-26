import axios from "./axios";

export async function receiveFriendsWannabes() {
  const { data } = await axios.get("/api/friends-wannabes");
  console.log("data: ", data);
  return {
    type: "RECEIVE_FRIENDS_WANNABES",
    friendsWannabes: data
  };
}

export async function acceptFriendRequest(id) {
  await axios.post("/accept-friend-request/" + id);
  return {
    type: "ACCEPT_FRIEND_REQUEST",
    id
  };
}

export async function unfriend(id) {
  await axios.post("/end-friendship/" + id);
  return {
    type: "UNFRIEND",
    id
  };
}

export function chatMessages(msgs) {
  return {
    type: "GET_LAST_TEN_CHAT_MESSAGES",
    msgs
  };
}

export function chatMessage(data) {
  return {
    type: "INSERT_CHAT_MESSAGES",
    data
  };
}

export function onlineUsers(data) {
  return {
    type: "SHOW_ONLINE_USERS",
    data
  };
}
