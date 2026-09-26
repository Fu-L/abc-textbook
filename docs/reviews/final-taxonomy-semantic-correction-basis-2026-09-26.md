# Final taxonomy semantic correction review basis

Subject digest: `2f4466686f472a57c0cd74f6bdeb142d916ec67d51353e146cf6ccaea6d1e20c`

The review compares all 868 adopted Inventory solutions with the primary, home, and supporting
roles. The detailed per-problem audit is in `docs/reviews/semantic-placement-audit-2026-09-26.md`.
The accepted build before this revision is preserved under
`docs/verification/history/2026-09-26/semantic-placement-before/`.

Exactly ten placements change: ABC244 Ex, ABC308 Ex, ABC352 G, ABC355 F, ABC392 G, ABC398 E, ABC398
G, ABC422 G, ABC451 G, and ABC457 G. The proposal adds two atomic Outcomes for shortest-path-tree
branch crossings and the threshold-component MST weight formula. It retains 206 Tags, 229 Units, and
868 placements; Outcomes increase from 229 to 231.

Independent checks passed before human acceptance: TypeScript/Astro check, ESLint, Prettier, schema
parity, the unit suite, focused taxonomy contract/review/integration tests, and an in-memory
canonical materialization with zero diagnostics. The repository's five formal FinalTaxonomyReview
checks remain the acceptance gate.
