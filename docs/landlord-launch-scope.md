# Landlord Records Release

Source check: November 1, 2026. This is a product implementation note, not legal approval.

## Catalog And Credits

Three available record types (rent ledger, chronology, evidence index) share the existing factual packet. Preparing a new saved version for export or print consumes one document credit. Intake and official resource links consume none. Three proposed legal documents are visible but have no generation endpoint: pay-rent-or-vacate notice, notice to vacate, eviction petition.

## Journey

Documents -> four-step Harris County residential intake -> draft case with a read-only intake summary -> packet editor -> review -> PDF. Property, tenant, and case save in one database transaction. A stable request UUID prevents a lost response/retry from producing duplicate cases. A failed transaction rolls back linked records. Existing general and small-claims case creation is retained.

The intake records facts and unknown answers. It does not select notice language, compute waiting periods, determine eligibility or venue, assert delivery, swear an affidavit, submit a filing, or make a legal recommendation. Legal-review catalog entries cannot be selected as the source of this factual-record intake. Supporting files remain separate from the evidence index.

## Sources

- https://www.jp.hctx.net/evictions/default.htm (county update warning and current petition link)
- https://www.jp.hctx.net/info/Petition%20for%20Eviction.pdf (2026 form; linked externally, not reproduced or populated)
- https://www.txcourts.gov/rules-forms/rules-standards/ (current rules index, checked rather than relying on the county's preliminary January PDF)
- https://www.tjctc.org/srl/eviction-plaintiff.html (plaintiff resources and federal-protections caution)

The older county filing page was not used as a current procedural rules source. No numerical legal deadlines are embedded in this release.

## Activation Gate For Legal Documents

Texas counsel must approve the supported fact patterns, notice selection, lease and federal/subsidy protections, bankruptcy/military issues, delivery/timing rules, court-form mapping, required declarations/signatures, source maintenance, and service/business disclosures before legal generation is enabled. Do not change catalog status alone to bypass this gate.

## Tests

`node scripts/test-landlord-intake.cjs` covers input validation and legal-review selection gates. `supabase/tests/landlord_intake.sql` exercises authenticated RLS, ownership, request retries, atomic failure, scope checks, and no-credit-on-save in a rolled-back transaction. It does not establish legal sufficiency of any document.
