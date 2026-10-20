import { projects, type CaseStudy } from "./portfolio.ts";
import type { CaseEvidence } from "./caseEvidence.ts";

// Public demos checked against deployed workflows on 20 October 2026 (IST).
// This inventory deliberately excludes demos whose primary AI flow needs a private code.
export const deploymentShowcase = [
  {
    projectId: 37,
    capture: "docwise-live.jpg",
    alt: "Deployed Docwise assistant showing a FastMCP answer, its source citation, and five retrieved documentation passages",
    revision: "c65af163be195f3f1d9ac3bcb63cd80cbe78e129",
    sourcePath: "web/app.py",
    scope: "Public documentation demo · 2 documents · Shared daily allowance",
    checks: [
      "A FastMCP question returned a cited answer matching its source passage.",
      "An unrelated cafeteria question returned the documentation refusal.",
      "The deployed health endpoint reported 2 documents and 39 indexed passages.",
    ],
    engineering: [
      "Hybrid retrieval: Fuse BM25 and MiniLM ONNX vector rankings through reciprocal rank fusion before building a source-grounded prompt.",
      "Traceable answers: Validate citation labels against retrieved passages and expose those passages in the interface.",
      "Serverless delivery: Package a lightweight read-only index and enforce shared Redis admission before model calls.",
    ],
    nodes: [
      "Documentation question",
      "BM25 + ONNX vectors",
      "Reciprocal rank fusion",
      "OpenAI answer",
      "Citations & source passages",
    ],
  },
  {
    projectId: 36,
    capture: "voice-assistant-live.jpg",
    alt: "Deployed voice adventure assistant showing the transcribed Maya and Mars prompt, a generated story, and audio playback controls",
    revision: "3a4024db50f69b4b0b922300a8cada5cf4c1c0a5",
    sourcePath: "main.py",
    scope:
      "Public voice demo · Bundled recording available · AI-generated speech",
    checks: [
      "The bundled recording was transcribed into the expected story request.",
      "A contextual Mars adventure was generated and returned as text.",
      "Generated audio appeared in the browser player and playback started.",
    ],
    engineering: [
      "Async audio pipeline: Coordinate transcription, contextual story generation, and speech synthesis behind one FastAPI request.",
      "Recoverable interaction: Show processing and playback states, constrain recordings and uploads, and keep manual playback available.",
      "Conversation state: Bound process-local history and commit a turn after the complete provider workflow succeeds.",
    ],
    nodes: [
      "Recorded or uploaded audio",
      "Whisper transcription",
      "Contextual OpenAI story",
      "Speech synthesis",
      "Transcript, story & MP3",
    ],
  },
  {
    projectId: 29,
    capture: "shopping-assistant-live.jpg",
    alt: "Deployed ADK Shopping interface showing a completed synthetic order summary for two Pixel 9 phones and the calculated demo cart total",
    revision: "a72dc499447666a25029c2e7d0871182ae47cb20",
    sourcePath: "ADK_Shopping/cloud_server.py",
    scope:
      "Public shopping simulation · Use made-up details · No real orders or payments",
    checks: [
      "A fresh browser conversation collected the built-in demo profile and returned the smartphone catalogue.",
      "Two Pixel 9 phones produced the deterministic ₹1,40,000 cart total.",
      "Checkout returned the supplied synthetic address and correct summary; reload restored the cart.",
    ],
    engineering: [
      "Agents with deterministic tools: Coordinate four shopping specialists while Python validates catalogue choices, quantities, and totals.",
      "Durable conversations: Restore an opaque browser session and cart from Redis across requests and reloads.",
      "Streamed workflow: Return progressive chat events, validate inputs and origins, and keep checkout explicitly simulated.",
    ],
    nodes: [
      "Demo shopper profile",
      "Catalogue agent",
      "Validated Python cart",
      "Checkout agent",
      "Demo order summary",
    ],
  },
  {
    projectId: 31,
    capture: "symposium-cache-live.jpg",
    alt: "Deployed semantic-cache symposium assistant answering the Innovate 2026 date question with a cached-answer indicator and document sources",
    revision: "01eb34b8feeea2c918b5505d6896e907d3ca6345",
    sourcePath: "README.md",
    scope:
      "Public fictional-event demo · Persistent semantic cache · Source-page references",
    checks: [
      "The event-date question returned March 15, 2026 with source references.",
      "A repeated question returned cache_hit=true while retaining sources.",
      "An unsupported spaceship question returned the document-boundary refusal.",
    ],
    engineering: [
      "Source-preserving reuse: Check exact and embedding-similarity cache entries before generating a new grounded answer.",
      "Shared hosted state: Persist cache entries in Upstash Redis across Vercel requests; retain local adapters for development.",
      "Grounding & admission: Retrieve FAISS passages, keep page references, and gate client and provider requests with shared quotas.",
    ],
    nodes: [
      "Guide question",
      "Exact & semantic cache",
      "FAISS retrieval on miss",
      "Grounded OpenAI answer",
      "Answer, sources & cache status",
    ],
  },
  {
    projectId: 32,
    capture: "symposium-rag-live.jpg",
    alt: "Deployed Symposium Guide answering the event date and venue with expandable references to pages 1, 2, and 5",
    revision: "2b66d313aa224b0055ce69c3b4206af1867179ed",
    sourcePath: "README.md",
    scope: "Public PDF Q&A demo · 5-page event guide · Page references",
    checks: [
      "The date-and-venue question returned March 15, 2026 and Apex Institute of Technology.",
      "The answer exposed page references in an expandable source control.",
      "The deployed service reported 9 indexed passages and a healthy Redis connection.",
    ],
    engineering: [
      "Document retrieval: Ingest the guide separately and retrieve relevant FAISS passages for each question.",
      "Page-level context: Keep source metadata through generation and show deduplicated page references in chat.",
      "Public delivery: Connect a responsive JavaScript interface to FastAPI with input validation and shared Upstash admission.",
    ],
    nodes: [
      "Symposium question",
      "Question embedding",
      "FAISS guide passages",
      "OpenAI generation",
      "Answer & page references",
    ],
  },
  {
    projectId: 33,
    capture: "banking-harness-live.jpg",
    alt: "Deployed mock banking assistant showing synthetic account balances, saved beneficiaries, and a successful separately confirmed transfer",
    revision: "f00504f0b2bab1211ea183bcaf6bb3bf2f2152a3",
    sourcePath: "README.md",
    scope: "Public banking simulation · Isolated Redis ledger · No real money",
    checks: [
      "A ₹250 mock transfer was staged while the account balance stayed unchanged.",
      "A separate confirmation executed the transfer and reduced the balance by exactly ₹250.",
      "The browser showed pending and successful tool outcomes; the health endpoint reported Redis storage.",
    ],
    engineering: [
      "Policy before execution: Validate beneficiaries, balance, and transfer limits in Python before a mock transaction is allowed.",
      "Confirmation state: Require explicit confirmation in a later invocation and invalidate pending approval when transfer details change.",
      "Isolated hosted state: Preserve each browser’s mock ledger in Redis, with bounded model usage and guarded execution.",
    ],
    nodes: [
      "Agent tool intent",
      "Deterministic policy",
      "Later-turn confirmation",
      "Mock execution",
      "Redis ledger & checked result",
    ],
  },
];

export const deployedStudies: CaseStudy[] = deploymentShowcase.map((item) => {
  const project = projects.find(
    (candidate) => candidate.id === item.projectId,
  )!;
  return {
    projectId: project.id,
    shortName:
      project.id === 37
        ? "Docwise — Hybrid RAG Documentation Assistant"
        : project.title,
    problem: project.challenges,
    summary: project.overview,
    contributions: [{ label: "Implementation", description: project.role }],
    engineering: item.engineering,
    previewNote: item.scope,
    accessMode: "Public interactive demo",
    accessDescription: item.scope,
    publicPreview: true,
    takeaway: project.impact,
    recovery: project.challenges,
    diagram: {
      title: `${project.title} workflow`,
      nodes: item.nodes,
      details: [project.overview, ...item.engineering, project.impact],
      contracts: item.nodes.map((node, index) =>
        index === 0
          ? `Visitor input → ${node}`
          : `${item.nodes[index - 1]} → ${node}`,
      ),
      caption: item.scope,
      chapterNodes: [[0, 1], [2], [3, 4]],
    },
  };
});

export const deployedEvidence: Record<string, CaseEvidence> =
  Object.fromEntries(
    deploymentShowcase.map((item) => {
      const project = projects.find(
        (candidate) => candidate.id === item.projectId,
      )!;
      const source = `${project.githubUrl}/blob/${item.revision}`;
      return [
        project.slug,
        {
          context: project.overview,
          ownership: project.role,
          decision: {
            choice: item.engineering[0],
            alternative:
              "Let the model answer or act without a structured application workflow.",
            reason: project.challenges,
          },
          verifiedBehavior: item.checks,
          verification: [
            { label: "Deployed website", href: project.demoUrl! },
            {
              label: "Deployment review — 20 October 2026",
              href: "/verification/deployments-2026-10-20.json",
            },
          ],
          limitations: [item.scope, project.impact],
          failure: {
            trigger:
              "An invalid request, unavailable provider, or exhausted demo allowance.",
            handling:
              "The application validates input and returns a controlled error or explicit workflow boundary.",
          },
          sources: [
            { label: "Source and setup", href: `${source}/README.md` },
            { label: "Implementation", href: `${source}/${item.sourcePath}` },
          ],
        },
      ];
    }),
  );
