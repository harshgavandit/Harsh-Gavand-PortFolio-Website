"""Illustrative FastAPI-compatible port; the deployed portfolio API uses Node.js.

Inject a provider coroutine and a disconnect check based on Request.is_disconnected.
The hosting handler must cancel this task on a post-dispatch disconnect, and the
provider coroutine must propagate cancellation rather than hiding it.
Store operations must implement the same atomic/idempotent contract as the Node
quota store; this example does not introduce a second production backend.
"""
import asyncio
from contextlib import asynccontextmanager
from dataclasses import dataclass
from typing import Any


@dataclass
class Reservation:
    store: Any
    handle: Any
    estimate: Any
    usage_cost: Any
    dispatched: bool = False
    actual: Any = None

    def mark_dispatched(self):
        self.dispatched = True

    async def settle(self, usage):
        self.actual = self.usage_cost(usage, self.estimate)
        await self.store.settle(self.handle, self.actual)


class Quota:
    def __init__(self, store, estimate_for, usage_cost):
        self.store = store
        self.estimate_for = estimate_for
        self.usage_cost = usage_cost

    @asynccontextmanager
    async def reserve(self, request):
        estimate = self.estimate_for(request)
        handle = await self.store.reserve(estimate.amount)
        reservation = Reservation(self.store, handle, estimate, self.usage_cost)
        try:
            yield reservation
            if reservation.actual is None:
                raise RuntimeError("A completed request must report actual usage")
        except BaseException as error:
            await asyncio.shield(self.store.release_or_enqueue_retry(
                handle,
                provider_dispatched=reservation.dispatched,
                actual=reservation.actual,
            ))
            # Cancellation must propagate; unknown provider usage stays reserved.
            if not isinstance(error, Exception) or reservation.actual is None:
                raise


async def generate_with_quota(request, quota, generate, check_disconnect):
    async with quota.reserve(request) as reservation:
        await check_disconnect()
        reservation.mark_dispatched()
        result = await generate(request)
        await reservation.settle(result.usage)
    return result
