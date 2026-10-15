import asyncio
import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock
from quota_lifecycle import Quota, generate_with_quota


class QuotaLifecycleTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.request = {"messages": ["public portfolio question"]}
        self.store = SimpleNamespace(
            reserve=AsyncMock(return_value="reservation-id"),
            settle=AsyncMock(),
            release_or_enqueue_retry=AsyncMock(),
        )
        self.quota = Quota(self.store, lambda _: SimpleNamespace(amount=140),
                           lambda usage, _: usage)
        self.result = SimpleNamespace(answer="Public answer", usage=112)
        self.generate = AsyncMock(return_value=self.result)
        self.disconnect = AsyncMock()

    async def run_request(self):
        return await generate_with_quota(self.request, self.quota,
                                         self.generate, self.disconnect)

    async def test_success_settles_actual_usage(self):
        self.assertIs(await self.run_request(), self.result)
        self.store.reserve.assert_awaited_once_with(140)
        self.generate.assert_awaited_once_with(self.request)
        self.store.settle.assert_awaited_once_with("reservation-id", 112)
        self.store.release_or_enqueue_retry.assert_not_called()

    async def test_disconnect_before_dispatch_releases_reservation(self):
        self.disconnect.side_effect = ConnectionError("Disconnected")
        with self.assertRaises(ConnectionError):
            await self.run_request()
        self.generate.assert_not_called()
        self.store.release_or_enqueue_retry.assert_awaited_once_with(
            "reservation-id", provider_dispatched=False, actual=None)

    async def test_upstream_timeout_retains_unknown_usage(self):
        self.generate.side_effect = TimeoutError("Provider timeout")
        with self.assertRaises(TimeoutError):
            await self.run_request()
        self.store.release_or_enqueue_retry.assert_awaited_once_with(
            "reservation-id", provider_dispatched=True, actual=None)

    async def test_settlement_failure_recovers_known_usage_and_preserves_answer(self):
        self.store.settle.side_effect = RuntimeError("Store temporarily unavailable")
        self.assertIs(await self.run_request(), self.result)
        self.store.release_or_enqueue_retry.assert_awaited_once_with(
            "reservation-id", provider_dispatched=True, actual=112)

    async def test_provider_cancellation_recovers_and_propagates(self):
        self.generate.side_effect = asyncio.CancelledError()
        with self.assertRaises(asyncio.CancelledError):
            await self.run_request()
        self.store.release_or_enqueue_retry.assert_awaited_once_with(
            "reservation-id", provider_dispatched=True, actual=None)

    async def test_recovery_failure_surfaces_instead_of_disappearing(self):
        self.store.settle.side_effect = RuntimeError("Settlement failed")
        self.store.release_or_enqueue_retry.side_effect = OSError("Recovery failed")
        with self.assertRaisesRegex(OSError, "Recovery failed"):
            await self.run_request()

    async def test_context_exit_requires_an_explicit_usage_report(self):
        with self.assertRaisesRegex(RuntimeError, "actual usage"):
            async with self.quota.reserve(self.request):
                pass
        self.store.release_or_enqueue_retry.assert_awaited_once_with(
            "reservation-id", provider_dispatched=False, actual=None)


if __name__ == "__main__":
    unittest.main()
