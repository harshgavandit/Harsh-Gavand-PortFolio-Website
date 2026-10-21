import { projects, type CaseStudy } from "./portfolio.ts";
import type { CaseEvidence } from "./caseEvidence.ts";

// Deployed demos with dated workflow checks; restricted features are labelled explicitly.
export const deploymentShowcase = [
  {
    projectId: 41,
    capture: "rag-book-assistant-live.jpg",
    captureWidth: 1536,
    captureHeight: 735,
    verifiedOn: "21 October 2026",
    reviewPath: "/verification/streamlit-projects-2026-10-21.json",
    alt: "Live RAG Document Q&A showing a fourteen-day return answer, its supporting page-two excerpt, and an explicit not-found response for an unsupported revenue question",
    revision: "3af6ca4c97df1eef7ee6ac374319acbb054bb0ca",
    sourcePath: "rag_core.py",
    scope: "PDF questions · Page-level sources · Session-isolated document indexes",
    accessNotice: "Public Streamlit demo with usage limits. Uploaded text is sent to OpenAI; use documents you are permitted to share.",
    checks: [
      "The live sample guide indexed three passages and answered the return-window question with the correct fourteen-day policy.",
      "Expanding the answer source showed the supporting passage from page 2.",
      "An annual-revenue question returned an explicit not-found response without a source citation.",
    ],
    engineering: [
      "Source-grounded retrieval: Embed overlapping PDF passages, select up to four results with cosine similarity and maximal marginal relevance, and validate the source IDs returned with GPT-4o-mini answers.",
      "Visitor isolation: Keep document vectors and conversations in Streamlit session state, with clear-document controls and no shared persistent index.",
      "Bounded API workflow: Validate PDF size, page count, text length, questions, and generated citations; apply session and process-level usage caps before paid requests.",
    ],
    nodes: [
      "PDF or fictional sample",
      "Page extraction & overlapping chunks",
      "OpenAI embeddings & MMR retrieval",
      "GPT-4o-mini structured answer",
      "Validated citations & page excerpts",
    ],
  },
  {
    projectId: 42,
    capture: "lstm-next-word-live.jpg",
    captureWidth: 1536,
    captureHeight: 735,
    verifiedOn: "21 October 2026",
    reviewPath: "/verification/streamlit-projects-2026-10-21.json",
    alt: "Live Next Word Lab showing the phrase the best way to and three ranked LSTM predictions: cheer, find, and live, with model probabilities",
    revision: "f42a793e3d4da5e4db2b689ade4aba0164d13e0b",
    sourcePath: "predictor.py",
    scope: "Trained LSTM · Three ranked predictions · No external inference API",
    accessNotice: "Educational language model. Suggestions can be imperfect; displayed probabilities are model outputs, not measured accuracy.",
    checks: [
      "The deployed app loaded the original TensorFlow/Keras LSTM and accepted the phrase the best way to.",
      "Inference returned cheer, find, and live as three ranked suggestions with visible model probabilities.",
      "The public interface exposed the model explanation, input form, and prediction results without requiring an API key.",
    ],
    engineering: [
      "End-to-end model inference: Tokenize a partial sentence, pad or truncate to the saved model's input shape, execute the LSTM on CPU, and decode three ranked predictions back to vocabulary words.",
      "Reusable model resources: Cache the original model and tokenizer across Streamlit reruns, load weights without training state, and bound CPU thread counts.",
      "Clear prediction boundaries: Reject empty, oversized, or entirely unknown phrases and label softmax probabilities without presenting them as benchmark accuracy.",
    ],
    nodes: [
      "Partial sentence",
      "Saved tokenizer",
      "Model-aligned sequence preparation",
      "TensorFlow/Keras LSTM inference",
      "Three ranked vocabulary predictions",
    ],
  },
  {
    projectId: 20,
    capture: "stock-prediction-live.jpg",
    captureWidth: 1920,
    captureHeight: 919,
    verifiedOn: "21 October 2026",
    reviewPath: "/verification/project-additions-2026-10-21.json",
    alt: "Live Stock Prediction Portal introducing LSTM stock analysis, historical prices, moving averages, and account access",
    revision: "94654e55aa1707de6e0c0a3bf56f68ce884da00f",
    sourcePath: "backend-drf/api/views.py",
    scope: "Historical stock analysis · LSTM estimates · Personal watchlists",
    accessNotice: "Sign in to analyze stocks and save a watchlist.",
    checks: [
      "The live landing page loaded the LSTM overview and 100-day / 200-day moving-average features.",
      "Opening Explore Now redirected to sign-in before the stock dashboard.",
      "The public readiness endpoint reported a connected database and loaded model weights.",
    ],
    engineering: [
      "Serverless ML inference: Run the trained Keras LSTM weights through batched NumPy inference, keeping the deployed prediction service independent of the TensorFlow runtime.",
      "Time-series evaluation: Fit price scaling on the earlier 70% of history, construct 100-session sequences, and return model comparisons with MSE, RMSE, and R-squared.",
      "Full-stack analysis workflow: Validate tickers in Django REST Framework, cache market and prediction responses, and connect JWT-authenticated React profiles and watchlists.",
    ],
    nodes: [
      "React ticker selection",
      "Django validation & market data",
      "100-session price sequences",
      "NumPy LSTM inference",
      "Charts, metrics & watchlist",
    ],
  },
  {
    projectId: 17,
    capture: "ai-news-email-live.jpg",
    captureWidth: 1920,
    captureHeight: 919,
    verifiedOn: "21 October 2026",
    reviewPath: "/verification/project-additions-2026-10-21.json",
    alt: "Live AI Brief reading room showing OpenAI source filtering, date controls, search, and source-linked news cards",
    revision: "a7407d0090a95b743db91f181ec46ec84141dfa0",
    sourcePath: "app/web_digest.py",
    scope:
      "Live RSS reader · Personalized OpenAI digests · HTML and Gmail delivery",
    accessNotice: "Email delivery uses the owner access key.",
    checks: [
      "The live reading room loaded source-linked RSS stories.",
      "Selecting the OpenAI source filtered the reader to OpenAI stories.",
      "The digest composer exposed reader interests, source selection, time windows, and three-story / five-story options.",
    ],
    engineering: [
      "Source-aware ingestion: Fetch publisher RSS feeds concurrently, normalize dates and excerpts, deduplicate by URL, and retain cached stories when upstream feeds fail.",
      "Parallel AI curation: Summarize selected excerpts with OpenAI, rank them against reader interests, and preserve source IDs and links through the composed digest.",
      "Controlled email delivery: Cache repeated digests, escape exported HTML, sign previews with HMAC, and validate owner access before sending to the configured Gmail inbox.",
    ],
    nodes: [
      "RSS feeds & reader filters",
      "Normalized source records",
      "Parallel OpenAI summaries",
      "Interest-based ranking",
      "Digest preview, HTML & Gmail",
    ],
  },
  {
    projectId: 30,
    capture: "healthcare-explorer-live.jpg",
    verifiedOn: "21 October 2026",
    reviewPath: "/verification/deployments-2026-10-21.json",
    alt: "Deployed Healthcare Explorer showing the generated patient directory, selected James Walker demonstration profile, and illustrative risk signals",
    revision: "12bca598ea688c6edc4e5326a442ac647745bac8",
    sourcePath: "app.py",
    scope:
      "Generated-data demonstration · Read-only tools · Risk heuristics are not clinical predictions",
    accessNotice: "Public explorer. AI chat requires a private access code.",
    checks: [
      "Directory search filtered the generated records to James Walker and the selected profile loaded its demonstration signals.",
      "Schema browsing exposed five related SQLite tables; the public directory contained 10 generated profiles.",
      "The deployed MCP endpoint exposed four tools; unauthenticated AI requests returned HTTP 401 without invoking the protected assistant.",
    ],
    engineering: [
      "Structured data access: Expose schema, bounded read-only SQL, and demonstration summaries through four discoverable MCP tools.",
      "Browser exploration: Connect patient search, profile details, and schema views to a separately generated synthetic SQLite database.",
      "Controlled AI access: Bound model tool loops and generated SQL, require an AI access code, and separate illustrative heuristics from clinical claims.",
    ],
    nodes: [
      "Explorer or authorised question",
      "FastAPI validation",
      "MCP tool discovery",
      "Read-only SQLite tools",
      "Structured result or tool-grounded answer",
    ],
  },
  {
    projectId: 35,
    capture: "customer-support-live.jpg",
    captureWidth: 1280,
    captureHeight: 720,
    verifiedOn: "21 October 2026",
    reviewPath: "/verification/deployments-2026-10-21.json",
    alt: "Hosted Streamlit customer-support conversation showing a seeded invoice lookup and a simulated refund decision with structured ticket and tool-trace controls",
    revision: "68a83dedc2c1f4037553e269ff883167a4933dc6",
    sourcePath: "streamlit_app.py",
    scope:
      "Streamlit teaching demo · Synthetic orders · Sessions reset on sleep or restart",
    accessNotice:
      "Simulated refunds only. The demonstration review queue is public.",
    checks: [
      "A live billing question for ORD-1003 returned the seeded INR 5,600 Smartwatch invoice and pending payment status.",
      "A synthetic ORD-1006 refund request created a separate manual-review item for the test session.",
      "Approving that simulated request cleared its queue entry and delivered the decision to the resumed customer conversation.",
    ],
    engineering: [
      "Validated routing: Compact multi-turn intake into a Pydantic ticket and route it through LangGraph to deterministic specialists.",
      "Separate human review: Store eligible mock refund requests and resolve them through a separate approval graph invocation.",
      "Bounded hosted workflow: Apply atomic Redis admission around model calls and support process-local session resume with explicit restart limits.",
    ],
    nodes: [
      "Customer conversation",
      "Structured intake & validation",
      "Billing or refund specialist",
      "Separate mock review",
      "Decision in resumed chat",
    ],
  },
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
    accessNotice: item.accessNotice,
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
              label: `Deployment review — ${item.verifiedOn ?? "20 October 2026"}`,
              href:
                item.reviewPath ?? "/verification/deployments-2026-10-20.json",
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
