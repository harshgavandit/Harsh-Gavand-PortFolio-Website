import React from "react";
import ReactDOM from "react-dom/client";
import Portfolio from "./Portfolio";

import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./observatory.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Portfolio />
  </React.StrictMode>,
);
