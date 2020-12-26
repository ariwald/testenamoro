import React from "react";
import axios from "./axios";
import FriendButton from "./friendButton";

export class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        axios.get("/api/user/" + this.props.match.params.id).then(data => {
            // console.log("data: ", data);
            if (this.props.match.params.id == data.data.loggedUser) {
                this.props.history.push("/");
            } else if (!data.data.data) {
                this.props.history.push("/");
            } else {
                this.setState({
                    first: data.data.data.first,
                    last: data.data.data.last,
                    url: data.data.data.url,
                    bio: data.data.data.bio
                });
            }
            // console.log(
            //     "this.props.match.params.id: ",
            //     this.props.match.params.id
            // );
        });
    }

    render() {
        return (
            <div>
                <div className="otherProfileContainer">
                    <p>{this.state.first}</p>
                    <p>{this.state.last}</p>
                    <img id="findPeoplePic" src={this.state.url} />
                    <FriendButton currentId={this.props.match.params.id} />
                    <div className="margin">{this.state.bio}</div>
                </div>
            </div>
        );
    }
}
