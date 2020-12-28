import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
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
      .post("/welcome", {
        first: this.state.first,
        last: this.state.last,
        email: this.state.email,
        password: this.state.password
      })
      .then(({ data }) => {
        if (data.success) {
          location.replace("/");
        } else {
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
          name="first"
          placeholder="Insira seu nome"
          onChange={e => this.handleChange(e)}
        />
        <input
          type="text"
          name="last"
          placeholder="Insira seu sobrenome"
          onChange={e => this.handleChange(e)}
        />
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
        <button onClick={e => this.submit()}>Registrar</button>
        {<Link to="/login">Já se registrou? Log in!</Link>}{" "}
      </div>
    );
  }
}
