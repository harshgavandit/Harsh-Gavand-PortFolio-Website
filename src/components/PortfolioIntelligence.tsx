import { useState } from "react";
import {
  ArrowUpRight,
  ArrowUp,
  BookOpen,
  Braces,
  Sparkles,
} from "lucide-react";
import { openPortfolioAssistant } from "../lib/portfolioActions";

const prompts = [
  [
    "Find relevant projects",
    "Which of Harsh's projects demonstrate full-stack and AI engineering? Include source links.",
  ],
  [
    "Inspect the architecture",
    "Explain the AI News-to-Email Digest architecture using Harsh's published implementation notes.",
  ],
  [
    "Understand the experience",
    "Summarize Harsh's professional roles and the technologies he used. Distinguish completed positions from current employment.",
  ],
];
export function PortfolioIntelligence() {
  const [question, setQuestion] = useState("");
  return (
    <section
      id="intelligence"
      className="intelligence-section section-container"
      aria-labelledby="intelligence-title"
      tabIndex={-1}
    >
      <div className="intelligence-copy">
        <span className="lab-micro">
          <Sparkles size={14} /> 07 / PORTFOLIO INTELLIGENCE
        </span>
        <h2 id="intelligence-title">
          The work has context.
          <br />
          <span>Ask for it.</span>
        </h2>
        <p>
          A conversational guide to my projects, skills, and experience. Ask a
          technical question or explore how my work fits your team.
        </p>
        <div className="intelligence-prompts">
          {prompts.map(([label, prompt]) => (
            <button key={label} onClick={() => openPortfolioAssistant(prompt)}>
              {label}
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
      </div>
      <div className="intelligence-console">
        <div className="intelligence-console-top">
          <span>
            <Sparkles size={15} /> Ask the portfolio
          </span>
          <span>CONTEXT → ANSWER</span>
        </div>
        <div className="intelligence-pipeline">
          <span>
            <BookOpen size={20} />
            Published work
          </span>
          <i />
          <span>
            <Braces size={20} />
            Relevant context
          </span>
          <i />
          <span>
            <Sparkles size={20} />
            GPT-6 Luna
          </span>
        </div>
        <h3>Curiosity is a good starting point.</h3>
        <p>
          Project-specific answers, grounded in published notes and linked to
          the work. Verify important details with the source or with me.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            openPortfolioAssistant(question);
          }}
        >
          <label className="sr-only" htmlFor="intelligence-question">
            Question for the portfolio assistant
          </label>
          <input
            id="intelligence-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={2000}
            placeholder="How did you build the AI digest?"
          />
          <button aria-label="Open question in assistant">
            <ArrowUp size={18} />
          </button>
        </form>
        <small>Powered by GPT-6 Luna · review and send in the assistant</small>
      </div>
    </section>
  );
}
