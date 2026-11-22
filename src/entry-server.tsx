import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import Portfolio from "./Portfolio";
import { WorkDetail } from "./components/WorkDetail";
import { ProjectArchive } from "./components/ProjectArchive";
import { AIWorkspace } from "./components/AIWorkspace";
import { NoteArticle, NotesIndex } from "./components/Notes";

export function render(location: string, year: number) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={location}>
        <Portfolio
          year={year}
          pages={{
            Work: WorkDetail,
            Archive: ProjectArchive,
            AI: AIWorkspace,
            Notes: NotesIndex,
            Note: NoteArticle,
          }}
        />
      </StaticRouter>
    </React.StrictMode>,
  );
}
