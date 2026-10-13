// Private CLI for aggregate allowance usage. Prints no keys, tokens or chat.
import { loadConfig } from "../server/config.mjs";
import { RedisQuota } from "../server/quota.mjs";
const config = loadConfig();
const quota = new RedisQuota({
  url: config.quotaUrl,
  token: config.quotaToken,
  dailyLimit: config.dailyLimit,
  monthlyBudgetMicros: config.monthlyBudgetMicros,
});
try {
  console.log(JSON.stringify(await quota.snapshot(), null, 2));
} catch {
  console.error(
    "Cannot read quota state. Check the Upstash REST configuration.",
  );
  process.exitCode = 1;
}
