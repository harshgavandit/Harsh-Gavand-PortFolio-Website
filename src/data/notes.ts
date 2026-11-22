// Engineering notes: long-form technical write-ups about shipped code.
//
// Publishing: a note with `draft: true` is excluded from production builds,
// the sitemap, the RSS feed, structured data and navigation. It is visible in
// `npm run dev` (and in builds run with NOTES_DRAFTS=1) for review. Set
// `draft: false` and the real publication date to publish it.

export type NoteBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; language: string; code: string };

export type Note = {
  slug: string;
  title: string;
  description: string;
  published: string; // YYYY-MM-DD
  updated?: string; // YYYY-MM-DD
  draft: boolean;
  tags: string[];
  /** Case-study slug the note explains, when there is one. */
  projectSlug?: string;
  sources: { label: string; href: string }[];
};

declare const __NOTES_DRAFTS__: boolean | undefined;
// The bundler defines __NOTES_DRAFTS__; Node scripts importing this file
// directly read NOTES_DRAFTS from the environment instead.
const nodeEnv = (
  globalThis as { process?: { env?: Record<string, string | undefined> } }
).process?.env;
const draftFlag =
  typeof __NOTES_DRAFTS__ !== "undefined"
    ? __NOTES_DRAFTS__
    : nodeEnv?.NOTES_DRAFTS === "1";
export const includeDrafts =
  draftFlag || (import.meta.env?.DEV as boolean | undefined) === true;

const repo =
  "https://github.com/harshgavandit/Harsh-Gavand-PortFolio-Website/blob/main";

const allNotes: Note[] = [
  {
    slug: "reserve-then-settle-llm-budget",
    title: "Reserve, then settle: capping LLM spend for a public AI assistant",
    description:
      "How the portfolio assistant reserves a worst-case OpenAI cost in Redis before each call, settles the real cost afterwards, and recovers when settlement fails.",
    published: "2026-11-22",
    draft: true,
    tags: ["LLM cost control", "Redis", "Node.js", "OpenAI API"],
    sources: [
      { label: "server/quota.mjs", href: `${repo}/server/quota.mjs` },
      {
        label: "server/quota-lifecycle.mjs",
        href: `${repo}/server/quota-lifecycle.mjs`,
      },
      {
        label: "vercel.json (reconciliation cron)",
        href: `${repo}/vercel.json`,
      },
    ],
  },
  {
    slug: "bm25-code-grounding-portfolio-assistant",
    title:
      "Grounding an AI assistant in source code with BM25 and pinned commits",
    description:
      "How the portfolio assistant retrieves excerpts from allowlisted GitHub files with BM25-style scoring and may only cite code it was actually shown.",
    published: "2026-11-22",
    draft: true,
    tags: ["RAG", "BM25", "Retrieval", "OpenAI API", "Grounding"],
    sources: [
      { label: "server/grounding.mjs", href: `${repo}/server/grounding.mjs` },
      { label: "server/openai.mjs", href: `${repo}/server/openai.mjs` },
      {
        label: "scripts/sync-source-index.mjs",
        href: `${repo}/scripts/sync-source-index.mjs`,
      },
    ],
  },
];

export const notes: Note[] = allNotes
  .filter((note) => includeDrafts || !note.draft)
  .sort((a, b) => b.published.localeCompare(a.published));

export function noteBySlug(slug: string | undefined) {
  return notes.find((note) => note.slug === slug) || null;
}

export const noteModified = (note: Note) => note.updated || note.published;
