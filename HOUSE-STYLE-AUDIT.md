# House-Style Audit

Audit date: 2026-08-28

Audited against: `rcpch/rcpch-house-style` as checked out at `3d406fa`, especially `AGENTS.md`, `agents.md`, `ci.md`, `clinical-safety.md`, `commits.md`, `dependencies.md`, `deployment.md`, `docker.md`, `licensing.md`, `new-repos.md`, `release.md`, `scripts.md`, `security.md`, and `testing.md`. The general `pacharanero/house-style` standards were used where the RCPCH overlay has no equivalent, especially `ui.md` and `repo-presentation.md`. The RCPCH standard takes precedence where they differ.

Scope: initial static audit and repository-settings inspection. No files were changed during the audit phase except this report. The subsequent remediation work on `chore/house-style-alignment` is recorded below as it is completed.

## Summary

This is a public, clinically consequential React demonstration application deployed to GitHub Pages from `live`. It has a clear root MIT licence, a committed npm lockfile, full-SHA action pins, an ignored local environment file, useful external clinical documentation, and basic branch protection. It is not currently up to the RCPCH target because its security boundary, clinical assurance, CI, licensing position, repository guidance, dependency policy, Docker setup, accessibility, and release traceability have material gaps.

The most urgent issue is architectural: the deployment injects a GitHub secret into a `VITE_*` variable and therefore publishes it in the browser bundle. The deployed key must be treated as public and rotated or deliberately reclassified as a tightly constrained public credential. That cannot be made secret in a static Pages application.

Main improvements:

- Remove secrets and OIDC authority from pull-request builds, restrict deployment permissions to the deploy job, and add blocking lint, build, audit, and Zizmor checks.
- Rotate or replace the browser-exposed API key and document the supported browser-to-API trust boundary.
- Fix four high-severity npm advisories and enforce exact direct dependency versions for this deployable application.
- Add tests for patient identity invariants, mid-parental-height lifecycle, date handling, API serialization, fixture coverage, accessibility, and responsive workflows.
- Add `SAFETY.md`, agent instructions, `SECURITY.md`, a stronger README, canonical `s/` scripts, `.editorconfig`, and `.dockerignore`.
- Resolve whether this application remains MIT or moves to the RCPCH application default of AGPL-3.0-or-later, taking account of the AGPL chart dependency and without silently relicensing existing work.
- Retain `live` as a documented exception to the RCPCH static-app `main` release model, as decided during remediation.

## Priority Findings

### P1 - A GitHub secret is published in the browser bundle

Evidence:

- `.github/workflows/deploy-react-app-gh-pages.yml:37-42` passes `VITE_APP_API_KEY` to Vite during the public Pages build.
- `src/hooks/useRcpchApi.js:5-25` reads the value in browser code and sends it as `Subscription-Key`; the source itself calls this unsafe.
- The currently deployed JavaScript was confirmed to contain a subscription-key-shaped value. The value is intentionally not reproduced here.

House style:

- `rcpch-house-style/security.md` says credentials must never be made public and compromised secrets must be rotated.
- `rcpch-house-style/principles.md` requires safety, transparency, and reliability for medical software.

Suggested change:

- Rotate or revoke the deployed key. Use a public and tightly rate-limited demo endpoint, a short-lived token exchange, or a server-side proxy. Do not use a `VITE_*` variable for any value expected to remain secret.

### P1 - Pull-request code receives secrets and unnecessary OIDC authority

Evidence:

- `.github/workflows/pr-check.yml:5-7` grants `id-token: write` to the PR workflow.
- `.github/workflows/pr-check.yml:24-32` executes repository-controlled npm lifecycle and build code with API secrets available.
- Both workflow checkouts persist GitHub credentials by default.

House style:

- `rcpch-house-style/ci.md` requires workflow-level `contents: read`, `persist-credentials: false`, and write permissions only on the smallest deployment job.

Suggested change:

- Give PR and build jobs read-only permissions, remove all secrets from PR builds, disable persisted checkout credentials, and grant Pages/OIDC write permissions only to the deploy job.

### P1 - Patient identity invariants do not span all measurement methods

Evidence:

- `src/hooks/useGlobalState.js:5-44` and `src/hooks/useRcpchApi.js:72-129` hold one current sex but separate height, weight, BMI, and OFC arrays.
- `src/components/MeasurementSegment.jsx:211-270` checks DOB, sex, and gestation only against the currently selected method.
- `src/components/MeasurementSegment.jsx:299-310` can combine all method arrays into one SDS chart using the current sex.

House style:

- `rcpch-house-style/principles.md` says medical software changes must reduce risk to patients and clinical data.
- `rcpch-house-style/testing.md` requires safety-relevant tests linked to evidence or hazards.

Suggested change:

- Introduce one patient-session invariant for DOB, sex, and gestation. Validate new measurements against all populated methods, block or explicitly reset incompatible patient changes, and test every cross-method transition before clinical use.

### P1 - Mid-parental-height state can become stale or malformed

Evidence:

- `src/components/MeasurementForm.jsx:320-343`, `src/components/MeasurementSegment.jsx:126-139`, and `src/hooks/useRcpchApi.js:258-265` use separate state shapes and do not clear the calculated output atomically.
- `src/components/subcomponents/UtilitiesForm.jsx:61-66` uses a submit button for removal.

House style:

- `rcpch-house-style/principles.md` requires reliable clinical presentation.
- `rcpch-house-style/testing.md` requires behaviour-focused tests for clinically relevant state.

Suggested change:

- Use one consistent source of truth for parental inputs and output, clear it on reset and incompatible context changes, make removal a non-submit action, and add lifecycle regression tests.

### P1 - No automated tests or required CI gate protect clinical behaviour

Evidence:

- `package.json:12-18` has no test script and the repository has no test files.
- `.github/workflows/pr-check.yml` only installs and builds; it does not lint, test, audit, run REUSE, or run Zizmor.
- GitHub branch protection for `live` has no required status checks.

House style:

- `rcpch-house-style/AGENTS.md`, `ci.md`, and `testing.md` require ESLint, TypeScript checking where applicable, the project test runner, dependency audit, and Zizmor in CI.
- `rcpch-house-style/clinical-safety.md` requires safety-relevant changes and evidence to stay linked.

Suggested change:

- Establish an initial test baseline for date validation, patient invariants, request serialization, API failures, fixture coverage, and known reviewed examples. Add browser accessibility and viewport tests. Require named CI checks on `live` once merged and stable.

### P1 - The committed npm tree contains four high-severity advisories

Evidence:

- `npm audit --package-lock-only` reported vulnerable `brace-expansion`, `image-size`, `less`, and `nanoid` packages on 2026-08-28.
- `package.json:34` directly declares vulnerable `brace-expansion` 5.0.8.
- No blocking npm audit job exists.

House style:

- `rcpch-house-style/dependencies.md` requires prompt security triage and reviewed lockfile updates.
- `rcpch-house-style/security.md` and `ci.md` require a reproducible `npm audit` workflow.

Suggested change:

- Apply reviewed dependency and lockfile updates until `npm audit --audit-level=high` passes, then enforce that command in `s/audit` and CI.

### P1 - Clinical safety scope is not anchored in this repository

Evidence:

- There is no root `SAFETY.md`.
- `src/components/MeasurementSegment.jsx:457-464` says the application is demonstration-only, while the central Digital Growth Charts documentation describes the API and associated clients/libraries as part of a registered medical-device platform.
- The application accepts DOB, sex, gestation, measurements, bone age, and diagnosis-like event text, and sends calculation inputs to a remote API.

House style:

- `rcpch-house-style/new-repos.md` and `clinical-safety.md` require `SAFETY.md` for every clinical or health-informatics repository and explicit medical-device applicability and registration status.

Suggested change:

- Add a concise root safety entry point linking the canonical intended purpose, safety case, hazard log, privacy notice, and medical-device record. The CSO/product owner must confirm whether this client is inside the warranted platform boundary and whether real patient data is permitted in the official demo.

### P1 - Repository licensing conflicts with the RCPCH application target and bundled dependency

Evidence:

- `LICENSE` and `package.json:5` declare MIT.
- `package-lock.json` records `@rcpch/digital-growth-charts-react-component-library` as AGPL-3.0-or-later.
- There are no SPDX headers or `REUSE.toml`; `reuse lint` found no file-level coverage.

House style:

- `rcpch-house-style/licensing.md` sets AGPL-3.0-or-later for applications, MIT/permissive licences for reusable libraries, and CC-BY-SA-4.0 for written and clinical content.

Suggested change:

- Obtain an explicit owner/legal decision before changing the licence. Document the combined-distribution obligations of the AGPL component, then add correct SPDX/REUSE coverage and notices. Do not silently relicense historical contributions or third-party assets.

### P1 - Docker can copy local secrets and unrelated state into image layers

Evidence:

- There is no `.dockerignore`.
- `Dockerfile:18-21` runs `npm install` and then `COPY . ./`, which can include `.env`, `.git`, local dependencies, logs, and build output.
- The container runs the Vite development server as root and has no health check.

House style:

- `rcpch-house-style/docker.md` requires a minimal context, no secrets in layers, lockfile-based installation, a non-root runtime, pinned base version, and health checks.

Suggested change:

- Add `.dockerignore`, use `npm ci`, run as the image's `node` user where practical, document this as a development container, and add a health check or smoke test.

### P2 - Repository guidance and public-project baseline files are missing

Evidence:

- There is no `agent-instructions.md`, `AGENTS.md`, `CLAUDE.md`, `SECURITY.md`, or `.editorconfig`.
- `.gitignore` lacks the standard disposable agent/browser artefact block.

House style:

- `rcpch-house-style/agents.md`, `new-repos.md`, and `security.md` require these entry points and policies.

Suggested change:

- Add concise vendor-neutral agent guidance with thin tool pointers, a private vulnerability-reporting policy, editor defaults, and ignored agent artefacts.

### P2 - Dependency policy and Dependabot coverage are incomplete

Evidence:

- `.github/dependabot.yml` configures only GitHub Actions, without routine grouping.
- `package.json:29-40` uses caret ranges for all development dependencies even though this is a deployable application.
- Source searches indicate `moment`, `semantic-ui-css`, and direct `brace-expansion` may be unused.

House style:

- `rcpch-house-style/dependencies.md` requires exact direct versions for top-level deployables.
- `rcpch-house-style/ci.md` requires npm and GitHub Actions update blocks with cooldown and routine minor/patch grouping.

Suggested change:

- Add npm Dependabot coverage, exact-pin all direct dependencies, and separately review/remove dependencies that do not solve a current problem.

### P2 - Fixture provenance and registry consistency are not enforced

Evidence:

- `src/hooks/useRcpchApi.js:146-200` bundles API-shaped fictional datasets without a source/version/licence manifest.
- `src/components/Presets.jsx:16-29` enables `malnutrition`, but no corresponding local dataset exists.

House style:

- `rcpch-house-style/licensing.md` requires third-party and dataset provenance.
- `rcpch-house-style/testing.md` recommends registry-wide contract tests.

Suggested change:

- Add a reviewed dataset registry containing source, reference, generator version, licence, review date, and checksum. Derive enabled options from it or test that every enabled option resolves.

### P2 - Accessibility and responsive layout fall below the general UI baseline

Evidence:

- `src/components/MeasurementSegment.jsx:363-452` uses fixed, non-stackable grid layouts.
- Several form controls and icon buttons lack persistent labels, accessible names, associated errors, or live announcements.
- `src/semantic-ui/site/elements/button.variables` and `button.overrides` suppress clear focus styling.
- The results table has no responsive wrapper and there is no recorded phone/tablet/desktop verification.

House style:

- General `house-style/ui.md` targets WCAG 2.2 AA, visible keyboard focus, labelled controls, complete interaction states, and rendered verification at representative viewports.

Suggested change:

- Restore visible focus, associate labels and errors, add accessible names and status announcements, stack the primary layout at phone/tablet widths, and add Playwright workflow checks at representative viewports and zoom levels.

### P2 - README, scripts, and release traceability are incomplete

Evidence:

- `README.md` is 16 lines and omits status, audience, safety/privacy boundaries, tests, contribution guidance, complete licensing, and canonical URLs.
- `s/docker-start` and `s/docker-rebuild` do not follow the standard strict-mode/root/exec/argument-forwarding shape; there is no `s/build`, `s/lint`, `s/test`, or `s/audit`.
- The UI displays version 7.0.8, but the repository has no tags, releases, or changelog.
- The default and deployment branch is `live`, while the proposed RCPCH static React release standard names `main`.

House style:

- `rcpch-house-style/new-repos.md`, `scripts.md`, `commits.md`, and `release.md` require discoverable setup and validation, conventional workflow, changelog, and release traceability.
- General `house-style/repo-presentation.md` requires a clear first screen, honest status, quick start, and real product visual where available.

Suggested change:

- Rewrite the README, add canonical scripts, and decide whether `live` remains a documented exception or the application migrates to `main`. Adopt the proposed `s/version++` and auto-tag release cascade only after that branch decision.

### P3 - Repository presentation and hygiene need minor cleanup

Evidence:

- GitHub automatic branch deletion is disabled.
- GitHub repository, package, documentation, and Pages URLs do not consistently distinguish the canonical demo from documentation.
- `text.txt` is an unexplained npm registry template and is not referenced.
- Generated Semantic UI assets are both copied during `postinstall` and tracked, leaving ownership and regeneration unclear.

House style:

- `rcpch-house-style/commits.md` and general `house-style/repo-presentation.md` favour clean branch state, clear URLs, and honest maintained repository surfaces.

Suggested change:

- Enable merged-branch deletion, choose canonical URLs, remove or explicitly rename/document `text.txt`, and choose one reviewed model for generated vendor assets.

## Compliant / Good Patterns

- Repository and directory names match and use lowercase hyphenation.
- The root MIT licence is deliberate and recognized by GitHub, although its continuing suitability needs review.
- `package-lock.json` is committed and uses integrity hashes with no Git dependency sources.
- Node 24 is consistently named in `.nvmrc`, README, Docker, and deployment.
- `.env`, dependencies, coverage, and build output are ignored; no `.env` is tracked.
- Current GitHub Actions are pinned to full commit SHAs.
- Pages build and deploy are separate jobs, and deployment names the `github-pages` environment.
- `live` blocks force pushes and deletion, requires one review, and dismisses stale approvals.
- The application delegates centile/SDS calculation to the API rather than reimplementing the clinical algorithm in React.
- The UI states that it is a demonstration and offers a semantic results table alongside charts.
- The external Digital Growth Charts documentation includes intended purpose, safety case, hazard log, medical-device, privacy, and developer material.

## Not Applicable

- Python/Django formatting, packaging, migration, database, and Azure WebApp requirements are not applicable to this static React application.
- The full `development`/`staging`/`live` service promotion model is not automatically applicable to a static frontend, but the existing use of `live` must be documented or changed consciously.
- Zensical documentation-site structure is maintained in the separate Digital Growth Charts documentation repository.
- Rust CLI, Cargo distribution, Tauri, and library-extraction standards are not applicable.

## Suggested First PR

1. Remove secrets and unnecessary permissions from PR CI, restrict Pages deployment permissions, add `persist-credentials: false`, and add blocking lint/build/audit/Zizmor jobs.
2. Fix all high-severity npm advisories and add npm Dependabot coverage with exact direct-version policy.
3. Add `.dockerignore`, canonical `s/build`, `s/lint`, and `s/audit`, agent instructions, `SECURITY.md`, `.editorconfig`, and a clearer README.
4. Add a root `SAFETY.md` that links rather than duplicates the canonical Digital Growth Charts safety file and clearly records unresolved scope decisions.

## Suggested Second PR

1. Fix cross-method patient identity and mid-parental-height lifecycle defects with independently reviewed tests.
2. Add API contract, date, fixture-registry, and reviewed clinical-vector tests, then require them in CI.
3. Address form/chart accessibility and responsive behaviour with Playwright verification.
4. Resolve licensing, fixture provenance, branch model, and release traceability through explicit owner, CSO, and licensing decisions.

## Remediation Status

- MIT is retained pending an explicit RCPCH rights and licensing review; no relicensing or SPDX/REUSE declaration has been made.
- `live` is retained and documented as the protected default/deployment branch.
- The browser value is formally treated and named as a public, constrained demo credential. The existing exposed value still requires operational rotation and API gateway review.
