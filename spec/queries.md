# Open Queries

Questions that need a human decision rather than more engineering. See `spec/roadmap.md` for the house-style remediation status and `spec/e2e.md` for the E2E harness these often surfaced from.

## Example scenarios

- **Hand-curated teaching scenarios; provenance retained for reference-matching (R12).** The bundled `src/example-scenarios/**/data.json` datasets are hand-curated teaching scenarios, not API-regenerated data. The original datasets were produced by the API and then hand-edited to depict pathological growth patterns the fictional-child-data generator cannot reproduce: `coeliac-disease` (falter then recover after gluten-free diet), `growth-hormone-deficiency` (slow growth then catch-up following GH), `pubertal-delay` (slow growth with late catch-up), plus monotonic-trend scenarios (`faltering-growth`, `prematurity`, `obesity`, `macrocephaly`, `microcephaly`) that regeneration with `drift: false` flattened. A 2026-09 audit found 20 of 26 scenarios had been flattened by the `844fd85` regeneration, not just the three originally noted. The hand-curated data has been restored and a `provenance` block injected per measurement. Per the maintainers' decision, the provenance is pragmatic rather than exact: its primary purpose is to ensure `growth_reference` matches the request so data is not plotted on the wrong chart, and the calculation-engine/version fields reflect the API that originally produced the underlying values, not the subsequent hand-edits. Every manifest entry is marked `"regeneratable": false`; `tools/regenerate-example-scenarios.mjs` refuses to overwrite them unless `--force` is passed, to prevent silently re-flattening the trajectories. recorded provenance and review evidence. The manifest parameters are retained as a historical record of the approximate inputs; clinical review of the trajectories is still wanted before treating them as authoritative teaching examples. See `spec/roadmap.md` R12.
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
