# Controlled Beta Release

Prepared November 4, 2026. Not yet approved for production publication or DNS changes.

## Behavior

- Production is always controlled beta in this release. Setting SYVIC_LAUNCH_MODE=beta also enables a local/preview beta rehearsal; no environment value enables production purchases.
- Checkout and billing-portal actions redirect before reading credentials or calling Stripe. Existing live-key guard remains unchanged.
- Production pages identify the beta, do not render purchase/portal controls, and label monthly/annual subscriptions as planned.
- Accounts can save/review factual records. New accounts do not receive PDF/print export credits. Existing tester access continues under existing allowances. No entitlement changes, unlimited generation, real charges or subscriptions were introduced.
- Legal-template gates and not-a-law-firm disclosures remain. Contracts/NDAs are not added to the available catalog.
- Billing terms now reflect beta/no purchases and planned monthly/annual intervals. Privacy provider list includes Resend. This is factual product-copy alignment, not attorney review or a legal-sufficiency opinion.

## Verification

- Beta production build, TypeScript, beta mode/action guards, existing auth/billing/marketing/disclosure/mobile tests and whitespace checks passed.
- Postbuild runtime gate passed across 34 production traces; dependency audit reports zero known vulnerabilities.
- Browser beta rehearsal: pricing page has zero purchase forms/buttons; annual prices still display, and 390px viewport has no horizontal overflow. Root beta status and access limitations visible.
- Preview retains its test-billing behavior unless explicitly rehearsed in beta mode. The beta screenshot is from the local beta-mode build, not a claim that production has changed.

## Publication Gate

Obtain explicit approval before production publication/domain attachment. Public beta signup is publicly reachable, not invite-only. Inform the owner that new accounts have no export credits.

Create a production-environment build from the tested source; confirm that the production beta guard renders and auth URLs use the intended production origin. Vercel's documented preview-to-production promotion performs a rebuild with production variables; verify the actual dialog/build target before confirming. Do not assume every alias/staged promotion rebuilds.

Reference: https://vercel.com/docs/deployments/promoting-a-deployment

Add exact production auth return URLs and coordinate recovery email SiteURL before inviting testers. Keep preview callbacks. Initially test on the verified Vercel production origin, then coordinate canonical syvic.co configuration, domain ownership/DNS and HTTPS. Domain attachment and auth changes require approval; show exact GoDaddy website DNS records separately before changes. Preserve all Resend/email records.
