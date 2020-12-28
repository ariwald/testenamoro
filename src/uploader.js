import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }
    upload() {
        let formData = new FormData();
        formData.append("file", this.state.file);

        axios.post("/upload", formData).then(({ data }) => {
            console.log("getting desperate, please be data! : ", data);
            this.props.setImageUrl(data[0].url);
        });
    }
    render() {
        return (
            <div className="uploaderContainer">
                <h3>Change profile picture</h3>
                <h1 className="close" onClick={() => this.props.closeModal()}>
                    {" "}
                    X{" "}
                </h1>
                <div>
                    <input
                        id="inputUploader"
                        type="file"
                        accept="image/*"
                        name="file"
                        onChange={e => this.handleChange(e)}
                    />
                    {this.state.filename}
                </div>
                <button onClick={() => this.upload()}>upload</button>
            </div>
        );
    }
}
