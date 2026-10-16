import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import Portfolio from "./Portfolio";
import { WorkDetail } from "./components/WorkDetail";
import { ProjectArchive } from "./components/ProjectArchive";
import { AIWorkspace } from "./components/AIWorkspace";

export function render(location: string, year: number) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={location}>
        <Portfolio
          year={year}
          pages={{ Work: WorkDetail, Archive: ProjectArchive, AI: AIWorkspace }}
        />
      </StaticRouter>
    </React.StrictMode>,
  );
}
