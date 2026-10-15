import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import Portfolio from "./Portfolio";

export function render(location: string, year: number) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={location}>
        <Portfolio year={year} />
      </StaticRouter>
    </React.StrictMode>,
  );
}
