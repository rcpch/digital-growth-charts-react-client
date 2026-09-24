# Open Queries

Questions that need a human decision rather than more engineering. See `spec/roadmap.md` for the house-style remediation status and `spec/e2e.md` for the E2E harness these often surfaced from.

## Example scenarios

- **Clinical review of `src/example-scenarios/scenario-manifest.json`.** Regenerated via `s/regenerate-example-scenarios` against a real API (`rcpchgrowth` v4.6.2, API server v5.0.0), so every bundled dataset now carries real provenance. The manifest's per-condition parameters (age range, starting SDS) were inferred by reading the age/SDS range out of the previous frozen data, not authored from clinical knowledge, and `drift` is disabled everywhere rather than guessed at from an undocumented API parameter. Someone clinically familiar with these conditions should review whether the flat-SDS trajectories still tell the right teaching story (R12), particularly `growth-hormone-deficiency`, `faltering-growth`, and `prematurity`, which showed a clear trend in the original frozen data that regeneration has flattened.
- **`malnutrition` preset.** `Presets.jsx` lists it as `disabled: true` with no corresponding dataset. Should it be added to the manifest and generated, or removed from the preset list until it is?
- **Licence and review-date fields for the manifest.** `scenario-manifest.json` currently records generation parameters only, not licence or review-date. Worth adding once the clinical review above happens, so both land together.

## Governance decisions carried from the house-style audit

- **R1 - Browser demo credential.** The team accepts that the key is necessarily public, has implemented some usage limiting, and monitors use. Operational follow-up remains: decide who owns rotation/revocation and whether the API gateway should add an Azure APIM origin policy for the official demo domain, recognising that origin checks are an additional abuse control rather than secret authentication.
- **R3 - Patient-identity invariant.** Manual testing is planned. Record the results, obtain the required independent clinical/engineering review of the cross-method session invariant, and link the applicable hazard record before treating it as safety evidence.

- **R7 - Clinical safety boundary.** Needs CSO or product-owner confirmation of whether this Demo Client sits inside the warranted Digital Growth Charts platform boundary, and explicit confirmation that real patient data is never permitted in the public demo (matches existing practice, but isn't yet an owner-confirmed policy).

## Cross-repository

- **Component-library dev/prod parity** (`digital-growth-charts-react-component-library#230`): local dev mode aliases to raw source and bypasses the Rollup `versionInjector()` transform. Awaiting `@eatyourpeas`/`@mbarton` review of the proposed fix (run the real Rollup build in watch mode instead).
- **API server mid-parental-height bug** (`digital-growth-charts-server#289`): fixed on `fix/raise-not-return-http-exception`, not yet on `live`. When should that fix land on `live`?
- **Repository coordination.** Cross-repository work is proving costly. Define and review a consolidation proposal before moving code, including whether the Python package, API, and documentation should share one repository, which release boundaries remain independent, and how history, CI, ownership, deployment, and safety evidence would migrate.
