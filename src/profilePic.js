import React from "react";

export default function ProfilePic(props) {
    let profilePicImageSource = props.url || "/default.png";
    let id = props.type || "profilePic";
    return (
        <div>
            <img
                id={id}
                src={profilePicImageSource}
                alt="profilePic"
                onClick={() => props.clickHandler()}
            />
        </div>
    );
}
