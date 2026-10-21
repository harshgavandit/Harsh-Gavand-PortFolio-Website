import { useState } from "react";
import harnessOutput from "../../public/evidence/banking-harness.json";

// Retain the existing recorded policy explorer alongside the new live-site capture.
export function BankingPolicyReplay() {
  const [scenarioId, setScenarioId] = useState(harnessOutput.scenarios[0].id);
  const scenario = harnessOutput.scenarios.find(
    (item) => item.id === scenarioId,
  )!;
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
        {scenario.steps.map((step) => (
          <li key={step.label}>
            <strong>{step.label}</strong>
            <span>{step.value}</span>
          </li>
        ))}
      </ol>
      <p role="status" className="evidence-outcome">
        {scenario.outcome}
      </p>
    </figure>
  );
}
