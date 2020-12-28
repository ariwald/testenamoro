import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export function FindPeople() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    let ignore;

    if (user == "") {
      (async () => {
        try {
          const { data } = await axios.get(`/findPeople.json`);
          if (!ignore) {
            setUsers(data.data);
          }
        } catch (e) {
          console.log(e);
        }
      })();
    } else {
      (async () => {
        const { data } = await axios.get("/findPerson.json/" + user);
        if (!ignore) {
          setUsers(data);
        }
      })();
    }

    return () => {
      ignore = true;
    };
  }, [user]);
  console.log("users: ", users);
  console.log("user: ", user);

  const onUserChange = ({ target }) => {
    setUser(target.value);
  };

  return (
    <div>
      <p id="titleFindPeople">Procurar pessoas</p>
      <p id="titleFindPeople">Novos membros</p>
      <div className="findPeopleContainer">
        {users.map(user => (
          <div id="bottomFindPeople" key={user.id}>
            <p>{user.first}</p>
            <p>{user.last}</p>
            <Link to={"/user/" + user.id}>
              <img id="findPeoplePic" src={user.url} />
            </Link>
          </div>
        ))}
      </div>
      <div id="bottomFindPeople">
        Procurando alguém em especial?
        <input
          onChange={onUserChange}
          type="text"
          placeholder="pessoa procurada"
        />
      </div>
    </div>
  );
}
