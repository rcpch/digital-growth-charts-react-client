# Roadmap

This roadmap tracks remaining product, safety, governance, and assurance work for the React Demo Client. Completed items are removed; their implementation history remains available in Git and merged pull requests.

## Standing Decisions

- The application is demonstration-only and delegates centile and SDS calculations to the API rather than implementing clinical algorithms in React.
- Original Demo Client code remains MIT to support broad downstream integration and modification. The bundled Chart Component remains AGPL-3.0-or-later and retains its source-availability and share-alike terms.
- `live` remains the protected default and deployment branch.
- Browser-visible credentials are public, constrained demo credentials. A `VITE_*` value must never be treated as secret.
- Client, Chart Component, API, and calculation-engine versions are independent. Similar version numbers do not imply compatibility.
- Agent-generated tests are engineering evidence, not independent clinical assurance.

## Priority 1 - Safety And Security

- [ ] **R1 - Complete the public browser credential transition.** The credential is named and documented as public, constrained, and rate-limited. Rotate or revoke the previously exposed value, confirm the demo endpoint and key are appropriately scoped and rate-limited, and complete the API gateway review. Replace the design with a short-lived token exchange or server-side proxy if the value is expected to be confidential.

- [ ] **R3 - Complete independent review of the patient-session identity invariant.** Cross-method checks now prevent obvious mixing of date of birth, sex, and gestation between height, weight, BMI, and OFC measurements. Independently review the implementation and workflow evidence, confirm incompatible changes are blocked or explicitly reset everywhere, and link the invariant to the applicable safety hazard before clinical use.

- [ ] **R4 - Complete mid-parental-height lifecycle assurance.** State shape and reset behaviour have been improved, but dedicated regression coverage and independent review remain incomplete. Cover calculation, replacement, removal, reset, sex changes, reference changes, and incompatible context changes, then independently review the single-source-of-truth transition.

- [ ] **R5 - Complete clinically consequential CI assurance.** CI runs lint, unit and contract tests, production build, dependency audit, Zizmor, installed-component rendering, and Chromium workflows. Require the stable named checks on protected `live`, expand accessibility and representative viewport coverage, and add independently reviewed clinical vectors linked to evidence or hazards.

- [ ] **R7 - Confirm the Client's clinical-safety boundary.** Obtain Clinical Safety Officer or product-owner confirmation of whether this Client is inside the warranted platform boundary and whether real patient data is ever permitted in an official deployment. Keep the root safety statement and canonical external records synchronized.

## Priority 2 - Data, Licensing, And Accessibility

- [ ] **R8 - Complete licence and provenance coverage.** The deliberate MIT licence for original Client code and the AGPL boundary around the Chart Component are documented. Confirm copyright and licence coverage for historical contributions, written and clinical content, generated example scenarios, and third-party assets, then add accurate SPDX/REUSE coverage and third-party notices without relicensing Component or third-party material.

- [ ] **R12 - Complete example-scenario provenance and registry consistency.** The 26 `uk-who`, `cdc`, and `trisomy-21` example datasets are regenerated from a committed scenario manifest through the real API and are contract-tested. Add licence and checksum fields, derive enabled presets from the registry or retain equivalent completeness coverage, resolve the deliberately disabled malnutrition scenario, and obtain clinical review of the scenario parameters before treating them as authoritative teaching examples.

- [ ] **R13 - Meet the WCAG 2.2 AA and responsive baseline.** Visible focus, responsive stacking, primary desktop flow, phone-width overflow, and accessible names for the main selectors have initial coverage. Complete labels, errors, names, and live status announcements throughout the form and chart workflows; verify keyboard-only operation and visible focus; and add phone, tablet, desktop, zoom, and responsive-results-table evidence.

- [ ] **R16 - Resolve bundled mid-parental-height coordinate responses.** Eight active `mid-parental-height.json` example responses contain 6,504 UK-WHO plotting points and add about 1.45 MB of first-party data to the production bundle. Unlike the example measurement datasets, they have no manifest inputs, provenance record, checksum, review date, or regeneration path. Either remove these optional preset overlays or bring them under the same reproducible generation, provenance, licensing, contract-test, and independent-review controls as the other example scenarios.

## Priority 3 - Release Evidence

- [ ] **R14 - Complete the first managed Client release.** Independent Client Semantic Versioning, changelog generation, immutable build identity, the protected-branch `s/version++` flow, and merge-triggered tag and GitHub Release automation are implemented. Cut the agreed first managed release, `v7.1.0`, through the reviewed release flow and record Client, Chart Component, API, and calculation-engine versions independently in the compatibility evidence.
