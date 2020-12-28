//map (good for changing item(s) in an array)
//concat (combine two or more arrays into one array)
//spread operator (copy arrays and objects and add properties to those copies)
//object.assign - make copies of objects - dont use it, prefer '...' instead

export default function reducer(state = {}, action) {
  if (action.type == "RECEIVE_FRIENDS_WANNABES") {
    state = {
      ...state,
      friendsWannabes: action.friendsWannabes.data
    };
  }
  if (action.type == "ACCEPT_FRIEND_REQUEST") {
    state = {
      ...state,
      friendsWannabes: state.friendsWannabes.data.map(friend => {
        if (friend.id == action.id) {
          return {
            ...friend,
            accepted: true
          };
        }
        return friend;
      })
    };
  }
  if (action.type === "UNFRIEND") {
    state = {
      ...state,
      friendsWannabes: state.friendsWannabes.data.filter(
        friend => friend.id != action.id
      )
    };
  }
  if (action.type === "GET_LAST_TEN_CHAT_MESSAGES") {
    state = {
      ...state,
      msgs: action.msgs
    };
  }
  if (action.type === "INSERT_CHAT_MESSAGES") {
    state = {
      ...state,
      msgs: state.msgs.concat(action.data)
    };
  }
  if (action.type === "SHOW_ONLINE_USERS") {
    state = {
      ...state,
      online: action.data
    };
  }
  return state;
}
