# End-to-End Compatibility Harness

Status: draft requirements and roadmap

## Purpose

The End-to-End Compatibility Harness will verify that selected versions of the RCPCH Digital Growth Charts calculation engine, API server, React Chart Component, and Demo Client interoperate using real API responses and real browser interactions. It will live in the Demo Client repository because that repository is the first place where all runtime layers meet, but it must remain able to test a Demo Client version other than the checkout containing the harness controller.

The harness is engineering and clinical-safety evidence for coordinated platform changes. It does not independently prove that a centile or SDS is clinically correct, replace the calculation repositories' golden and clinical-vector suites, or approve a release.

Only fictional data may be used. Real or identifiable patient data must never appear in scenarios, fixtures, logs, screenshots, traces, reports, or exported charts.

## Platform Scope

The coordinated platform consists of five repositories:

| Layer | Repository | Role in the harness |
|---|---|---|
| Calculation engine | `rcpch/rcpchgrowth-python` | Selected as a released PyPI package, local checkout, or Git revision and installed into a selected local API build. |
| API server | `rcpch/digital-growth-charts-server` | Selected as a local Docker build/image or an existing cloud deployment; produces real API responses. |
| Chart Component | `rcpch/digital-growth-charts-react-component-library` | Selected as an npm release, local checkout/package, Git revision, or supported CDN artefact and embedded into the selected client build. |
| Demo Client | `rcpch/digital-growth-charts-react-client` | Selected as the current checkout, another local checkout, Git revision, release, or deployed URL and exercised through a browser. |
| Documentation and assurance | `rcpch/digital-growth-charts-documentation` | Does not run in the test stack. It owns the future Upgrades Runbook and records released compatibility and safety evidence produced by this harness. |

The harness must report the resolved identity of every runtime layer, including immutable package versions, Git commits, image digests, deployment URLs, and provenance returned by the running API where available. A requested configuration is not sufficient evidence: the harness must verify and report what actually ran.

## Terminology

- **Harness controller**: the code that resolves versions, prepares isolated workspaces, starts services, runs checks, and writes evidence. It is distinct from the Demo Client under test.
- **System under test**: the selected calculation engine, API server, Chart Component, and Demo Client combination.
- **Stack configuration**: a declarative selection of one source and version for every runtime layer, plus test and credential settings.
- **Resolved manifest**: the immutable identities actually selected from a stack configuration.
- **Scenario**: one API or browser workflow with named inputs and expected compatibility behaviour.
- **Compatibility result**: pass, fail, skipped, unsupported, or infrastructure error for one scenario and stack configuration.
- **Evidence bundle**: the resolved manifest, result summary, API request/response records, logs, screenshots, traces, exported artefacts, and environment metadata from one run.
- **Legacy measurement**: an authentic response produced before provenance became part of the API contract and therefore lacking `provenance`.
- **Verified measurement**: a measurement whose canonical `provenance.growth_reference` matches the chart reference after the explicit Turner normalization.
- **Unverified measurement**: a legacy measurement with missing provenance or a measurement with an unknown provenance value.
- **Mismatched measurement**: a measurement whose recognized canonical provenance is present and differs from the selected chart reference.

## Governing Invariants

- Exercise the selected API over HTTP and the selected client in a real browser. Do not substitute in-process API clients or shallow component mocks for end-to-end evidence.
- Preserve real API response values unchanged when testing interoperability. A mismatch scenario must pass a genuine response calculated for reference A unchanged to a chart displaying reference B; it must not relabel numerical output.
- Controlled synthetic mutations may be used only for runtime guard cases that a conforming API cannot naturally produce, such as an unknown provenance value. Such cases must be labelled as derived guard tests and retain a link or checksum to their genuine source response.
- Do not implement an independent centile or SDS calculation oracle in this repository. Numerical correctness remains owned by `rcpchgrowth` and its reviewed evidence.
- Do not silently regenerate or accept expected outputs. Any fixture or golden update requires a reviewed diff, provenance, rationale, and safety-impact assessment.
- Do not execute untrusted branches, packages, containers, or lifecycle scripts with production credentials. Cloud tests are opt-in and receive only the minimum credential required for the nominated environment.
- A matrix pass means the tested combination met the declared scenarios. It does not imply that untested combinations or clinical workflows are supported.
- Preserve logs and reports without patient-identifiable data or secrets. Redact request headers and credentials before writing evidence.

## Configuration Model

The user must be able to select a stack through a declarative configuration file and equivalent command-line overrides. An optional graphical selector may be added later, but automation must not depend on a GUI.

A configuration should distinguish a mutable request from the immutable resolved manifest. The following shape is illustrative rather than a final schema:

```yaml
name: provenance-release-candidate

engine:
  source: pypi
  version: 4.6.0

api:
  source: local-checkout
  path: ../digital-growth-charts-server
  revision: 3b4d5bd

component:
  source: local-checkout
  path: ../digital-growth-charts-react-component-library
  revision: c70c5fd

client:
  source: current-checkout

tests:
  suites:
    - api-smoke
    - browser-smoke
    - provenance-conformance
  browsers:
    - chromium
  viewports:
    - desktop
    - phone
```

The configuration format must be versioned and machine-validated before any build starts. Unknown fields and unsupported source combinations must fail with actionable messages rather than being ignored.

### Calculation Engine Sources

The harness must support:

- An exact released version from PyPI.
- A local checkout, including uncommitted development when explicitly allowed and recorded as dirty.
- A Git commit, tag, or branch resolved to an immutable commit.
- The API repository's existing pinned dependency when no override is requested.

A calculation-engine selection is meaningful only for an API environment the harness can build or control. A cloud API cannot have its engine replaced by the harness; its reported provenance must be inspected instead. Unsupported requests such as combining a PyPI override with an immutable cloud deployment must fail before tests run.

Local engine overrides should be installed into an isolated API image or environment. They must not modify either source checkout's dependency files or the user's global Python environment.

### API Server Sources

The harness must support:

- A local checkout built and run with Docker Compose.
- A Git revision checked out into an isolated worktree and built locally.
- A prebuilt local or registry image identified by immutable digest where possible.
- A nominated cloud URL, including development, staging, release-candidate, or production-compatible endpoints when explicitly authorized.

The harness must wait for API readiness, record health and OpenAPI metadata, run real requests, capture server logs for locally controlled instances, and always clean up services it started. It must not tear down unrelated containers or services.

Cloud configurations must declare authentication requirements separately from committed configuration. Browser-visible demo credentials are public constrained credentials, not secrets. The harness must not place confidential credentials in `VITE_*` variables or browser bundles.

Cloud API discovery must not assume that an OpenAPI document completely describes deployment discovery or authentication metadata. In practice the published OpenAPI description has been found to omit `servers` and security-scheme metadata; this gap is tracked in `digital-growth-charts-server#284`, linked from `digital-growth-charts-documentation#179`. Until the server contract supplies authoritative metadata, the harness must:

- Require the API base URL explicitly for a cloud stack rather than inferring it.
- Record whether OpenAPI `servers` and security schemes were present, absent, or inconsistent with the nominated endpoint.
- Avoid inferring a deployment identity or authentication contract solely from a URL.
- Retain explicit override support once the metadata gap is resolved, because older server versions remain part of compatibility matrices.

### Chart Component Sources

The harness must support:

- An exact npm package version.
- A local checkout packaged or linked reproducibly without modifying that checkout.
- A Git revision resolved to an immutable commit and built in isolation.
- A supported CDN artefact identified by immutable URL and integrity metadata where available.
- The Demo Client's existing locked component version when no override is requested.

The resolved report must include the component package version, commit when available, artefact checksum, React peer versions, and installation/build method. Local paths and mutable CDN aliases are insufficient on their own as release evidence.

Because the current Demo Client imports the component at build time, CDN support may require a dedicated adapter, import map, or test host. The chosen mechanism must exercise the published CDN interface rather than silently falling back to npm.

### Demo Client Sources

The harness must support:

- The current checkout.
- Another local checkout.
- A Git revision resolved into an isolated worktree.
- A released build or nominated deployed URL.

The harness controller must be able to build and test a different Demo Client revision from its own checkout. This separation prevents the harness from claiming compatibility only because its orchestration code and client application happen to be the same revision.

A source-built client must receive the selected API and component through explicit build inputs. A deployed client is immutable from the harness perspective; incompatible requests to replace its embedded component or API configuration must be rejected unless that deployment exposes a reviewed runtime configuration mechanism.

## Version Discovery And Selection

The harness should make valid choices easy to discover while keeping runs reproducible:

- Query PyPI for released `rcpchgrowth` versions.
- Query npm for released Chart Component versions.
- Read local Git tags, branches, commits, and working-tree state.
- List known local sibling checkouts without assuming they always exist.
- Accept explicit API and client deployment URLs from user-owned configuration.
- Cache discovery metadata with a visible refresh operation and timestamp.
- Resolve mutable tags and branches to immutable commits before execution.
- Present incompatible combinations before build, with the contract or capability that makes them incompatible.

The default command should run one named stack. Matrix execution must be explicit because a full Cartesian product of all available versions would be expensive, slow, and often meaningless. Named supported combinations, upgrade boundaries, and user-selected comparison axes should define practical matrices.

## Default Stack Presets

A user should not have to hand-write a configuration for the common cases. The harness should ship a small set of named presets that resolve to a full stack configuration and can still be overridden field by field like any other configuration:

- **`local-everything`**: every layer from a local checkout - the engine from the sibling `rcpchgrowth-python` checkout installed into a locally built API, the Chart Component from the sibling component checkout, and the current Demo Client checkout. Dirty trees are expected and must be recorded as such rather than treated as reproducible. This is the fast inner-loop preset for a developer with all repositories checked out as siblings, and corresponds to the "local development stack" matrix type.
- **`cloud-standard`**: the standard cloud-hosted API backend (currently Azure App Service, matching the `VITE_APP_GROWTH_API_BASEURL` production endpoint), the current Demo Client checkout, and its locked Chart Component. This is the closest single-run analogue of what a real user experiences, requires the public demo credential and network access, and must remain opt-in like `s/smoke-live`. It corresponds to the "cloud verification stack" matrix type.
- **`latest-released`**: the latest npm Chart Component installed into the current Demo Client checkout and tested against the nominated released cloud API. The engine version is observed from API provenance rather than selected independently because the cloud API is immutable. Testing the latest PyPI engine instead requires a controllable API source and is expressed as an override of `local-everything`. This preset confirms the newest installable frontend combination without requiring sibling checkouts and corresponds to the "current supported stack" matrix type.

Preset identifiers are part of the stable configuration surface: scripts, CI jobs, and the Upgrades Runbook should be able to name a preset rather than reconstructing its fields.

## Local Port Convention

Local and E2E services across the coordinated platform should use ports from the block **58600-58699**, reserved here for RCPCH dGC local and E2E use. This sits inside IANA's dynamic/private range (49152-65535), which is never assigned to a registered service, rather than in a commonly-used port such as 8000. The intent is that every layer can eventually run in its own container without a host-port clash, including alongside a developer's ordinary unrelated local services.

Current allocations:

| Port | Service |
|---|---|
| 58600 | API server (`s/e2e-local`) |
| 58680 | Demo Client dev server (`s/e2e-local`) |

Allocate new local/E2E services from this block as they are added, and record the allocation here rather than in an individual repository's own documentation, so the whole platform's local port map stays in one place.

## Harness Capabilities

### E2E-1 - Reproducible Stack Resolution

The harness must validate a requested stack, resolve immutable identities, record dirty local changes without copying or exposing unrelated files, and write the resolved manifest before testing starts.

### E2E-2 - Isolated Build And Orchestration

The harness must prepare disposable worktrees, package directories, Docker resources, ports, and caches without altering the user's selected repositories. Parallel runs must use unique project names and ports. Interruptions and failures must trigger safe cleanup while preserving evidence.

### E2E-3 - Real API Verification

The harness must issue real HTTP requests for all six reference families and record status code, content type, response shape, canonical reference provenance, calculation-engine identity, API-server identity, and selected representative values. It must exercise single calculation, successful and partially invalid bulk calculation, fictional-child generation, representative chart data, and standardized validation/application errors where supported by the selected API generation.

API assertions must be capability-aware. A legacy API may validly lack provenance, while a configuration declaring the new provenance contract must require complete nested `provenance` containing `growth_reference`, `calculation_engine`, and `api_server`.

### E2E-4 - Real Chart Rendering

The harness must feed genuine selected-API responses into the selected Chart Component through the selected Demo Client and verify centile and SDS rendering, measurement points, tooltips, results, warnings, errors, and export behaviour. It must detect browser exceptions, console errors, failed network requests, missing assets, and unexpected horizontal overflow.

### E2E-5 - User Interaction

Playwright scenarios must exercise the application as a user would, including entering fictional measurements, choosing references and measurement methods, switching between centile and SDS charts, inspecting results and technical warning details, changing reference with existing data, and exporting a chart. Tests should use accessible roles and names rather than implementation-specific selectors wherever practical.

### E2E-6 - Observable Output

The harness must stream concise progress to the terminal and produce both a human-readable report and machine-readable results. The report must make the selected and observed versions, failures, skipped capabilities, warnings, and evidence paths obvious. A browser-based results view may be added, but JSON output is required for CI and the Upgrades Runbook evidence trail.

### E2E-7 - Evidence Bundle

Every run must produce:

- Requested stack configuration.
- Resolved immutable manifest and dirty-state markers.
- Host, container, browser, Node, Python, and relevant architecture information.
- Scenario results with duration and failure classification.
- Redacted API requests and complete fictional API responses.
- API and client logs where controlled locally.
- Playwright traces and failure screenshots.
- Screenshots for designated reviewed presentation states.
- Exported SVGs and parsed provenance-warning metadata for export scenarios.
- Checksums for generated fixtures and artefacts.
- Links to related issues, hazards, PRs, and release candidates when supplied.

For every run, report where applicable: requested source, selector, and local path for each layer; resolved package version and registry URL; resolved Git commit and dirty-tree state; container image name and immutable digest; API base URL and deployment/environment name; component artefact URL and integrity hash for CDN tests; client build commit and deployed URL; versions and provenance reported by actual API responses; and Node, Python, browser, operating-system, and architecture details needed to reproduce the run. Mutable branches, tags, `latest` aliases, CDN aliases, and cloud URLs should be resolved to immutable identifiers where the platform permits; where a cloud service cannot expose one, record that as an evidence limitation rather than presenting the requested version as observed fact.

The machine-readable result should be a versioned schema alongside the human report. The following shape is illustrative rather than final:

```json
{
  "schema_version": "1",
  "run_id": "...",
  "started_at": "...",
  "finished_at": "...",
  "requested_stack": {},
  "resolved_stack": {},
  "observed_provenance": {},
  "capabilities": {},
  "scenario_results": [],
  "evidence": [],
  "limitations": [],
  "related_changes": [],
  "rollback_identifiers": {}
}
```

Results must distinguish product failure, unsupported combination, capability-based skip, test failure, and harness infrastructure failure. A legacy API that lacks a newly introduced capability is not automatically a failed implementation, but it must fail any stack profile that explicitly claims that capability.

Evidence should use a stable directory and schema suitable for retention by CI. Generated evidence is not committed by default; reviewed fixtures or release evidence may be promoted deliberately under the applicable repository policy. A reviewed release record in the documentation repository should retain the immutable run identifier, checksums, durable evidence links, scenario summary, known exceptions, reviewer decisions, and rollback identifiers.

## Provenance Safety Contract

The harness must verify the legacy-compatible selective-rejection policy agreed for persisted EPR data. The API remains stateless and does not persist measurements, but customer systems may store authentic API responses indefinitely and replay them into future Chart Component versions.

| Measurement provenance state | Required Chart Component behaviour |
|---|---|
| Canonical reference matches the chart | Render normally without a provenance warning. |
| Provenance is absent | Render as legacy data with a dismissible warning; dismissal leaves a persistent compact unverified indicator. |
| Provenance reference is unknown | Render as unverified data with a dismissible warning; dismissal leaves a persistent compact unverified indicator. |
| Matching and legacy measurements are mixed | Render all measurements and show the unverified warning/indicator. |
| Recognized reference mismatches the chart | Suppress only the mismatched measurement's point, tooltip, centile, and SDS; retain a permanent non-dismissible mismatch warning. |
| Every relevant measurement mismatches | Render the selected reference curves without measurement points and retain the permanent mismatch warning. |

For centile charts, validate only the selected measurement-method array. For SDS charts, validate every populated method array because several methods can render together. Turner comparison must normalize the legacy chart prop `turner` to canonical provenance `turners-syndrome`; internal curve identifiers are never valid public provenance.

Reference or data prop transitions must not retain stale measurements from the previous reference. Existing sex, measurement-method, gestation, date-of-birth, and duplicate-measurement guards must remain effective and must not be bypassed merely because provenance filtering removes a measurement later.

Charts containing accepted legacy or unknown-provenance data remain exportable. The exported SVG must include a concise visible unverified-provenance notice and structured, non-sensitive metadata. A confirmed mismatch export must similarly record that measurements were suppressed. Technical details may identify the chart reference, received reference, method, array index, component version, and remediation guidance, but must never contain dates of birth, observation dates, values, patient identifiers, or complete measurement objects.

This behaviour is a breaking runtime change for known mismatches and requires a semver-major Chart Component release even though legacy data remains accepted.

## Required Scenario Catalogue

Scenario IDs must be stable so reports, hazards, release evidence, and the Upgrades Runbook can refer to them over time.

### API Compatibility

- **API-1**: matching successful calculation for each of the six canonical references.
- **API-2**: successful bulk items carry the declared provenance contract while inline error objects remain unchanged.
- **API-3**: every fictional-child measurement carries the declared provenance contract.
- **API-4**: representative chart-coordinate responses remain consumable by the selected client/component generation.
- **API-5**: native validation and application errors use the contract declared by the selected API generation.
- **API-6**: requested and observed calculation-engine versions and commits agree for locally controlled builds.
- **API-7**: requested and observed API-server versions, commits, and image identities agree where the selected generation supports them.

### Provenance And Persistence

- **PROV-1**: matching data renders normally for all six canonical references.
- **PROV-2**: authentic pre-provenance responses render with the legacy warning and persistent post-dismissal indicator.
- **PROV-3**: matching provenance-aware and authentic legacy measurements render together with the unverified warning.
- **PROV-4**: a genuine `who` response passed unchanged to a `uk-who` chart is suppressed and produces the permanent mismatch warning.
- **PROV-5**: matching and mismatched genuine responses are mixed; matching points remain while mismatched points, tooltips, centiles, and SDS are absent.
- **PROV-6**: when every relevant measurement mismatches, curves remain, measurement points are absent, and the permanent warning remains.
- **PROV-7**: an unknown reference derived from a genuine response renders as unverified rather than being treated as a confirmed mismatch.
- **PROV-8**: Turner data compares `turner` to `turners-syndrome` without a false warning or suppression.
- **PROV-9**: internal curve keys such as `uk90_preterm`, `who_2006_infant`, and `trisomy_21_aap_infant` remain unknown and are never accepted as canonical provenance.
- **PROV-10**: centile validation ignores mismatches in an unselected method until that method is selected.
- **PROV-11**: SDS validation suppresses mismatches in any populated method array, including a method other than the most recently selected one.
- **PROV-12**: empty measurement arrays render without a provenance warning.
- **PROV-13**: changing chart reference or response data cannot retain stale points, tooltips, SDS, centiles, warnings, or exports from the prior reference.
- **PROV-14**: legacy, unknown, and mismatch exports contain the required visible notice and structured metadata without sensitive fields.

### Demo Client Workflows

- **CLIENT-1**: enter one fictional measurement and render its centile chart and results table.
- **CLIENT-2**: switch the same session between centile and SDS views without losing or mixing measurements.
- **CLIENT-3**: change growth reference while a previous request is complete and while another request is in flight; stale responses cannot contaminate the new chart.
- **CLIENT-4**: measurements across height, weight, BMI, and OFC retain one patient identity and cannot mix incompatible DOB, sex, or gestation.
- **CLIENT-5**: duplicate, invalid-date, incompatible-method, and out-of-range workflows retain their existing guards.
- **CLIENT-6**: warning summaries, details, dismissal, persistent indicators, and mismatch notices are keyboard accessible and announced appropriately.
- **CLIENT-7**: designated workflows render without browser exceptions, unexpected console errors, failed requests, or horizontal overflow at phone, tablet, and desktop viewports.
- **CLIENT-8**: chart export succeeds only with the provenance notice and metadata appropriate to the rendered state.

## Matrix Strategy

The harness must avoid an uncontrolled Cartesian product. It should support these deliberate matrix types:

- **Current supported stack**: latest supported released versions.
- **Upgrade boundary**: current released stack versus one candidate layer at a time.
- **Coordinated candidate stack**: nominated candidate versions of all changed layers.
- **Legacy persistence**: old API responses replayed through current and candidate components/clients.
- **Adjacent-version matrix**: previous supported and candidate versions around a major boundary.
- **Local development stack**: one or more dirty local checkouts, explicitly marked non-release evidence.
- **Cloud verification stack**: immutable client/component build against a nominated deployed API.

Matrix reports must distinguish unsupported from failed combinations. Supported-combination policy belongs in reviewed configuration or the Upgrades Runbook, not as assumptions embedded in test code.

## Known Edge Cases

- **Requested versus observed drift**: dependency resolution, a stale image tag, Docker cache, lockfile behaviour, or a deployed environment can cause a different version to run from the one requested.
- **Dirty local development**: local source may not correspond to its package version or Git commit. Record the dirty state and a diff checksum; do not call the result release-reproducible.
- **Immutable cloud services**: an engine or component embedded in an existing deployment cannot be swapped by configuration. Reject impossible combinations before starting tests.
- **Legacy capability gaps**: old APIs may lack provenance, version endpoints, OpenAPI server metadata, or security schemes. Report the missing capability without fabricating identity.
- **Mutable external artefacts**: npm tags, PyPI selectors, branch names, Docker tags, and CDN aliases can move after a run. Store immutable versions, commits, digests, URLs, and checksums.
- **Evidence-link expiry**: CI artefacts may expire. Release evidence cited by controlled documentation needs a durable retention location or checksummed promoted summary.
- **False platform pass**: a passing API-only test does not prove the selected component was bundled into the selected client or that users can complete the browser workflow.
- **Secrets in evidence**: network traces and API logs may contain credentials. Redaction must occur before evidence is persisted or published.
- **Patient data in evidence**: screenshots, SVG metadata, traces, fixtures, and complete API logs must remain fictional and non-identifiable.
- **Rollback incompatibility**: rolling back only one layer can create a combination that was never tested. The runbook must nominate and test coherent rollback version sets.

## Existing Baseline

The repository already contains the first useful increments:

- `tests/browser/platform-smoke.spec.js` builds the production Demo Client, renders the installed Chart Component in Chromium, checks centile and SDS output, and checks one phone viewport.
- `tests/live/platform-api-smoke.mjs` calls a nominated real API for all six reference families and three mid-parental-height references.
- `s/smoke` builds and exercises the installed component/client combination.
- `s/smoke-live` runs the opt-in nominated-API smoke test.
- `s/e2e-local` runs a first cut of the `local-everything` preset: it starts the local API server directly with `docker compose run` (not the server repository's own `s/dev`, which fixes the host port at 8000) with the sibling `rcpchgrowth-python` checkout installed editable, runs `tests/live/platform-api-smoke.mjs` against it for real-API contract verification, then starts the Demo Client dev server aliased to the sibling Chart Component source and runs `tests/e2e/local-stack.spec.js` in Chromium. `s/e2e-local --serve` skips the automated Chromium run and instead keeps the stack up so a human can interact with the real local API, engine, and component in a real browser until Ctrl+C, which is the primary use this preset was built for. `tests/e2e/local-stack.spec.js` now also automates `CLIENT-1`: it fills the real `Measurements` form and asserts a genuine `POST` to the local API server succeeds and renders, not just the bundled-fixture rendering check. This required fixing the `Reference`, `Sex`, and `Measurement method` Semantic UI `Select` controls, which had no discoverable accessible name (tracked as part of `R13` in `spec/roadmap.md`); local API CORS was already open (`allow_origins=['*', ...]` in `main.py`), so accessible names were the only real blocker. Before starting anything, `s/e2e-local` prints the resolved version, branch, commit, and dirty state of all four checkouts (engine, API server, Chart Component, this client), and again at the point of use (the `--serve` banner or the automated run's completion message), so a stale or unexpected sibling branch is obvious rather than silently producing confusing results - a lightweight first step toward the full resolved manifest in `E2E-R1`/`E2E-R3`. A first real run against a stale sibling checkout (`digital-growth-charts-server` on `live` rather than the intended branch) genuinely caught a pre-existing bug: `/utilities/mid-parental-height` hardcodes `age=20` for the parental SDS lookups instead of the WHO-capped `adult_age`, producing an unhandled 500 for WHO requests. The first `--serve` session also found that local dev mode's raw-source component alias bypasses the Rollup `versionInjector()` build transform, so the on-screen version string never resolves in local dev even though it works correctly in the built npm and CDN artifacts; filed as `digital-growth-charts-react-component-library#230` for cross-repo review rather than patched here, since fixing it means running that repository's real Rollup watch build instead of aliasing to raw source.

These checks should remain fast defaults. The broader harness should compose or extend them rather than replacing them with one monolithic test. `s/e2e-local` is the exception: it is opt-in and Docker-dependent, like `s/smoke-live`.

## Roadmap

Legend: [x] done, [~] in progress, [ ] not started

- [x] **E2E-R1 - Establish local browser and nominated-API smoke tests.** Production-bundle Chromium rendering and six-reference API calls exist.
- [ ] **E2E-R2 - Define and validate the stack configuration schema.** Add named configurations including the `local-everything`, `cloud-standard`, and `latest-released` default presets, CLI overrides, capability validation, and immutable resolved manifests.
- [ ] **E2E-R3 - Add source discovery and adapters.** Support PyPI/local/Git engine sources, local/image/cloud API sources, npm/local/Git/CDN component sources, and local/Git/deployed client sources.
- [~] **E2E-R4 - Add isolated orchestration.** `s/e2e-local` starts and waits for readiness of the `local-everything` preset and cleans up on exit, but it is a fixed single-run script hardcoded to the sibling-checkout convention, does not use disposable worktrees or unique Docker resources, and is not safe to run in parallel with itself.
- [ ] **E2E-R5 - Implement the API scenario registry.** Convert current live smoke coverage into stable scenario IDs and add bulk, fictional-child, chart-data, errors, and observed-version verification.
- [ ] **E2E-R6 - Implement provenance and persistence conformance.** Exercise genuine matching, legacy, mixed, mismatch, all-mismatch, unknown, Turner, method-selection, transition, and export cases.
- [ ] **E2E-R7 - Expand browser workflows and accessibility evidence.** Cover reference transitions, request races, patient identity, existing guards, warning interactions, exports, and phone/tablet/desktop viewports.
- [ ] **E2E-R8 - Produce durable evidence bundles.** Add human and JSON reports, redacted traffic, logs, screenshots, traces, SVG inspection, checksums, and failure classification.
- [ ] **E2E-R9 - Add explicit matrix execution.** Run named supported, upgrade-boundary, coordinated-candidate, legacy-persistence, local-development, and cloud-verification matrices with bounded concurrency.
- [ ] **E2E-R10 - Integrate reviewed CI entry points.** Keep pull-request smoke tests fast; make expensive cloud and cross-version matrices opt-in or scheduled; publish retained evidence without exposing credentials.
- [ ] **E2E-R11 - Connect release evidence to the Upgrades Runbook.** Export the five-repository version set, scenario summary, evidence links, known exceptions, and rollback identifiers in a form the documentation repository can record.
- [ ] **E2E-R12 - Obtain independent safety review.** Link provenance and transition scenarios to hazard `digital-growth-charts-documentation#174`, review residual risk, and record approval outside agent-generated evidence.
- [ ] **E2E-R13 - Exercise a complete upgrade rehearsal.** Run a non-production five-repository candidate and rollback sequence end to end, then update this specification and the Upgrades Runbook from observed friction.

## Upgrades Runbook Boundary

The future Upgrades Runbook belongs in `rcpch/digital-growth-charts-documentation`. It should describe the human-controlled process for a major coordinated upgrade across all five repositories, with explicit hold points:

1. Define the change boundary, affected contracts, safety impact, supported old and new combinations, migration requirements, rollback criteria, and nominated reviewers.
2. Release or nominate the calculation-engine candidate and retain its package, commit, clinical-vector, and golden-test evidence.
3. Build the API candidate with the exact engine candidate, verify the resolved engine identity from real responses, validate OpenAPI and error contracts, and nominate a local image or cloud deployment.
4. Build and test the Chart Component against genuine API responses, including persisted legacy responses and any provenance transition rules, then release or nominate an immutable component artefact.
5. Build the Demo Client with the exact candidate API and component selections, exercise real browser workflows, and nominate an immutable client build or deployment.
6. Run current-supported, one-layer upgrade-boundary, coordinated-candidate, legacy-persistence, and rollback matrices from this specification. Avoid an unbounded Cartesian product.
7. Review failures, skips, unsupported combinations, evidence limitations, accessibility results, export artefacts, security boundaries, and safety implications. Record explicit approval or rejection rather than inferring approval from a green job.
8. Promote the runtime releases and deployments in the approved order, with observation and rollback hold points between layers.
9. Update compatibility tables, migration guidance, API and component integration guidance, safety records, release notes, and the five-repository resolved version set in the documentation repository.
10. Run the documentation site's own release verification: create the dated release through its `s/version++`, then verify the tag, GitHub release, PDF artefacts by name and checksum, production deployment commit, `s/linkcheck` results, and the version badge in a fresh browser session (a stale badge can be client-side session-storage cache rather than a stale deployment).

The runbook should own approvals, supported-version policy, sequencing, migration guidance for persisted responses, deployment promotion, rollback, customer communication, and links to QMS or clinical-safety records. This repository should own executable scenarios and evidence generation. The same requirement should not be maintained independently in both places: the runbook should invoke stable scenario IDs from this specification and retain links to their results. The runbook should never require a developer to hand-edit dependency files merely to test a matrix combination.

## Acceptance Criteria For The Harness

- A user can select each runtime layer from every supported source without editing dependency files by hand.
- The harness rejects impossible combinations before building and explains why they are impossible.
- A completed run records requested and observed immutable identities for all controlled layers.
- Locally selected engine code runs inside the locally selected API build without modifying source checkouts or global environments.
- The selected component is demonstrably the one embedded in the selected client.
- Automated API scenarios use real HTTP responses and automated UI scenarios use a real browser.
- The required scenario catalogue can run against one stack and across an explicit bounded matrix.
- Legacy persisted responses can be replayed without recalculation and are visibly identified as unverified.
- Confirmed mismatched measurements never produce points, tooltips, centiles, or SDS values in the chart.
- Reference and request transitions cannot display stale results from a previous reference.
- Exported charts preserve visible and machine-readable provenance-warning evidence.
- Human and JSON reports clearly distinguish product failures, unsupported capabilities, skips, and harness infrastructure failures.
- Failure evidence includes enough redacted detail to reproduce the run without exposing credentials or identifiable data.
- The fast local smoke path remains suitable for ordinary pull requests, while expensive matrices are explicit.
- Scenario IDs and evidence can be cited unchanged by the Upgrades Runbook, implementation PRs, releases, and hazard records.

## Open Implementation Decisions

- Choose the implementation language and command surface for the harness controller. The existing Node and Playwright toolchain is the default candidate, but Docker orchestration and Python package resolution should be prototyped before committing to an architecture.
- Decide whether isolated Git revisions use Git worktrees, archive exports, or container build contexts. The mechanism must preserve the user's existing dirty checkouts.
- Define the versioned stack-configuration and JSON-result schemas.
- Decide how CDN component artefacts are embedded and integrity-checked in a test host.
- Define the capability-discovery mechanism for legacy API and component generations that predate provenance.
- Define evidence retention periods and artefact access controls for local, pull-request, scheduled, and release-candidate runs.
- Define the minimum supported browser set and which cross-browser/viewport combinations are release gates rather than periodic evidence.
- Confirm the canonical location and schema for authentic pre-provenance response fixtures, including their source versions, checksums, licence, and review history.
