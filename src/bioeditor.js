import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: props.bio
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submit() {
        axios
            .post("/bioEditor", {
                id: this.props.id,
                bio: this.state.bio
            })
            .then(({ data }) => {
                this.props.setBio(data.bio);
                this.setState({
                    bio: data.bio,
                    editorIsVisible: false,
                    error: false
                });
            })
            .catch(() =>
                this.setState({
                    error: true
                })
            );
    }
    render() {
        return (
            <div className="bioContainer">
                {this.state.error && (
                    <div className="error">
                        Something went wrong. Try again!
                    </div>
                )}
                {this.state.bio && !this.state.editorIsVisible && (
                    <div>
                        <div className="center">
                            {this.props.first} {this.props.last}
                        </div>
                        <div>{this.props.bio}</div>
                        <button
                            onClick={() =>
                                this.setState({
                                    editorIsVisible: true
                                })
                            }
                        >
                            Edit your bio
                        </button>
                    </div>
                )}
                {this.state.editorIsVisible && (
                    <div>
                        <div className="center">Say something!</div>
                        <textarea
                            name="bio"
                            rows="10"
                            cols="50"
                            value={this.state.bio}
                            onChange={e => this.handleChange(e)}
                        />
                        <button onClick={() => this.submit()}>Save</button>
                    </div>
                )}
                {!this.state.bio && !this.state.editorIsVisible && (
                    <div>
                        <button
                            onClick={() =>
                                this.setState({
                                    editorIsVisible: true
                                })
                            }
                        >
                            Add bio
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
