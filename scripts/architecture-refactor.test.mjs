import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { experience } from "../src/data/portfolio.ts";
import { experienceForDisplay } from "../src/data/experiencePresentation.ts";
import { chapters, curatedArchive } from "../src/data/recruiter.ts";
import { resumeStackGroups } from "../src/data/heroStack.ts";
import * as work from "../src/data/workPresentation.ts";

test("recruiter navigation follows the requested six-section review path", () => {
  assert.deepEqual(
    chapters.map((item) => item.id),
    ["hero", "experience", "projects", "skills", "about", "contact"],
  );
});

test("experience has one shared high-signal record per employer with bounded evidenced tools", () => {
  assert.deepEqual(experienceForDisplay, experience);
  assert.equal(experience[0].points.length, 5);
  assert.equal(experience[1].points.length, 4);
  assert.deepEqual(experience[0].tech, [
    "Next.js",
    "React",
    "Python",
    "Flask",
    "SQLAlchemy",
    "LangChain",
    "LangGraph",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Docker",
    "Grafana",
    "k6",
    "CI/CD",
  ]);
  assert.deepEqual(experience[1].tech, [
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Express",
    "SQL",
    "REST APIs",
    "Authentication",
    "Git",
    "Docker",
  ]);
  assert.doesNotMatch(
    JSON.stringify(experience),
    /seamless|enhance system intelligence|10\+ pages|20\+ frontend/,
  );
});

test("primary production case studies lead and eight curated rows do not duplicate any homepage card", () => {
  assert.deepEqual(
    work.primaryFeaturedStudies?.map((item) => item.projectId),
    [39, 14, 40, 33, 3],
  );
  assert.deepEqual(
    work.featuredStudies.slice(0, 2).map((item) => item.projectId),
    [39, 14],
  );
  assert.equal(work.featuredStudies.length, 16);
  assert.equal(curatedArchive.length, 8);
  assert.equal(new Set(curatedArchive.map((item) => item.projectId)).size, 8);
  assert.ok(curatedArchive.some((item) => item.projectId === 1));
  for (const item of curatedArchive)
    assert.ok(
      !work.featuredStudies.some((study) => study.projectId === item.projectId),
    );
});

test("condensed stack omits unsupported or peripheral labels and retains evidenced realtime and ML", () => {
  const names = resumeStackGroups.flatMap((group) =>
    group.items.map((item) => item.name),
  );
  for (const removed of [
    "Kafka",
    "DynamoDB",
    "Cursor",
    "Codex",
    "Claude Code",
    "Antigravity",
    "MinMax Scaling",
    "Moving Average Analysis",
    "yfinance",
    "Matplotlib",
  ])
    assert.ok(!names.includes(removed), removed);
  for (const required of [
    "WebRTC",
    "Google ADK",
    "TensorFlow",
    "OpenAI APIs",
    "LangChain",
    "LangGraph",
    "RAG",
    "Embeddings",
    "Vector Databases",
  ])
    assert.ok(names.includes(required), required);
  assert.ok(names.length <= 48, names.length);
});

test("hero and contact have the requested positioning with direct recruiter actions", () => {
  const hero = readFileSync(
    new URL("../src/components/Hero.tsx", import.meta.url),
    "utf8",
  );
  assert.match(hero, /Building Reliable Full-Stack Applications,/);
  assert.match(hero, /Backend APIs &amp; Production AI Workflows\./);
  const contact = readFileSync(
    new URL("../src/components/Contact.tsx", import.meta.url),
    "utf8",
  );
  assert.match(contact, /© \{year\} Harsh Gavand\. All rights reserved\./);
  assert.doesNotMatch(contact, /new FormData|Prepare email draft|<form/);
  assert.match(contact, /Copy Email/);
});

test("removed field notes and duplicate footer navigation stay unmounted", () => {
  const portfolio = readFileSync(
    new URL("../src/Portfolio.tsx", import.meta.url),
    "utf8",
  );
  const contact = readFileSync(
    new URL("../src/components/Contact.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(portfolio, /EngineeringFieldNotes/);
  assert.doesNotMatch(contact, /footer-nav|Footer navigation/);
});
