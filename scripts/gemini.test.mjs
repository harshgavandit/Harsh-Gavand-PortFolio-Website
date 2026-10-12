import assert from "node:assert/strict";
import { test } from "node:test";
import { generateReply, knowledgeFor, sourceLinks } from "../server/gemini.mjs";

const messages = [
  { role: "user", content: "Tell me about the AI News-to-Email Digest." },
];
test("retrieval includes the relevant project and complete public project index", () => {
  const knowledge = knowledgeFor(messages);
  assert.equal(knowledge.projectIndex.length, 26);
  assert.ok(knowledge.projectDetails.some((p) => p.id === 17));
  assert.ok(!JSON.stringify(knowledge).includes("GEMINI_API_KEY"));
});
test("Gemini request uses server headers, trusted context and multi-turn role mapping", async () => {
  const result = await generateReply(
    [
      ...messages,
      { role: "assistant", content: "A digest pipeline." },
      { role: "user", content: "What is the stack?" },
    ],
    {
      apiKey: "fake-secret",
      model: "gemini-test",
      fetchImpl: async (url, options) => {
        assert.ok(!url.includes("fake-secret"));
        assert.equal(options.headers["x-goog-api-key"], "fake-secret");
        const request = JSON.parse(options.body);
        assert.deepEqual(
          request.contents.map((c) => c.role),
          ["user", "model", "user"],
        );
        assert.match(request.systemInstruction.parts[0].text, /Never invent/);
        assert.ok(!options.body.includes("fake-secret"));
        assert.equal(
          request.generationConfig.responseMimeType,
          "application/json",
        );
        return Response.json({
          candidates: [
            {
              finishReason: "STOP",
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      answer: "Python and SQLAlchemy.",
                      projectIds: [17],
                      sections: [],
                    }),
                  },
                ],
              },
            },
          ],
        });
      },
    },
  );
  assert.equal(result.answer, "Python and SQLAlchemy.");
});
for (const [status, code] of [
  [429, "quota"],
  [403, "configuration"],
  [404, "configuration"],
  [500, "unavailable"],
]) {
  test(`upstream ${status} becomes a safe ${code} error`, async () => {
    await assert.rejects(
      generateReply(messages, {
        apiKey: "fake",
        model: "gemini-test",
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
      model: "gemini-test",
      fetchImpl: async () => {
        throw new DOMException("timeout", "TimeoutError");
      },
    }),
    (error) => error.code === "timeout",
  );
  for (const body of [
    { candidates: [] },
    {
      candidates: [
        { finishReason: "MAX_TOKENS", content: { parts: [{ text: "{}" }] } },
      ],
    },
    {
      candidates: [
        { finishReason: "STOP", content: { parts: [{ text: "not json" }] } },
      ],
    },
  ]) {
    await assert.rejects(
      generateReply(messages, {
        apiKey: "fake",
        model: "gemini-test",
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
