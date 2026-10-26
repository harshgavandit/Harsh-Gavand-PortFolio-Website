import { open, readFile, unlink } from "node:fs/promises";

// This operator-side ledger bounds one explicitly approved evaluation. It is
// deliberately separate from the public application's visitor allowance.
export class EvaluationBudget {
  constructor(path, header) {
    this.path = path;
    this.header = header;
  }

  static async create(path, header) {
    if (
      !Number.isSafeInteger(header.maxAttempts) ||
      header.maxAttempts < 1 ||
      header.maxAttempts > 48 ||
      header.maxOutputTokens !== 1000 ||
      !/^[a-f0-9]{64}$/.test(header.runtimeDigest) ||
      !/^[a-f0-9]{64}$/.test(header.sourceSnapshot)
    )
      throw new Error("Invalid evaluation request allowance.");
    const value = { version: 1, ...header };
    const file = await open(path, "wx", 0o600);
    try {
      await file.writeFile(JSON.stringify(value) + "\n");
      await file.sync();
    } finally {
      await file.close();
    }
    return new EvaluationBudget(path, value);
  }

  async reserve({ id, repetition, maxOutputTokens }) {
    if (
      typeof id !== "string" ||
      !/^[a-z0-9-]+$/.test(id) ||
      !Number.isSafeInteger(repetition) ||
      repetition < 1 ||
      repetition > 3 ||
      maxOutputTokens !== this.header.maxOutputTokens
    )
      throw new Error("Request does not match the approved allowance.");
    // Exclusive lock prevents two processes from spending the same last slot.
    // A stale lock fails closed rather than guessing whether a call completed.
    const lockPath = this.path + ".lock";
    const lock = await open(lockPath, "wx", 0o600);
    try {
      const raw = await readFile(this.path, "utf8");
      if (!raw.endsWith("\n")) throw new Error("Incomplete evaluation ledger.");
      const [header, ...attempts] = raw.trimEnd().split("\n").map(JSON.parse);
      if (JSON.stringify(header) !== JSON.stringify(this.header))
        throw new Error("Evaluation allowance changed.");
      if (attempts.length >= header.maxAttempts)
        throw new Error("Approved evaluation request allowance exhausted.");
      if (
        attempts.some(
          (row, index) =>
            row.attempt !== index + 1 ||
            !/^[a-z0-9-]+$/.test(row.id) ||
            !Number.isSafeInteger(row.repetition) ||
            row.maxOutputTokens !== header.maxOutputTokens,
        )
      )
        throw new Error("Invalid evaluation ledger entries.");
      if (
        attempts.some((row) => row.id === id && row.repetition === repetition)
      )
        throw new Error("Evaluation retries require a new explicit allowance.");
      const reservation = {
        attempt: attempts.length + 1,
        id,
        repetition,
        maxOutputTokens,
        reservedAt: new Date().toISOString(),
      };
      const ledger = await open(this.path, "a");
      try {
        await ledger.writeFile(JSON.stringify(reservation) + "\n");
        await ledger.sync();
      } finally {
        await ledger.close();
      }
      // Reservation persists before the HTTP request; failed/unknown requests
      // never refund a slot and are never retried automatically.
      return reservation;
    } finally {
      await lock.close();
      await unlink(lockPath);
    }
  }
}
