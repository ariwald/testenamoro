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
                        setButtonText("make friend request");
                    } else if (data.accepted == false) {
                        console.log("not accepted");
                        if (data.sender_id == props.currentId) {
                            setButtonText("accept friend request");
                        } else if (data.recipient_id == props.currentId) {
                            setButtonText("cancel friend request");
                        }
                    } else if (data.accepted == true) {
                        setButtonText("end friendship");
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

        if (buttonText == "make friend request") {
            try {
                (async () => {
                    const { data } = await axios.post(
                        "/make-friend-request/" + props.currentId
                    );
                    if (data.success) {
                        setButtonText("cancel friend request");
                    }
                })();
            } catch (err) {
                console.log("err in /make-friend-request: ", err);
            }
        } else if (buttonText == "accept friend request") {
            // POST /accept-friend-request/:id
            try {
                (async () => {
                    const { data } = await axios.post(
                        "/accept-friend-request/" + props.currentId
                    );
                    if (data.success) {
                        setButtonText("end friendship");
                    }
                })();
            } catch (err) {
                console.log("error in /accept friend request: ", err);
            }
        } else if (
            buttonText == "cancel friend request" ||
            buttonText == "end friendship"
        ) {
            //POST /end-friendship/:id
            try {
                (async () => {
                    (async () => {
                        const { data } = await axios.post(
                            "/end-friendship/" + props.currentId
                        );
                        if (data.success) {
                            setButtonText("make friend request");
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
