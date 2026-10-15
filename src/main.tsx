import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Portfolio from "./Portfolio";

import "./fonts.css";
import "./recruiter.css";

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
