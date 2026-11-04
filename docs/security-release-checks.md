# Security Release Checks

Completed November 4, 2026 (America/Chicago). Focused engineering checks, not a penetration test or security certification.

## Applied Controls

- Workspace-boundary migration applied to the SYVIC Supabase project after an approved, rolled-back dry run. Existing customer records were not deleted or rewritten.
- Clients can update workspace name/type, but cannot create workspaces directly or change Stripe customer IDs. Onboarding uses ensure_my_workspace.
- Customer templates cannot declare themselves globally readable system templates.
- Properties, tenants and cases cannot move workspaces; linked property/party records must belong to the case workspace.
- Checkout and portal actions require Stripe customer organization metadata to match the authenticated workspace; missing, deleted and foreign customers fail closed.
- General case creation uses atomic onboarding rather than a service-role provisioning fallback.

## Passed Checks

- Workspace-isolation SQL fixture passed in dry run and after applying protections. Synthetic records rolled back. Covers foreign reads, case writes/deletes/inserts, billing identity, subscription changes, membership escalation, foreign links, system-template publication, document allowance, anonymous access and permitted own-record updates.
- Existing onboarding and landlord-intake database fixtures passed against the saved rules.
- Application tests deny unauthenticated/foreign packet saves, print and PDF requests; denied PDF requests consume no credit or PDF-generation work.
- TypeScript, auth, billing, case-access, landlord-intake, PDF-disclosure, marketing, mobile-wiring and whitespace checks passed. Local production build passed.
- Preview deployed successfully. Existing dashboard session, packet editor/review, PDF download, settings allowance and navigation verified. Repeat PDF download left usage at 2 of 5. Authorized test billing portal reached billing.stripe.com; no subscription settings changed and no private portal link retained.

## Dependencies

- Next.js 13.5.1 -> 15.5.29, with async route/search parameters, next/og ImageResponse and exported viewport metadata. Removed obsolete SWC fallback dependency.
- Updated schema validation/resolver, PostCSS and vulnerable transitive packages. Existing React major retained within the framework's declared peer range; build and browser checks passed.
- PostCSS override ensures Next does not retain its old nested copy.
- Initial scan had 19 moderate findings. Follow-up on November 4: full audit and runtime-only audit both report 0 known vulnerabilities. Refreshed advisory data narrowed the minimatch affected range; available transitive updates fixed the glob chain, and a targeted typescript-estree override to minimatch 11.0.1 fixed its remaining chain. Older CommonJS matcher users were not forced onto an incompatible API. No obsolete dependency downgrade was used.
- Build/lint/type/style packages are now development dependencies. The full audit includes these packages; the zero count is not obtained by omitting development tools.
- New postbuild gate checks app imports and all 34 generated production dependency traces for build-only packages. Matcher API/file-pattern and TypeScript parser smoke tests pass. This bounds the checks performed; a clear dependency audit is not proof that all application security issues are absent.
- Official release: https://nextjs.org/blog/november-2026-security-release

## Remaining Gates

1. Dependency findings and build dependency isolation checks completed for this release. Continue checking advisories before future releases.
2. Recheck real phone behavior and signup/recovery after the framework upgrade; prior user acceptance predates it.
3. Prepare exact production environment, auth Site URL/callbacks, email and webhook configuration, preserving test/live separation.
4. Obtain approval for production deployment and exact website DNS changes; preserve email DNS records.
5. Live billing remains blocked in code. Contract/NDA templates remain planned, not available.

No DNS changes, production-code promotion, live payments or existing-customer record deletion in this pass. Supabase rules did change with approval; the shared database is not a separate preview database.
