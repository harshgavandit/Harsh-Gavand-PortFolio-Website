import { experience } from "./portfolio.ts";

const globetrekHighlights = {
  points: [
    "Full-stack product delivery: Building, shipping, and maintaining full-stack web apps with Node.js, TypeScript, and React, owning features from data models and REST APIs to interfaces and Docker/AWS (EC2, S3) deployment with CI/CD, monitoring, and logging.",
    "Production Node.js services: Wrote production-ready Node.js, TypeScript, and JavaScript — REST APIs, background jobs and queues (BullMQ, AWS SQS), Redis, email/WhatsApp notifications, and Razorpay payment flows.",
    "Relational database design: Designing and optimizing relational database schemas; writing efficient, reusable SQL queries to support features and reporting pipelines.",
    "Product collaboration & ownership: Working closely with product and design in a small team to turn requirements into shipped features, taking ownership of technical decisions while keeping codebases maintainable and scalable.",
    "Code reviews & standards: Conducting code reviews and enforcing coding standards across shared repositories.",
  ],
  tech: [
    "Node.js",
    "TypeScript",
    "Background Jobs",
    "BullMQ",
    "AWS SQS",
    "Redis",
    "AWS",
    "EC2",
    "S3",
    "Email Notifications",
    "WhatsApp Notifications",
    "Razorpay",
    "Relational Data Modeling",
    "Code Reviews",
  ],
};

export const experienceForDisplay = experience.map((job) =>
  job.company === "Globetrek Engineering Corporation"
    ? {
        ...job,
        points: [...job.points, ...globetrekHighlights.points],
        tech: [...new Set([...job.tech, ...globetrekHighlights.tech])],
      }
    : job,
);
