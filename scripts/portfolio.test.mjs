import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  projects as catalog,
  latestAIProjects,
  communityProjects,
  caseStudies,
  profile,
  experience,
  skills,
} from "../src/data/portfolio.ts";
import { buildRequest, sourceLinks } from "../server/openai.mjs";
import { matchesProjectCollection } from "../src/lib/portfolioActions.ts";
import { curatedArchive } from "../src/data/recruiter.ts";
import { codeTokens } from "../src/lib/codeTokens.ts";
import { renderDemoOrigins, warmDemoRequests } from "../src/lib/demoWarmup.ts";
import { startTraceReplay } from "../src/lib/traceReplay.ts";
import { resumeStackGroups } from "../src/data/heroStack.ts";
const projects = JSON.parse(
  readFileSync(new URL("../src/data/projects.json", import.meta.url), "utf8"),
);
test("the attached resume is published as a valid PDF with a canonical assistant source", () => {
  assert.equal(profile.resume, "/resume.pdf");
  const pdf = readFileSync(new URL("../public/resume.pdf", import.meta.url));
  assert.match(pdf.subarray(0, 8).toString(), /^%PDF-1\./);
  assert.match(pdf.subarray(-100).toString(), /%%EOF/);
  assert.equal(
    existsSync(new URL("../public/Harsh_Gavand_Resume.pdf", import.meta.url)),
    false,
  );
  assert.deepEqual(
    sourceLinks({ projectIds: [], sections: ["resume", "contact"] }),
    [
      { label: "Harsh’s Resume (PDF)", href: "/resume.pdf" },
      { label: "Contact Harsh", href: "/#contact" },
    ],
  );
  const request = buildRequest([
    { role: "user", content: "How can I contact Harsh?" },
  ]);
  assert.ok(
    request.text.format.schema.properties.sections.items.enum.includes(
      "resume",
    ),
  );
});

test("demo warmup deduplicates HTTPS Render origins and isolates request failures", async () => {
  const origins = renderDemoOrigins([
    { demoUrl: "https://banking-app-saas.onrender.com/path" },
    { demoUrl: "https://banking-app-saas.onrender.com/" },
    { demoUrl: "https://github-replica.onrender.com/" },
    { demoUrl: "https://example.com/" },
    { demoUrl: "http://banking-app-saas.onrender.com/" },
    { demoUrl: "https://banking-app-saas.onrender.com.evil.example/" },
    { demoUrl: "https://name:password@banking-app-saas.onrender.com/" },
    { demoUrl: "invalid" },
  ]);
  assert.deepEqual(origins, [
    "https://banking-app-saas.onrender.com/",
    "https://github-replica.onrender.com/",
  ]);
  const controller = new AbortController();
  const calls = [];
  await warmDemoRequests(
    origins,
    async (url, options) => {
      calls.push({ url, options });
      throw new Error("Unreachable demo");
    },
    controller.signal,
  );
  assert.equal(calls.length, 2);
  for (const { options } of calls) {
    assert.equal(options.mode, "no-cors");
    assert.equal(options.cache, "no-store");
    assert.equal(options.credentials, "omit");
    assert.equal(options.referrerPolicy, "no-referrer");
    assert.equal(options.signal, controller.signal);
  }
});
test("curated archive references eight distinct catalog projects and flagship stacks match reviewed source", () => {
  assert.equal(curatedArchive.length, 8);
  assert.equal(new Set(curatedArchive.map((item) => item.projectId)).size, 8);
  for (const item of curatedArchive)
    assert.ok(catalog.some((project) => project.id === item.projectId));
  const stack = (id) =>
    catalog.find((project) => project.id === id).technologies;
  for (const value of ["Prisma", "PostgreSQL", "Google AI"])
    assert.ok(stack(14).includes(value));
  assert.ok(!stack(14).includes("MongoDB"));
  assert.ok(stack(3).includes("Sequelize"));
  for (const value of ["Next.js", "Plaid", "Appwrite"])
    assert.ok(!stack(3).includes(value));
  assert.ok(stack(17).includes("Ollama"));
  assert.equal(caseStudies.length, 4);
  for (const study of caseStudies) assert.equal(study.engineering.length, 3);
});
test("preserves all original project identities while correcting editorial copy", () => {
  const identities = JSON.parse(
    readFileSync(
      new URL("./fixtures/project-identities.json", import.meta.url),
      "utf8",
    ),
  );
  assert.deepEqual(
    projects.map(({ id, githubUrl }) => ({ id, githubUrl })),
    identities,
  );
  for (const project of catalog) {
    if ([14, 3, 1, 17].includes(project.id)) {
      assert.doesNotMatch(project.impact, /^I /);
      assert.doesNotMatch(project.role, /^I /);
    }
    assert.ok(
      project.features.length &&
        project.challenges.length &&
        project.overview.length,
    );
    assert.ok(!project.githubUrl.endsWith(".git"));
  }
});

test("code tokens preserve identifiers and quoted strings while highlighting complete keywords", () => {
  const line =
    '  await quota.releaseOrEnqueueRetry(reservation, "try catch await");';
  const tokens = codeTokens(line);
  assert.equal(tokens.map((token) => token.text).join(""), line);
  assert.deepEqual(
    tokens
      .filter((token) => token.kind === "keyword")
      .map((token) => token.text),
    ["await"],
  );
  assert.ok(
    tokens.some(
      (token) =>
        token.kind === "text" &&
        token.text.includes("quota.releaseOrEnqueueRetry("),
    ),
  );
  assert.equal(
    codeTokens("retryCount $try try$Value undefinedValue").filter(
      (token) => token.kind === "keyword",
    ).length,
    0,
  );
  assert.equal(
    tokens.find((token) => token.kind === "string").text,
    '"try catch await"',
  );
});

test("every selected system-flow step includes implementation detail and truthful access metadata", () => {
  for (const study of caseStudies) {
    assert.equal(study.diagram.nodes.length, 5);
    assert.equal(study.diagram.details.length, 5);
    assert.equal(study.diagram.contracts.length, 5);
    assert.ok(study.diagram.details.every((detail) => detail.length > 25));
    assert.ok(study.accessDescription.length > 20);
  }
  assert.equal(
    caseStudies.find((study) => study.projectId === 17).accessMode,
    "Local Pipeline App",
  );
});
test("all project identifiers are unique and repository/demo links are valid HTTPS URLs", () => {
  assert.equal(new Set(catalog.map((p) => p.id)).size, catalog.length);
  assert.equal(
    new Set(catalog.map((p) => p.githubUrl.toLowerCase())).size,
    catalog.length,
  );
  for (const project of catalog) {
    assert.equal(new URL(project.githubUrl).protocol, "https:");
    assert.equal(new URL(project.githubUrl).hostname, "github.com");
    if (project.demoUrl)
      assert.equal(new URL(project.demoUrl).protocol, "https:");
    assert.ok(
      project.features.length &&
        project.technologies.length &&
        project.role.length,
    );
  }
});
test("all recently pushed AI repositories are included once, discoverable, and traced to reviewed commits", () => {
  const sources = JSON.parse(
    readFileSync(
      new URL(
        "../verification/github-projects-2026-10-15/sources.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.equal(
    catalog.length,
    projects.length + latestAIProjects.length + communityProjects.length,
  );
  assert.equal(latestAIProjects.length, 12);
  assert.equal(sources.projects.length, 12);
  assert.deepEqual(
    catalog.filter((project) => matchesProjectCollection(project, "Latest AI")),
    latestAIProjects,
  );
  for (const source of sources.projects) {
    const project = catalog.find((item) => item.id === source.projectId);
    assert.equal(project.githubUrl, source.url);
    assert.ok(Date.parse(source.pushedAt) >= Date.parse(sources.windowStart));
    assert.ok(Date.parse(source.pushedAt) <= Date.parse(sources.windowEnd));
    assert.match(source.commit, /^[a-f0-9]{40}$/);
    assert.ok(source.inspectedSourcePaths.length > 0);
    assert.equal(matchesProjectCollection(project, "Latest AI"), true);
    assert.equal(matchesProjectCollection(project, "AI & ML"), true);
    assert.equal(matchesProjectCollection(project, "All"), true);
    assert.equal(project.demoUrl, undefined);
  }
  for (const project of projects) {
    assert.deepEqual(
      catalog.find((item) => item.id === project.id),
      project,
    );
    assert.equal(matchesProjectCollection(project, "Latest AI"), false);
  }
  assert.ok(
    caseStudies.every((study) =>
      catalog.some((project) => project.id === study.projectId),
    ),
  );
});
test("all responsive featured images exist", () => {
  for (const name of ["github", "banking"])
    for (const width of [640, 1280]) {
      assert.ok(
        existsSync(
          new URL(`../public/projects/${name}-${width}.webp`, import.meta.url),
        ),
      );
    }
});

test("the hero stack covers resume technologies and only references valid local brand symbols", () => {
  assert.equal(resumeStackGroups.length, 6);
  const items = resumeStackGroups.flatMap((group) => group.items);
  const names = items.map((item) => item.name);
  assert.equal(new Set(names).size, names.length);
  for (const required of [
    "React",
    "Next.js",
    "JavaScript ES6+",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "Mongoose",
    "JWT Auth",
    "Socket.io",
    "WebRTC",
    "Python",
    "Django",
    "Flask",
    "FastAPI",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "DynamoDB",
    "Redis",
    "Kafka",
    "Pandas",
    "NumPy",
    "scikit-learn",
    "TensorFlow",
    "LSTM Forecasting",
    "Anomaly Detection",
    "Moving Average Analysis",
    "RAG",
    "LLM APIs",
    "Vector Databases",
    "Embeddings",
    "LangChain",
    "LangGraph",
    "Computer Vision",
    "Django REST Framework",
    "SQLAlchemy",
    "Matplotlib",
    "yfinance",
    "Clerk",
    "Cloudinary",
    "OpenAI APIs",
    "MinMax Scaling",
    "Docker",
    "Docker Compose",
    "Gunicorn",
    "CI/CD",
    "Git",
    "GitHub",
    "Postman",
    "Cursor",
    "Codex",
    "Claude Code",
    "Antigravity",
    "AWS",
    "GCP",
    "Linux",
    "SQL",
    "DSA & OOP",
    "Async Tasks",
    "Data Pipelines",
    "Scripting & Automation",
  ])
    assert.ok(names.includes(required), required);
  const sprite = readFileSync(
    new URL("../public/stack/technology-logos.svg", import.meta.url),
    "utf8",
  );
  const symbols = new Set(
    [...sprite.matchAll(/<symbol\b[^>]*id="([^"]+)"/g)].map(
      (match) => match[1],
    ),
  );
  for (const item of items) {
    if (item.brand) assert.ok(symbols.has(item.brand), item.brand);
    else assert.ok(item.motif);
  }
  assert.doesNotMatch(
    sprite,
    /<(?:script|foreignObject)\b|\bon\w+\s*=|\b(?:href|src)=/i,
  );
});
test("SEO files use the canonical production origin and valid structured data", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const schema = JSON.parse(
    html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
  );
  assert.equal(schema.name, "Harsh Gavand");
  assert.equal(schema.email, profile.email);
  for (const path of ["robots.txt", "sitemap.xml"])
    assert.ok(
      readFileSync(
        new URL(`../public/${path}`, import.meta.url),
        "utf8",
      ).includes(schema.url),
    );
});

test("trace replay visits four stages at 150ms intervals and cancels stale callbacks", () => {
  const pending = [];
  const seen = [];
  let completed = 0;
  const cancelled = [];
  const stop = startTraceReplay({
    onStep: (step) => seen.push(step),
    onComplete: () => completed++,
    schedule: (callback, delay) => {
      pending.push({ callback, delay });
      return pending.length;
    },
    cancel: (handle) => cancelled.push(handle),
  });
  assert.deepEqual(seen, [0]);
  assert.deepEqual(
    pending.map((item) => item.delay),
    [150, 300, 450, 600],
  );
  pending.forEach((item) => item.callback());
  assert.deepEqual(seen, [0, 1, 2, 3]);
  assert.equal(completed, 1);
  stop();
  pending.forEach((item) => item.callback());
  assert.equal(completed, 1);
  assert.deepEqual(cancelled, [1, 2, 3, 4]);
  const late = [];
  const cancelledSteps = [];
  const cancelEarly = startTraceReplay({
    onStep: (step) => cancelledSteps.push(step),
    onComplete: () => assert.fail("Cancelled replay must not complete"),
    schedule: (callback) => {
      late.push(callback);
      return late.length;
    },
    cancel: () => {},
  });
  cancelEarly();
  late.forEach((callback) => callback());
  assert.deepEqual(cancelledSteps, [0]);
});

test("availability, experience shipments and architectural skills carry concrete public proof", () => {
  assert.equal(profile.workPreference, "Remote only");
  assert.equal(profile.email, "harshgavand2@gmail.com");
  assert.doesNotMatch(profile.availability, /relocat/i);
  assert.equal(skills.length, 4);
  for (const group of skills) {
    assert.ok(group.patterns.length > 45);
    assert.ok(group.proofs.length >= 2);
  }
  for (const job of experience) {
    assert.equal(job.points.length, 3);
    assert.ok(job.shipment.length > 40);
    assert.ok(job.points.every((point) => point.includes(": ")));
  }
  for (const file of ["brand/hg-icon.webp", "favicon.png"])
    assert.ok(existsSync(new URL("../public/" + file, import.meta.url)));
});

test("original supplied portrait remains unaltered", () => {
  const portrait = readFileSync(
    new URL("../public/portrait/harsh.jpeg", import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(portrait).digest("hex"),
    "cf722b0070f9634cd864ac056994766102892c4675d831147a0c6007d91bdf96",
  );
});

test("new studio portrait matches the user's supplied photograph", () => {
  const photo = readFileSync(
    new URL("../public/portrait/harsh-studio.jpg", import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(photo).digest("hex"),
    "d588f408c446e4cef1588f8bf0ae3cf1f2cb6a0ef5b052ee910903c51d5c2686",
  );
});
