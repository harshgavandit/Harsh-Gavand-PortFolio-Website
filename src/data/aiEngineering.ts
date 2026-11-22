// AI engineering flows shown in the Architecture & Skills chapter. Every stage
// restates features already documented for the linked deployed projects in
// projects.json / recentProjects.json — no capability is added here.
export type FlowStage = {
  title: string;
  detail: string;
  tech: string[];
};

export type AIFlow = {
  id: string;
  tab: string;
  title: string;
  summary: string;
  stages: FlowStage[];
  projects: string[]; // project slugs
};

export const aiFlows: AIFlow[] = [
  {
    id: "rag",
    tab: "RAG pipelines",
    title: "Retrieval-augmented answers with traceable sources",
    summary:
      "Document assistants that retrieve before they generate, keep page and source labels through every step, and say so when the answer is not in the documents.",
    stages: [
      {
        title: "Ingest",
        detail:
          "PDF and Markdown sources are split into overlapping, heading-aware chunks that keep their page numbers and source labels.",
        tech: ["Python", "pypdf"],
      },
      {
        title: "Embed & index",
        detail:
          "OpenAI embeddings or MiniLM ONNX vectors are indexed per document, with session-isolated indexes for visitor uploads.",
        tech: ["OpenAI embeddings", "ONNX Runtime", "FAISS"],
      },
      {
        title: "Hybrid retrieval",
        detail:
          "BM25 keyword results and vector results are fused with reciprocal rank fusion; maximal marginal relevance removes near-duplicate passages.",
        tech: ["BM25", "Reciprocal rank fusion", "MMR"],
      },
      {
        title: "Semantic cache",
        detail:
          "Exact and semantic cache lookups reuse earlier answers together with their original source references, shared across serverless requests.",
        tech: ["Upstash Redis"],
      },
      {
        title: "Grounded generation",
        detail:
          "The model answers only from the retrieved context; source IDs are validated, and out-of-scope questions get an explicit not-found response.",
        tech: ["OpenAI API", "FastAPI"],
      },
      {
        title: "Cited answer",
        detail:
          "Responses ship with page references and expandable retrieved passages so the reader can check the evidence.",
        tech: ["Source citations"],
      },
    ],
    projects: [
      "rag-book-assistant",
      "hybrid-rag-documentation-assistant",
      "symposium-rag-semantic-cache",
    ],
  },
  {
    id: "agents",
    tab: "Agents & guardrails",
    title: "Model-selected actions inside deterministic policies",
    summary:
      "The model chooses tools, but Python decides what is allowed: every transfer is validated and staged for explicit confirmation before the ledger changes.",
    stages: [
      {
        title: "User intent",
        detail:
          "A banking request arrives through the browser chat with its own isolated session state.",
        tech: ["FastAPI"],
      },
      {
        title: "Agent planning",
        detail:
          "A Google ADK agent selects from five banking tools covering account lookup, beneficiary validation, transfer requests and ledger results.",
        tech: ["Google ADK", "OpenAI"],
      },
      {
        title: "Policy check",
        detail:
          "Python validates beneficiaries, amounts, balances and daily limits before any ledger operation is allowed.",
        tech: ["Python"],
      },
      {
        title: "Staged confirmation",
        detail:
          "A transfer is staged and needs explicit confirmation in a later turn; changed transfer details invalidate stale pending state.",
        tech: ["Upstash Redis"],
      },
      {
        title: "Ledger result",
        detail:
          "Tool outcomes and account balances show whether an operation executed; the browser-scoped ledger persists across requests.",
        tech: ["Upstash Redis", "Python"],
      },
    ],
    projects: ["banking-agent-harness"],
  },
  {
    id: "multi-agent",
    tab: "Multi-agent workflows",
    title: "Routed specialists with a human in the loop",
    summary:
      "Customer conversations become validated tickets, a graph routes them to the right specialist, and refunds wait for a human reviewer.",
    stages: [
      {
        title: "Intake",
        detail:
          "Multi-turn conversation details are compacted into a validated Pydantic ticket.",
        tech: ["Pydantic", "LiteLLM"],
      },
      {
        title: "Routing graph",
        detail:
          "LangGraph routes each ticket to billing, refund or general-support workflows.",
        tech: ["LangGraph"],
      },
      {
        title: "Tool lookups",
        detail:
          "Read-only SQLite tools retrieve invoices, payments and refund eligibility from order records.",
        tech: ["SQLite"],
      },
      {
        title: "Human review",
        detail:
          "A separate approver view resolves eligible refund requests in an independent review graph.",
        tech: ["Streamlit", "LangGraph"],
      },
      {
        title: "Resolution",
        detail:
          "Session resume returns the decision to the correct customer conversation; Redis admission control guards requests and model calls.",
        tech: ["Upstash Redis"],
      },
    ],
    projects: ["multi-agent-customer-support"],
  },
  {
    id: "automation",
    tab: "Automation workflows",
    title: "From live feeds to a personalised brief",
    summary:
      "A Python service collects technology news, summarises and ranks it for each reader, and delivers a short, source-linked brief.",
    stages: [
      {
        title: "Collect",
        detail:
          "Live RSS stories from OpenAI, Anthropic and YouTube are gathered concurrently while source identities and URLs are preserved.",
        tech: ["Feedparser", "HTTPX", "BeautifulSoup"],
      },
      {
        title: "Summarise",
        detail:
          "OpenAI agents summarise source excerpts in parallel behind a FastAPI service.",
        tech: ["OpenAI API", "FastAPI"],
      },
      {
        title: "Rank",
        detail:
          "Stories are ranked against the reader's interests to build a three- or five-story digest, with cached results.",
        tech: ["Pydantic"],
      },
      {
        title: "Compose",
        detail:
          "Each story gets a source-linked summary and an explanation of why it is relevant; signed previews come before delivery.",
        tech: ["Python"],
      },
      {
        title: "Deliver",
        detail:
          "Readers preview, copy or download the HTML digest, with owner-authenticated email delivery.",
        tech: ["SMTP", "Vercel"],
      },
    ],
    projects: ["news-automation"],
  },
];

export const aiFoundations = [
  "Python & FastAPI services",
  "Pydantic-validated contracts",
  "Redis admission control",
  "Source-linked outputs",
  "OpenAI · Google ADK · LangGraph",
];
