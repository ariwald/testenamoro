import React from "react";
import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="profileContainer">
                <ProfilePic
                    clickHandler={this.props.clickHandler}
                    first={this.props.first}
                    last={this.props.last}
                    url={this.props.url}
                    type="profilePicProfile"
                />
                <BioEditor
                    bio={this.props.bio}
                    id={this.props.id}
                    first={this.props.first}
                    last={this.props.last}
                    setBio={this.props.setBio}
                />
            </div>
        );
    }
}
