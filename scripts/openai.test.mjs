import assert from "node:assert/strict";
import { test } from "node:test";
import { generateReply, knowledgeFor, sourceLinks } from "../server/openai.mjs";
import { matchesProjectCollection } from "../src/lib/portfolioActions.ts";
import {
  projects,
  latestAIProjects,
  communityProjects,
} from "../src/data/portfolio.ts";

const messages = [
  { role: "user", content: "Tell me about the AI News-to-Email Digest." },
];
test("Agri Samaj is discoverable with its community description and live/source links", () => {
  const project = communityProjects.find(
    (item) => item.slug === "agri-samaj-community-platform",
  );
  assert.ok(project);
  assert.equal(
    project.demoUrl,
    "https://agri-samaj-community-platform.vercel.app",
  );
  const knowledge = knowledgeFor([
    { role: "user", content: "Tell me about the Agri Samaj community website" },
  ]);
  assert.ok(knowledge.projectDetails.some((item) => item.id === project.id));
  assert.ok(
    knowledge.caseStudyNotes.some((item) => item.projectId === project.id),
  );
  assert.match(project.overview, /open-source.*Agri Samaj community/);
  assert.equal(matchesProjectCollection(project, "Web & SaaS"), true);
  assert.equal(matchesProjectCollection(project, "Latest AI"), false);
  assert.deepEqual(sourceLinks({ projectIds: [project.id], sections: [] }), [
    { label: `${project.title} · source`, href: project.githubUrl },
    { label: `${project.title} · live website`, href: project.demoUrl },
  ]);
});
test("retrieval includes the relevant project and complete public project index", () => {
  const knowledge = knowledgeFor(messages);
  assert.equal(knowledge.projectIndex.length, projects.length);
  assert.ok(knowledge.projectDetails.some((p) => p.id === 17));
  const digestStudy = knowledge.caseStudyNotes.find(
    (study) => study.projectId === 17,
  );
  assert.ok(digestStudy.diagram.nodes.includes("Parallel OpenAI summaries"));
  assert.ok(
    digestStudy.contributions.some(
      (item) =>
        item.description.includes("FastAPI") &&
        item.description.includes("OpenAI"),
    ),
  );
  assert.ok(!JSON.stringify(knowledge).includes("OPENAI_API_KEY"));
});
test("each recent AI project is retrievable with its implementation context and canonical source link", () => {
  for (const project of latestAIProjects) {
    const knowledge = knowledgeFor([
      { role: "user", content: `Tell me about ${project.title}` },
    ]);
    assert.ok(
      knowledge.projectDetails.some((item) => item.id === project.id),
      project.title,
    );
    assert.deepEqual(sourceLinks({ projectIds: [project.id], sections: [] }), [
      { label: `${project.title} · source`, href: project.githubUrl },
      ...(project.demoUrl
        ? [{ label: `${project.title} · live website`, href: project.demoUrl }]
        : []),
    ]);
  }
});
test("OpenAI request uses server headers, trusted context and multi-turn role mapping", async () => {
  const result = await generateReply(
    [
      ...messages,
      { role: "assistant", content: "A digest pipeline." },
      { role: "user", content: "What is the stack?" },
    ],
    {
      apiKey: "fake-secret",
      model: "gpt-6-luna",
      fetchImpl: async (url, options) => {
        assert.equal(url, "https://api.openai.com/v1/responses");
        assert.equal(options.headers.Authorization, "Bearer fake-secret");
        const request = JSON.parse(options.body);
        assert.deepEqual(
          request.input.map((c) => c.role),
          ["user", "assistant", "user"],
        );
        assert.match(request.instructions, /Never invent/);
        assert.ok(!options.body.includes("fake-secret"));
        assert.equal(request.model, "gpt-6-luna");
        assert.equal(request.store, false);
        assert.equal(request.reasoning.effort, "none");
        assert.equal(request.service_tier, "default");
        assert.equal(request.max_output_tokens, 1000);
        assert.equal(request.text.format.type, "json_schema");
        assert.equal(request.text.format.strict, true);
        assert.equal(request.text.format.schema.additionalProperties, false);
        return providerResponse({
          answer: "Python and SQLAlchemy.",
          projectIds: [17],
          sections: [],
        });
      },
    },
  );
  assert.equal(result.answer, "Python and SQLAlchemy.");
});
for (const [status, code] of [
  [429, "quota"],
  [400, "configuration"],
  [401, "configuration"],
  [403, "configuration"],
  [404, "configuration"],
  [500, "unavailable"],
]) {
  test(`upstream ${status} becomes a safe ${code} error`, async () => {
    await assert.rejects(
      generateReply(messages, {
        apiKey: "fake",
        model: "gpt-6-luna",
        fetchImpl: async () =>
          Response.json(
            { error: { message: "private provider details" } },
            { status },
          ),
      }),
      (error) => error.code === code && !error.message.includes("private"),
    );
  });
}
test("timeout and malformed or incomplete output are recoverable errors", async () => {
  await assert.rejects(
    generateReply(messages, {
      apiKey: "fake",
      model: "gpt-6-luna",
      fetchImpl: async () => {
        throw new DOMException("timeout", "TimeoutError");
      },
    }),
    (error) => error.code === "timeout",
  );
  for (const body of [
    { status: "completed", output: [] },
    { status: "incomplete", output: [] },
    {
      status: "completed",
      output: [
        {
          type: "message",
          role: "assistant",
          content: [{ type: "output_text", text: "not json" }],
        },
      ],
    },
    {
      status: "completed",
      output: [
        {
          type: "message",
          role: "assistant",
          content: [{ type: "refusal", refusal: "Refused" }],
        },
      ],
    },
    {
      status: "completed",
      output: [
        {
          type: "message",
          role: "assistant",
          content: [
            {
              type: "output_text",
              text: JSON.stringify({
                answer: "Invalid sources",
                projectIds: [999],
                sections: [],
              }),
            },
          ],
        },
      ],
    },
    {
      status: "completed",
      output: [
        {
          type: "message",
          role: "assistant",
          content: [
            {
              type: "output_text",
              text: JSON.stringify({
                answer: "Bad shape",
                projectIds: "17",
                sections: [],
              }),
            },
          ],
        },
      ],
    },
  ]) {
    await assert.rejects(
      generateReply(messages, {
        apiKey: "fake",
        model: "gpt-6-luna",
        fetchImpl: async () => Response.json(body),
      }),
      (error) => error.code === "invalid_response",
    );
  }
});
test("source mapping rejects invented identifiers and prototype property names", () => {
  assert.deepEqual(
    sourceLinks({
      projectIds: [999],
      sections: ["__proto__", "constructor", "https://bad.example"],
    }),
    [],
  );
});

function providerResponse(result) {
  return Response.json({
    status: "completed",
    output: [
      { type: "reasoning", summary: [] },
      {
        type: "message",
        role: "assistant",
        content: [{ type: "output_text", text: JSON.stringify(result) }],
      },
    ],
  });
}

test("network failures and user cancellation become safe recoverable errors", async () => {
  for (const [failure, code] of [
    [new Error("private network details"), "unavailable"],
    [new DOMException("cancelled", "AbortError"), "timeout"],
  ]) {
    await assert.rejects(
      generateReply(messages, {
        apiKey: "fake",
        model: "gpt-6-luna",
        fetchImpl: async () => {
          throw failure;
        },
      }),
      (error) => error.code === code && !error.message.includes("private"),
    );
  }
});
