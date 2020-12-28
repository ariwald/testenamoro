import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
  const [buttonText, setButtonText] = useState("");
  useEffect(() => {
    try {
      (async () => {
        console.log("button mounted");
        console.log("props: ", props);
        if (props.currentId) {
          const { data } = await axios.get(
            "/friends-status/" + props.currentId
          );
          console.log("data from friends status/:id: ", data);
          // if you get back an empty array, there's no friendship between the two users, render the make friend request button
          if (data == []) {
            // console.log("[] means no friendship");
            setButtonText("gostei de vc");
          } else if (data.accepted == false) {
            console.log("not accepted");
            if (data.sender_id == props.currentId) {
              setButtonText("tb gostei de vc");
            } else if (data.recipient_id == props.currentId) {
              setButtonText("mudei de ideia, cancela");
            }
          } else if (data.accepted == true) {
            setButtonText("n gosto mais de vc");
          }
        }
      })();
    } catch (err) {
      console.log("err in mounting: ", err);
    }
  });

  //post request
  const handleClick = () => {
    console.log("button mounted");

    if (buttonText == "gostei de vc") {
      try {
        (async () => {
          const { data } = await axios.post(
            "/make-friend-request/" + props.currentId
          );
          if (data.success) {
            setButtonText("n gosto mais de vc");
          }
        })();
      } catch (err) {
        console.log("err in /make-friend-request: ", err);
      }
    } else if (buttonText == "tb gostei de vc") {
      // POST /accept-friend-request/:id
      try {
        (async () => {
          const { data } = await axios.post(
            "/accept-friend-request/" + props.currentId
          );
          if (data.success) {
            setButtonText("n gosto mais de vc");
          }
        })();
      } catch (err) {
        console.log("error in /accept friend request: ", err);
      }
    } else if (
      buttonText == "mudei de ideia, cancela" ||
      buttonText == "n gosto mais de vc"
    ) {
      //POST /end-friendship/:id
      try {
        (async () => {
          (async () => {
            const { data } = await axios.post(
              "/end-friendship/" + props.currentId
            );
            if (data.success) {
              setButtonText("gostei de vc");
            }
          })();
        })();
      } catch (err) {
        console.log("error in /end-friendship: ", err);
      }
    }
  };

  return (
    <div>
      <button onClick={handleClick}>{buttonText}</button>
    </div>
  );
}
