import React from "react";
import axios from "./axios";
import Profile from "./profile";
import Friends from "./friends";
import Uploader from "./uploader";
import ProfilePic from "./profilePic";
import { Link } from "react-router-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { OtherProfile } from "./otherProfile";
import { FindPeople } from "./FindPeople";
import { Chat } from "./chat";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    axios.get("/user").then(({ data }) => {
      this.setState(data);
    });
  }
  render() {
    if (!this.state.id) {
      return <img id="appLoadingPic" src="/progressbar.png" alt="Loading..." />;
    } else {
      return (
        <BrowserRouter>
          <div className="app">
            <div className="profile">
              <div className="picName">
                <img id="appLogoTop" src="/logo.jpg" alt="Rede Social" />
                <h3>Xodo</h3>
              </div>
              <div id="links">
                <Link to="/">My Profile</Link>
                <Link to="/findPeople">Find people</Link>
                <Link to="/friends-wannabes">Friends</Link>
                <Link to="/chat">Chat</Link>

                <a href="/logout">Log out</a>
              </div>
              <ProfilePic
                clickHandler={() =>
                  this.setState({
                    uploaderIsVisible: true
                  })
                }
                url={this.state.url}
                first={this.state.first}
                last={this.state.last}
              />
            </div>
            {this.state.uploaderIsVisible && (
              <Uploader
                setImageUrl={url =>
                  this.setState({
                    url: url,
                    uploaderIsVisible: false
                  })
                }
                closeModal={() =>
                  this.setState({
                    uploaderIsVisible: false
                  })
                }
              />
            )}
            <Route
              exact
              path="/"
              render={props => (
                <Profile
                  id={this.state.id}
                  first={this.state.first}
                  last={this.state.last}
                  url={this.state.url}
                  clickHandler={() =>
                    this.setState({
                      uploaderIsVisible: true
                    })
                  }
                  bio={this.state.bio}
                  setBio={bio =>
                    this.setState({
                      bio: bio
                    })
                  }
                />
              )}
            />
            <Route path="/user/:id" component={OtherProfile} />
            <Route path="/findPeople" component={FindPeople} />
            <Route path="/friends-wannabes" component={Friends} />
            <Route path="/chat" component={Chat} />
          </div>
        </BrowserRouter>
      );
    }
  }
}
