// src/index.js

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS import

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
