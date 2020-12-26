import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1
    };
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  submitStart() {
    axios
      .post("/reset/start", {
        email: this.state.email
      })
      .then(({ data }) => {
        if (data.success) {
          this.setState({ step: 2 });
        } else {
          this.setState({
            error: true
          });
        }
      });
  }
  submitVerify() {
    axios
      .post("/reset/verify", {
        email: this.state.email,
        secretCode: this.state.code,
        newPassword: this.state.password
      })
      .then(({ data }) => {
        console.log("data/post/reset/submitVerify: ", data);
        if (data.success) {
          console.log("success in /reset/submitVerify");
          this.setState({
            step: 3
          });
        } else {
          console.log("err submitVerify");
          this.setState({
            error: true
          });
        }
      });
  }
  getCurrentDisplay() {
    const step = this.state.step;
    if (step == "1") {
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
          <button onClick={e => this.submitStart()}>Resetar senha</button>
        </div>
      );
    } else if (step == "2") {
      return (
        <div className="form">
          {this.state.error && (
            <div className="error">
              {" "}
              Algo deu errado. Tente novamente mais tarde.
            </div>
          )}
          <input
            type="text"
            name="code"
            placeholder="Insira o código recebido"
            key="secretCode"
            onChange={e => this.handleChange(e)}
          />
          <input
            type="password"
            name="password"
            placeholder="Insira uma nova senha"
            onChange={e => this.handleChange(e)}
          />
          <button onClick={e => this.submitVerify()}>Enviar</button>
        </div>
      );
    } else if (step == "3") {
      return (
        <div className="form">
          {this.state.error && (
            <div className="error">
              Algo deu errado. Tente novamente mais tarde.
            </div>
          )}
          <div className="error">
            <h3>Deu certo!</h3>
            <p>Agora você pode logar com sua nova senha</p>
            <Link to="/login">Log in</Link>
          </div>
        </div>
      );
    }
  }
  render() {
    return <div>{this.getCurrentDisplay()}</div>;
  }
}
