# Project Roadmap

Legend: [x] done, [~] in progress or partially done, [ ] not started

## Audit Basis

Audit date: 2026-08-28

Audited against: `rcpch/rcpch-house-style` as checked out at `3d406fa`, especially `AGENTS.md`, `agents.md`, `ci.md`, `clinical-safety.md`, `commits.md`, `dependencies.md`, `deployment.md`, `docker.md`, `licensing.md`, `new-repos.md`, `release.md`, `scripts.md`, `security.md`, and `testing.md`. The general `pacharanero/house-style` standards were used where the RCPCH overlay has no equivalent, especially `ui.md` and `repo-presentation.md`. The RCPCH standard takes precedence where they differ.

Scope: initial static audit and repository-settings inspection. No files were changed during the audit phase except the original report. Subsequent remediation work on `chore/house-style-alignment` is recorded here as it is completed.

## Context

This is a public, clinically consequential React demonstration application deployed to GitHub Pages from `live`. At the audit baseline, it had a clear root MIT licence, a committed npm lockfile, full-SHA action pins, an ignored local environment file, useful external clinical documentation, and basic branch protection. It was not up to the RCPCH target because its security boundary, clinical assurance, CI, licensing position, repository guidance, dependency policy, Docker setup, accessibility, and release traceability had material gaps.

The most urgent issue was architectural: the deployment injected a GitHub secret into a `VITE_*` variable and therefore published it in the browser bundle. The deployed key must be treated as public and rotated or deliberately reclassified as a tightly constrained public credential. It cannot be made secret in a static Pages application.

## Governing Decisions

- MIT is retained pending an explicit RCPCH rights and licensing review; no relicensing or SPDX/REUSE declaration has been made.
- `live` is retained and documented as the protected default and deployment branch.
- The browser value is formally treated and named as a public, constrained demo credential. The existing exposed value still requires operational rotation and API gateway review.
- The application remains demonstration-only and delegates centile and SDS calculations to the API rather than reimplementing clinical algorithms in React.
- Agent-generated tests are engineering evidence, not independent clinical assurance.

## Target Outcomes

- Remove secrets and OIDC authority from pull-request builds, restrict deployment permissions to the deploy job, and add blocking lint, build, audit, and Zizmor checks.
- Rotate or replace the browser-exposed API key and document the supported browser-to-API trust boundary.
- Fix four high-severity npm advisories and enforce exact direct dependency versions for this deployable application.
- Add tests for patient identity invariants, mid-parental-height lifecycle, date handling, API serialization, fixture coverage, accessibility, and responsive workflows.
- Add `SAFETY.md`, agent instructions, `SECURITY.md`, a stronger README, canonical `s/` scripts, `.editorconfig`, and `.dockerignore`.
- Resolve whether this application remains MIT or moves to the RCPCH application default of AGPL-3.0-or-later, taking account of the AGPL chart dependency and without silently relicensing existing work.
- Retain `live` as a documented exception to the RCPCH static-app `main` release model, as decided during remediation.

## Priority 1

### [~] R1 - Complete the public browser credential transition

Status: the credential has been renamed and documented as public, constrained, and rate-limited. Operational rotation or revocation and API gateway review remain outstanding.

Audit evidence:

- `.github/workflows/deploy-react-app-gh-pages.yml:37-42` passed `VITE_APP_API_KEY` to Vite during the public Pages build.
- `src/hooks/useRcpchApi.js:5-25` read the value in browser code and sent it as `Subscription-Key`; the source itself called this unsafe.
- The deployed JavaScript was confirmed to contain a subscription-key-shaped value. The value is intentionally not reproduced here.

House style:

- `rcpch-house-style/security.md` says credentials must never be made public and compromised secrets must be rotated.
- `rcpch-house-style/principles.md` requires safety, transparency, and reliability for medical software.

Remaining work:

- Rotate or revoke the deployed key.
- Confirm that the demo endpoint and key are appropriately scoped and rate-limited, or replace them with a short-lived token exchange or server-side proxy.
- Never use a `VITE_*` variable for a value expected to remain secret.

### [x] R2 - Remove secrets and unnecessary OIDC authority from pull-request code

Status: PR/build jobs now use read-only permissions, do not receive API credentials, and disable persisted checkout credentials. Pages and OIDC write permissions are restricted to deployment.

Audit evidence:

- `.github/workflows/pr-check.yml:5-7` granted `id-token: write` to the PR workflow.
- `.github/workflows/pr-check.yml:24-32` executed repository-controlled npm lifecycle and build code with API secrets available.
- Both workflow checkouts persisted GitHub credentials by default.

House style:

- `rcpch-house-style/ci.md` requires workflow-level `contents: read`, `persist-credentials: false`, and write permissions only on the smallest deployment job.

Completion criteria:

- Give PR and build jobs read-only permissions.
- Remove all secrets from PR builds.
- Disable persisted checkout credentials.
- Grant Pages and OIDC write permissions only to the deploy job.

### [~] R3 - Enforce patient identity across every measurement method

Status: one patient-session invariant and cross-method tests have been introduced. Independent clinical review and broader workflow evidence remain required before clinical use.

Audit evidence:

- `src/hooks/useGlobalState.js:5-44` and `src/hooks/useRcpchApi.js:72-129` held one current sex but separate height, weight, BMI, and OFC arrays.
- `src/components/MeasurementSegment.jsx:211-270` checked DOB, sex, and gestation only against the currently selected method.
- `src/components/MeasurementSegment.jsx:299-310` could combine all method arrays into one SDS chart using the current sex.

House style:

- `rcpch-house-style/principles.md` says medical software changes must reduce risk to patients and clinical data.
- `rcpch-house-style/testing.md` requires safety-relevant tests linked to evidence or hazards.

Remaining work:

- Independently review the patient-session implementation and test evidence.
- Confirm that incompatible changes are blocked or explicitly reset across every method and user workflow.
- Link the invariant and its evidence to the applicable safety hazard before clinical use.

### [~] R4 - Make mid-parental-height state atomic and lifecycle-safe

Status: state shapes and reset behaviour have been improved, and removal is no longer a submit action. Dedicated lifecycle regression coverage and independent review remain incomplete.

Audit evidence:

- `src/components/MeasurementForm.jsx:320-343`, `src/components/MeasurementSegment.jsx:126-139`, and `src/hooks/useRcpchApi.js:258-265` used separate state shapes and did not clear the calculated output atomically.
- `src/components/subcomponents/UtilitiesForm.jsx:61-66` used a submit button for removal.

House style:

- `rcpch-house-style/principles.md` requires reliable clinical presentation.
- `rcpch-house-style/testing.md` requires behaviour-focused tests for clinically relevant state.

Remaining work:

- Add lifecycle regression tests covering calculation, replacement, removal, reset, sex changes, reference changes, and incompatible context changes.
- Independently review the single-source-of-truth state transition.

### [~] R5 - Establish required CI gates for clinically consequential behaviour

Status: lint, unit and contract tests, production build, dependency audit, Zizmor, installed-component rendering, and Chromium workflow checks run in CI. Required status checks on protected `live` remain a repository-settings task, and the assurance suite is not comprehensive clinical evidence.

Audit evidence:

- `package.json:12-18` had no test script and the repository had no test files.
- `.github/workflows/pr-check.yml` only installed and built; it did not lint, test, audit, run REUSE, or run Zizmor.
- GitHub branch protection for `live` had no required status checks.

House style:

- `rcpch-house-style/AGENTS.md`, `ci.md`, and `testing.md` require ESLint, TypeScript checking where applicable, the project test runner, dependency audit, and Zizmor in CI.
- `rcpch-house-style/clinical-safety.md` requires safety-relevant changes and evidence to stay linked.

Remaining work:

- Require the stable named CI checks on `live` after the workflow has landed.
- Expand accessibility and representative viewport coverage.
- Add independently reviewed clinical vectors and link safety-relevant tests to evidence or hazards.

### [x] R6 - Remove high-severity npm advisories and enforce dependency auditing

Status: the reviewed dependency and lockfile updates are complete, `s/audit` is enforced in CI, and the current audit reports zero vulnerabilities.

Audit evidence:

- `npm audit --package-lock-only` reported vulnerable `brace-expansion`, `image-size`, `less`, and `nanoid` packages on 2026-08-28.
- `package.json:34` directly declared vulnerable `brace-expansion` 5.0.8.
- No blocking npm audit job existed.

House style:

- `rcpch-house-style/dependencies.md` requires prompt security triage and reviewed lockfile updates.
- `rcpch-house-style/security.md` and `ci.md` require a reproducible `npm audit` workflow.

Completion criteria:

- Apply reviewed dependency and lockfile updates until `npm audit --audit-level=high` passes.
- Enforce that command in `s/audit` and CI.

### [~] R7 - Anchor clinical safety scope in this repository

Status: root `SAFETY.md` now links to the canonical safety, intended-purpose, hazard, medical-device, privacy, and governance material. CSO or product-owner confirmation of this client's warranted platform boundary and real-patient-data policy remains outstanding.

Audit evidence:

- There was no root `SAFETY.md`.
- `src/components/MeasurementSegment.jsx:457-464` said the application was demonstration-only, while the central Digital Growth Charts documentation described the API and associated clients and libraries as part of a registered medical-device platform.
- The application accepts DOB, sex, gestation, measurements, bone age, and diagnosis-like event text, and sends calculation inputs to a remote API.

House style:

- `rcpch-house-style/new-repos.md` and `clinical-safety.md` require `SAFETY.md` for every clinical or health-informatics repository and explicit medical-device applicability and registration status.

Remaining work:

- Obtain CSO or product-owner confirmation of whether this client is inside the warranted platform boundary.
- Confirm whether real patient data is permitted in the official demo.
- Keep safety claims and canonical external records synchronized.

### [~] R8 - Resolve application and bundled-component licensing

Status: MIT is deliberately retained pending owner and legal review. No silent relicensing or unsupported SPDX/REUSE declaration has been made.

Audit evidence:

- `LICENSE` and `package.json:5` declared MIT.
- `package-lock.json` recorded `@rcpch/digital-growth-charts-react-component-library` as AGPL-3.0-or-later.
- There were no SPDX headers or `REUSE.toml`; `reuse lint` found no file-level coverage.

House style:

- `rcpch-house-style/licensing.md` sets AGPL-3.0-or-later for applications, MIT or other permissive licences for reusable libraries, and CC-BY-SA-4.0 for written and clinical content.

Remaining work:

- Obtain an explicit owner and legal decision before changing the licence.
- Document the combined-distribution obligations of the AGPL component.
- After the decision, add correct SPDX/REUSE coverage and notices without silently relicensing historical contributions or third-party assets.

### [x] R9 - Harden the development container boundary

Status: `.dockerignore`, lockfile-based installation, non-root execution, an explicit development-container purpose, and a health check have been added.

Audit evidence:

- There was no `.dockerignore`.
- `Dockerfile:18-21` ran `npm install` and then `COPY . ./`, which could include `.env`, `.git`, local dependencies, logs, and build output.
- The container ran the Vite development server as root and had no health check.

House style:

- `rcpch-house-style/docker.md` requires a minimal context, no secrets in layers, lockfile-based installation, a non-root runtime, pinned base version, and health checks.

Completion criteria:

- Add `.dockerignore`.
- Use `npm ci`.
- Run as the image's `node` user where practical.
- Document the image as a development container.
- Add a health check or smoke test.

## Priority 2

### [x] R10 - Add repository guidance and public-project baseline files

Status: vendor-neutral agent guidance, thin `AGENTS.md` and `CLAUDE.md` pointers, `SECURITY.md`, `.editorconfig`, and disposable agent and browser ignore entries are present.

Audit evidence:

- There was no `agent-instructions.md`, `AGENTS.md`, `CLAUDE.md`, `SECURITY.md`, or `.editorconfig`.
- `.gitignore` lacked the standard disposable agent and browser artefact block.

House style:

- `rcpch-house-style/agents.md`, `new-repos.md`, and `security.md` require these entry points and policies.

Completion criteria:

- Add concise vendor-neutral agent guidance with thin tool pointers.
- Add a private vulnerability-reporting policy and editor defaults.
- Ignore disposable agent and browser artefacts.

### [x] R11 - Enforce deployable-application dependency policy

Status: npm Dependabot coverage and routine grouping are configured, direct versions are exact, and unused direct dependencies identified by the audit have been removed.

Audit evidence:

- `.github/dependabot.yml` configured only GitHub Actions, without routine grouping.
- `package.json:29-40` used caret ranges for all development dependencies even though this is a deployable application.
- Source searches indicated `moment`, `semantic-ui-css`, and direct `brace-expansion` might be unused.

House style:

- `rcpch-house-style/dependencies.md` requires exact direct versions for top-level deployables.
- `rcpch-house-style/ci.md` requires npm and GitHub Actions update blocks with cooldown and routine minor/patch grouping.

Completion criteria:

- Add npm Dependabot coverage.
- Pin all direct dependencies exactly.
- Separately review and remove dependencies that do not solve a current problem.

### [~] R12 - Record fixture provenance and enforce registry consistency

Status: contract tests now validate every bundled API-shaped dataset, patient identity, ordering, and declared mid-parental-height fixture. A reviewed source, generator, licence, review-date, and checksum manifest is still missing.

Audit evidence:

- `src/hooks/useRcpchApi.js:146-200` bundled API-shaped fictional datasets without a source, version, or licence manifest.
- `src/components/Presets.jsx:16-29` enabled `malnutrition`, but no corresponding local dataset existed.

House style:

- `rcpch-house-style/licensing.md` requires third-party and dataset provenance.
- `rcpch-house-style/testing.md` recommends registry-wide contract tests.

Remaining work:

- Add a reviewed dataset registry containing source, reference, generator version, licence, review date, and checksum.
- Derive enabled options from the registry or retain a test that every enabled option resolves.
- Do not hand-edit or regenerate fixtures without provenance and review evidence.

### [~] R13 - Meet the accessibility and responsive UI baseline

Status: visible focus and responsive stacking have been improved, and Chromium checks cover the primary desktop flow and phone-width overflow. The `Measurements` tab's `Reference`, `Sex`, and `Measurement method` dropdowns now have an `aria-label`, discoverable by screen readers and by Playwright's accessible-role queries; this was found and fixed while building the `CLIENT-1` E2E scenario (`spec/e2e.md`). Comprehensive WCAG 2.2 AA review, live announcements, zoom, tablet, keyboard, and responsive-table evidence remain incomplete.

Audit evidence:

- `src/components/MeasurementSegment.jsx:363-452` used fixed, non-stackable grid layouts.
- Several form controls and icon buttons lacked persistent labels, accessible names, associated errors, or live announcements.
- `src/semantic-ui/site/elements/button.variables` and `button.overrides` suppressed clear focus styling.
- The results table had no responsive wrapper and there was no recorded phone, tablet, or desktop verification.

House style:

- General `house-style/ui.md` targets WCAG 2.2 AA, visible keyboard focus, labelled controls, complete interaction states, and rendered verification at representative viewports.

Remaining work:

- Associate labels and errors and add accessible names and status announcements throughout the form and chart workflows. The gestation-weeks and gestation-days dropdowns and icon-only buttons still lack a discoverable accessible name.
- Verify keyboard-only operation and visible focus across all interactive controls.
- Add representative phone, tablet, desktop, and zoom-level Playwright checks, including the results table.

### [~] R14 - Complete project documentation, scripts, and release traceability

Status: README and canonical scripts are substantially improved, and `live` is documented as an intentional branch-model exception. The repository still has no changelog, tags, releases, or automated release traceability.

Audit evidence:

- `README.md` was 16 lines and omitted status, audience, safety and privacy boundaries, tests, contribution guidance, complete licensing, and canonical URLs.
- `s/docker-start` and `s/docker-rebuild` did not follow the standard strict-mode, root, exec, and argument-forwarding shape; there was no `s/build`, `s/lint`, `s/test`, or `s/audit`.
- The UI displayed version 7.0.8, but the repository had no tags, releases, or changelog.
- The default and deployment branch was `live`, while the proposed RCPCH static React release standard named `main`.

House style:

- `rcpch-house-style/new-repos.md`, `scripts.md`, `commits.md`, and `release.md` require discoverable setup and validation, conventional workflow, changelog, and release traceability.
- General `house-style/repo-presentation.md` requires a clear first screen, honest status, quick start, and real product visual where available.

Remaining work:

- Add changelog and release traceability through an explicitly reviewed release process.
- Adopt the proposed `s/version++` and auto-tag release cascade only after confirming it is appropriate for the retained `live` branch model.
- Keep canonical project, package, documentation, and demo URLs clear and consistent.

## Priority 3

### [~] R15 - Finish repository presentation and generated-asset hygiene

Status: stale merged branches and the unexplained `text.txt` file have been removed. Automatic merged-branch deletion, canonical URL consistency, and generated Semantic UI asset ownership still require confirmation.

Audit evidence:

- GitHub automatic branch deletion was disabled.
- GitHub repository, package, documentation, and Pages URLs did not consistently distinguish the canonical demo from documentation.
- `text.txt` was an unexplained npm registry template and was not referenced.
- Generated Semantic UI assets were both copied during `postinstall` and tracked, leaving ownership and regeneration unclear.

House style:

- `rcpch-house-style/commits.md` and general `house-style/repo-presentation.md` favour clean branch state, clear URLs, and honest maintained repository surfaces.

Remaining work:

- Enable automatic deletion of merged branches if approved for the repository.
- Choose and consistently publish canonical repository, package, documentation, and demo URLs.
- Choose one reviewed ownership and regeneration model for generated Semantic UI assets.

## Compliant And Good Patterns

- Repository and directory names match and use lowercase hyphenation.
- The root MIT licence is deliberate and recognized by GitHub, although its continuing suitability needs review under R8.
- `package-lock.json` is committed and uses integrity hashes with no Git dependency sources.
- Node 24 is consistently named in `.nvmrc`, README, Docker, and deployment.
- `.env`, dependencies, coverage, and build output are ignored; no `.env` is tracked.
- Current GitHub Actions are pinned to full commit SHAs.
- Pages build and deploy are separate jobs, and deployment names the `github-pages` environment.
- `live` blocks force pushes and deletion, requires one review, and dismisses stale approvals.
- The application delegates centile and SDS calculation to the API rather than reimplementing the clinical algorithm in React.
- The UI states that it is a demonstration and offers a semantic results table alongside charts.
- The external Digital Growth Charts documentation includes intended purpose, safety case, hazard log, medical-device, privacy, and developer material.

## Not Applicable

- Python and Django formatting, packaging, migration, database, and Azure WebApp requirements are not applicable to this static React application.
- The full `development`, `staging`, and `live` service promotion model is not automatically applicable to a static frontend, but the existing use of `live` must remain documented or be changed consciously.
- Zensical documentation-site structure is maintained in the separate Digital Growth Charts documentation repository.
- Rust CLI, Cargo distribution, Tauri, and library-extraction standards are not applicable.

## Delivery Sequence

The original audit proposed the following first PR:

1. Remove secrets and unnecessary permissions from PR CI, restrict Pages deployment permissions, add `persist-credentials: false`, and add blocking lint, build, audit, and Zizmor jobs.
2. Fix all high-severity npm advisories and add npm Dependabot coverage with exact direct-version policy.
3. Add `.dockerignore`, canonical `s/build`, `s/lint`, and `s/audit`, agent instructions, `SECURITY.md`, `.editorconfig`, and a clearer README.
4. Add a root `SAFETY.md` that links rather than duplicates the canonical Digital Growth Charts safety file and clearly records unresolved scope decisions.

That parcel was completed in `607a667` (`chore: establish house-style compliance baseline`).

The original audit proposed the following second PR:

1. Fix cross-method patient identity and mid-parental-height lifecycle defects with independently reviewed tests.
2. Add API contract, date, fixture-registry, and reviewed clinical-vector tests, then require them in CI.
3. Address form and chart accessibility and responsive behaviour with Playwright verification.
4. Resolve licensing, fixture provenance, branch model, and release traceability through explicit owner, CSO, and licensing decisions.

Engineering portions of this parcel are partially complete in `607a667` and `e340376` (`test: add coordinated platform compatibility smoke tests`). Governance decisions, independent clinical review, fixture provenance, comprehensive accessibility evidence, and release traceability remain represented by R1, R3-R5, R7-R8, and R12-R15.
