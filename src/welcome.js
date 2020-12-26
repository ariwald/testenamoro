import React from "react";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset";

import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
  return (
    <HashRouter>
      <div>
        <div className="welcomeHeader">
          <div className="welcomeMargin"> Xodó - Site de Namoro Negro </div>
          <img id="welcomePicTop" src="./logo.jpg" />
          <div className="welcomeMargin"> Para vc q sente falta de um bem </div>
        </div>

        <div className="welcomeBody">
          <div className="welcomeMargin">Acabe com a falta de xodó!</div>

          <div>Registre-se agora!</div>

          <div>
            <Route exact path="/" component={Registration} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/reset/start" component={ResetPassword} />
          </div>
        </div>
      </div>
    </HashRouter>
  );
}
