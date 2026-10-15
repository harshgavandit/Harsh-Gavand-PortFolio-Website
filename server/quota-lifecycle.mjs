import { reservationFor, usageCost } from "./quota.mjs";

export async function generateWithQuota({ request, quota, signal, generate }) {
  signal.throwIfAborted();
  const estimate = reservationFor(request);
  const reservation = await quota.reserve(estimate.amount);
  let providerDispatched = false;
  let actual;
  let result;
  try {
    signal.throwIfAborted();
    providerDispatched = true;
    result = await generate(request, { signal });
    actual = usageCost(result.usage, estimate);
    await quota.settle(reservation, actual);
  } catch (error) {
    await quota.releaseOrEnqueueRetry(reservation, {
      providerDispatched,
      actual,
    });
    if (actual === undefined) throw error;
  }
  return result;
}
