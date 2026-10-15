import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Portfolio from "./Portfolio";

import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./observatory.css";
import "./signal.css";

const root = document.getElementById("root")!;
const prerendered = root.dataset.prerendered === "true";
const year = prerendered ? Number(root.dataset.renderYear) : undefined;
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <Portfolio year={year} />
    </BrowserRouter>
  </React.StrictMode>
);
if (prerendered) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
