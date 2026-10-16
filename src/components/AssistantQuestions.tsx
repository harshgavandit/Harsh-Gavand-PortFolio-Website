import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { recruiterPrompts, recruiterPromptGroups } from "../data/recruiter";

type Props = {
  onSelect: (prompt: string) => void;
  compact?: boolean;
  disabled?: boolean;
};

export function AssistantQuestions({
  onSelect,
  compact = false,
  disabled = false,
}: Props) {
  const moreRef = useRef<HTMLDetailsElement>(null);
  function choose(prompt: string) {
    if (moreRef.current) moreRef.current.open = false;
    onSelect(prompt);
  }
  const renderQuestions = (questions: typeof recruiterPrompts) => (
    <div className="assistant-suggestions">
      {questions.map((question) => (
        <button
          key={question.label}
          type="button"
          disabled={disabled}
          onClick={() => choose(question.prompt)}
        >
          <span>{question.label}</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
  const extraCount = recruiterPromptGroups.reduce(
    (total, group) => total + group.questions.length,
    0,
  );
  return (
    <section
      className="assistant-question-bank"
      aria-label="Suggested questions"
    >
      {!compact && renderQuestions(recruiterPrompts)}
      <details className="assistant-more-questions" ref={moreRef}>
        <summary>
          <span>
            {compact
              ? "Ask another question"
              : `Explore ${extraCount} more questions`}
          </span>
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        {compact && (
          <div className="assistant-question-group">
            <h4>Start here</h4>
            {renderQuestions(recruiterPrompts)}
          </div>
        )}
        {recruiterPromptGroups.map((group) => (
          <div className="assistant-question-group" key={group.title}>
            <h4>{group.title}</h4>
            {renderQuestions(group.questions)}
          </div>
        ))}
      </details>
    </section>
  );
}
