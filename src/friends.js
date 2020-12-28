import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  receiveFriendsWannabes,
  acceptFriendRequest,
  unfriend
} from "./actions";

export default function Friends() {
  const dispatch = useDispatch();
  const friends = useSelector(
    state =>
      state.friendsWannabes &&
      state.friendsWannabes.filter(friendWannabe => friendWannabe.accepted)
  );
  const invitations = useSelector(
    state =>
      state.friendsWannabes &&
      state.friendsWannabes.filter(friendWannabe => !friendWannabe.accepted)
  );

  useEffect(() => {
    dispatch(receiveFriendsWannabes());
  }, []);

  if (!friends && !invitations) {
    return null;
  }

  return (
    <div>
      <p id="titleFindPeople">Rolou sintonia</p>
      <div className="friendsContainer">
        {friends &&
          friends.map(friendWannabe => (
            <div id="bottomFindPeople" key={friendWannabe.id}>
              <p>{friendWannabe.first} </p>
              <p>{friendWannabe.last}</p>
              <Link to={"/user/" + friendWannabe.id}>
                <img
                  id="findPeoplePic"
                  src={friendWannabe.url}
                  alt={friendWannabe.last}
                />
              </Link>

              <button onClick={e => dispatch(unfriend(friendWannabe.id))}>
                {" "}
                end friendship{" "}
              </button>
            </div>
          ))}
      </div>
      <p id="titleFindPeople">tão te querendo</p>
      <div className="friendsContainer">
        {invitations &&
          invitations.map(friendWannabe => (
            <div id="bottomFindPeople" key={friendWannabe.id}>
              <p>{friendWannabe.first} </p>
              <p>{friendWannabe.last}</p>
              <Link to={"/user/" + friendWannabe.id}>
                <img
                  id="findPeoplePic"
                  src={friendWannabe.url}
                  alt={friendWannabe.last}
                />
              </Link>
              <button
                onClick={e => dispatch(acceptFriendRequest(friendWannabe.id))}
              >
                {" "}
                accept friendship{" "}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
