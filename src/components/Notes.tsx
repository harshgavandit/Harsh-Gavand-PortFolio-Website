import { useParams } from "react-router-dom";
import { noteBySlug, notes, type Note } from "../data/notes";
import { noteBodies } from "../data/noteBodies";
import { projects } from "../data/portfolio";
import { workPath } from "../lib/projectNavigation";

const dateLabel = (value: string) =>
  new Date(value + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

function NoteMeta({ note }: { note: Note }) {
  return (
    <p className="note-meta">
      <time dateTime={note.published}>{dateLabel(note.published)}</time>
      {note.draft && <span className="note-draft"> · Draft</span>}
      <span aria-hidden="true"> · </span>
      <span>{note.tags.join(" · ")}</span>
    </p>
  );
}

export function NotesIndex() {
  return (
    <main
      id="main"
      className="work-page notes-page section-container"
      tabIndex={-1}
    >
      <a className="text-link" href="/">
        ← Portfolio
      </a>
      <header className="work-intro">
        <span className="eyebrow">Engineering notes</span>
        <h1>Notes on building full-stack and AI systems.</h1>
        <p>
          Technical write-ups by Harsh Gavand on the design decisions, failure
          handling, and trade-offs behind shipped code, each linked to its
          source.
        </p>
      </header>
      <ol className="notes-list">
        {notes.map((note) => (
          <li key={note.slug}>
            <article aria-labelledby={`note-${note.slug}`}>
              <h2 id={`note-${note.slug}`}>
                <a href={`/notes/${note.slug}/`}>{note.title}</a>
              </h2>
              <NoteMeta note={note} />
              <p>{note.description}</p>
            </article>
          </li>
        ))}
      </ol>
    </main>
  );
}

export function NoteArticle() {
  const { slug } = useParams();
  const note = noteBySlug(slug);
  if (!note)
    return (
      <main id="main" className="not-found section-container" tabIndex={-1}>
        <span className="eyebrow">404 / Note not found</span>
        <h1>This note isn’t published.</h1>
        <a className="button button-primary" href="/notes/">
          All engineering notes ↗
        </a>
      </main>
    );
  const project = note.projectSlug
    ? projects.find((item) => item.slug === note.projectSlug)
    : undefined;
  const projectHref = project ? workPath(project.slug) : null;
  return (
    <main
      id="main"
      className="work-page notes-page section-container"
      tabIndex={-1}
    >
      <a className="text-link" href="/notes/">
        ← Engineering notes
      </a>
      <article className="note-article" aria-labelledby="note-title">
        <header className="work-intro">
          <h1 id="note-title">{note.title}</h1>
          <p>{note.description}</p>
          <p className="note-byline">
            By <a href="/">Harsh Gavand</a>, Full-Stack &amp; AI Engineer
          </p>
          <NoteMeta note={note} />
        </header>
        <div className="note-body">
          {(noteBodies[note.slug] || []).map((block, index) => {
            if (block.type === "h2")
              return (
                <h2 key={index} id={block.id}>
                  {block.text}
                </h2>
              );
            if (block.type === "ul")
              return (
                <ul key={index}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            if (block.type === "code")
              return (
                <pre key={index} className="note-code">
                  <code data-language={block.language}>{block.code}</code>
                </pre>
              );
            return <p key={index}>{block.text}</p>;
          })}
        </div>
        <footer className="note-footer">
          <h2>Source code</h2>
          <ul>
            {note.sources.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noopener noreferrer">
                  {source.label} ↗
                </a>
              </li>
            ))}
          </ul>
          {projectHref && project && (
            <p>
              Related case study: <a href={projectHref}>{project.title}</a>
            </p>
          )}
          <p>
            <a href="/#contact">Contact Harsh</a> ·{" "}
            <a href="/notes/">More engineering notes</a>
          </p>
        </footer>
      </article>
    </main>
  );
}
