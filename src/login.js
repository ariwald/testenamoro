import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  submit() {
    axios
      .post("/login", {
        email: this.state.email,
        password: this.state.password
      })
      .then(({ data }) => {
        if (data.success) {
          //it worked//user is logged in
          //needs to go somewhere else
          location.replace("/");
        } else {
          //failure
          this.setState({
            error: true
          });
        }
      });
  }
  render() {
    return (
      <div className="form">
        {this.state.error && (
          <div className="error">
            Algo deu errado. Tente novamente mais tarde.
          </div>
        )}
        <input
          type="text"
          name="email"
          placeholder="Insira seu e-mail"
          onChange={e => this.handleChange(e)}
        />
        <input
          type="password"
          name="password"
          placeholder="Insira sua senha"
          onChange={e => this.handleChange(e)}
        />
        <button onClick={e => this.submit()}>Log in</button>
        <Link to="/reset/start">Esqueceu sua senha?</Link>
      </div>
    );
  }
}
