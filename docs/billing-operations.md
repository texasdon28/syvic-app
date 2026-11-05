# Checkout Recovery

Checkout creation is serialized per workspace by `billing_checkout_locks`.
Only the server service role can acquire or release a lock. Ordinary success
and failure release it in a `finally` block. An interrupted process can leave
a lock behind; locks do not expire automatically because a stalled request
could otherwise create a second subscription after another request took over.

If a workspace repeatedly sees the checkout-in-progress message:

1. Confirm the original request has terminated in hosting logs. Never unlock a
   request that might still perform Stripe mutations.
2. Look up the workspace's Stripe customer in the correct test or live mode.
3. Reconcile existing subscriptions and all open subscription checkout sessions.
   Confirm no unresolved payment or checkout completion is still in progress.
4. Inspect the lock's organization, token, and acquisition time using an
   authorized operator connection. Release only that exact token using
   `release_billing_checkout_lock`, not a broad table deletion.
5. Retry checkout. Existing subscriptions should return to Settings; otherwise
   reuse one matching open session and expire competing sessions.

Do not schedule automatic lock deletion. Never expose service-role credentials
or lock-management functions to the browser.

Verification: `node scripts/test-billing.cjs` tests exclusion and cleanup.
Run `supabase/tests/checkout_serialization.sql` after the migration to verify
database exclusion, token ownership, and execution permissions. Its fixtures
are rolled back. It is not a multi-connection load test.
