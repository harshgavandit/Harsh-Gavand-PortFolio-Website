import { useState } from "react";
import harnessOutput from "../../public/evidence/banking-harness.json";

// Narration is editorial copy; recorded tool results stay unchanged.
const scenarioCopy: Record<string, { steps: string[]; outcome: string }> = {
  success: {
    steps: ["Stage transfer", "Confirm in a later turn", "Repeat confirmation"],
    outcome:
      "The recorded ledger balance changes from 200000 to 199000 only after separate confirmation. A repeated confirmation returns NO_PENDING_TRANSFER.",
  },
  rejected: {
    steps: ["Validate blocked beneficiary", "Inspect balance after rejection"],
    outcome:
      "Beneficiary policy rejects the request before execution. The recorded ledger balance remains 200000.",
  },
  "confirmation-required": {
    steps: [
      "Stage transfer",
      "Attempt confirmation in the original invocation",
      "Attempt confirmation from another session",
    ],
    outcome:
      "The initiating invocation cannot approve its own proposal, and another session cannot access the staged transfer. Ledger state remains unchanged.",
  },
};

// Retain the existing recorded policy explorer alongside the new live-site capture.
export function BankingPolicyReplay() {
  const [scenarioId, setScenarioId] = useState(harnessOutput.scenarios[0].id);
  const scenario = harnessOutput.scenarios.find(
    (item) => item.id === scenarioId,
  )!;
  const narration = scenarioCopy[scenario.id];
  return (
    <figure className="harness-evidence">
      <figcaption>
        Recorded policy scenarios{" "}
        <span>Confirmation, validation &amp; ledger state</span>
      </figcaption>
      <div
        role="group"
        aria-label="Banking harness scenario"
        className="evidence-controls"
      >
        {harnessOutput.scenarios.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === scenarioId}
            onClick={() => setScenarioId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ol className="harness-steps">
        {scenario.steps.map((step, index) => (
          <li key={step.label}>
            <strong>{narration.steps[index]}</strong>
            <span>{step.value}</span>
          </li>
        ))}
      </ol>
      <p role="status" className="evidence-outcome">
        {narration.outcome}
      </p>
    </figure>
  );
}
