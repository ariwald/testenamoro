import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import { init } from "./socket";

import App from "./App";
//component which intermediates component and redux dataflow
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducers";

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
if (location.pathname == "/welcome") {
  elem = <Welcome />;
} else {
  //only logged users can chat
  init(store);
  elem = (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
console.log(elem);

ReactDOM.render(elem, document.querySelector("main"));

//*****************

//react sends to bundle "through" babel
//bundle triggers/is build out of start.js
//start.js writes in index.html main
