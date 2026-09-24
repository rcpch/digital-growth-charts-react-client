# RCPCH Digital Growth Charts React Demo

A public demonstration client showing how the RCPCH Digital Growth Charts API and React chart component work together.

[![CI](https://github.com/rcpch/digital-growth-charts-react-client/actions/workflows/ci.yml/badge.svg)](https://github.com/rcpch/digital-growth-charts-react-client/actions/workflows/ci.yml)
[![Licence: MIT](https://img.shields.io/badge/Licence-MIT-blue.svg)](LICENSE)

> [!WARNING]
> This application is for demonstration only and is not independently approved for clinical use. Use fictional data only. Do not enter real or identifiable patient data.

- [Open the online demo](https://growth.rcpch.ac.uk/)
- [Read the product documentation](https://growth.rcpch.ac.uk/products/react-client/)
- [Review clinical safety and scope](SAFETY.md)

## What It Is

This Vite/React application provides demonstration data-entry workflows, sends measurements to the configured Digital Growth Charts API, and presents API results through the published RCPCH chart component. It is intended for developers, integrators, implementers, and reviewers. Clinical centile and SDS calculations are performed by the API, not this repository.

The official API is documented as stateless. The browser, host application, screenshots, logs, and third-party deployments can still create data-handling risks, so this demo must be used with fictional data only.

## Quick Start

Prerequisite: Node.js 24, preferably selected through a version manager using `.nvmrc`.

```sh
nvm use
cp example.env .env
npm ci
s/dev
```

Open <http://localhost:3000/>.

## Docker Setup

Prerequisite: Docker with the daemon running.

```sh
cp example.env .env
s/up
```

Open <http://localhost:3000/>. Source changes are reflected through Vite's development server. Stop and remove the development environment with `s/down`.

Compose builds the development image with the exact locked dependencies and mounts the application source for hot reload. The older `s/docker-rebuild` and `s/docker-start` wrappers remain available for running the image directly. GitHub Pages serves the public deployment.

## Validation

Run the same checks used by CI:

```sh
s/lint
s/test
s/build
s/audit
s/smoke
```

The current test suite is an initial baseline, not complete clinical assurance. Safety-relevant changes require independent review against authoritative evidence.

`s/smoke` builds the production bundle and runs it in Chromium, ensuring the exact installed chart package can render centile and SDS output from API-shaped data. For a coordinated platform release candidate, run the opt-in live matrix against the nominated API deployment:

```sh
LIVE_GROWTH_API_BASE_URL=https://candidate.example/growth/v1 \
LIVE_PUBLIC_DEMO_KEY=... \
LIVE_REQUIRE_PROVENANCE=true \
s/smoke-live
```

The live smoke test checks interoperability and provenance relationships. It does not independently recalculate or clinically approve centiles or SDS values.

Maintainers can run the same matrix from GitHub Actions using **Coordinated platform smoke test**, supplying the candidate API URL and choosing whether v5 provenance is mandatory. The workflow uses the repository's public demo credential without exposing it to pull-request code.

## Versions and Releases

The Client has its own Semantic Version in `package.json`. It is independent of the Chart Component, API, and calculation engine versions; similar version numbers do not imply compatibility.

- **Major**: backward-incompatible changes to the demonstrated integration or configuration contract, removal of supported workflows, or raised compatibility floors that require integrator action.
- **Minor**: backward-compatible user-visible capabilities or supported integration options.
- **Patch**: backward-compatible fixes, security remediations, and documentation or maintenance changes worth recording as a named release.

Every push to `live` is deployed to GitHub Pages. The visible build commit identifies the exact deployment, including deployments between named releases. A `vX.Y.Z` tag and GitHub Release identify a reviewed named snapshot.

Release preparation additionally requires authenticated [GitHub CLI](https://cli.github.com/) and [git-cliff](https://git-cliff.org/). With approval to start a release, run the following from a clean, current `live` branch:

```sh
s/version++ patch  # or minor / major
```

The command runs the release gate, updates `package.json`, `package-lock.json`, and `CHANGELOG.md`, then opens a `release/vX.Y.Z` pull request. Merging that narrowly scoped PR tags the exact merged commit and creates the GitHub Release. This private static application does not publish an npm package.

The first managed release will be `v7.1.0`. Named releases are cut when a coherent set of changes merits a reviewed snapshot, not for every deployment. A maintainer chooses the bump level and prepares the release PR; its reviewer approves the version, release notes, and available compatibility evidence before merging.

## Configuration

| Variable | Purpose |
|---|---|
| `VITE_APP_GROWTH_API_BASEURL` | Base URL of the Digital Growth Charts API. |
| `VITE_APP_PUBLIC_DEMO_KEY` | Optional public, rate-limited demo credential sent by the browser. It cannot be secret because Vite embeds it in downloadable JavaScript. |

## Contributing

Raise issues at <https://github.com/rcpch/digital-growth-charts-react-client/issues>. Use a feature branch and pull request targeting the protected `live` branch. This repository deliberately retains `live` as its default and GitHub Pages deployment branch rather than migrating the established deployment to `main`. Read [agent-instructions.md](agent-instructions.md) and [SAFETY.md](SAFETY.md) before changing clinical presentation, validation, fixtures, API contracts, credentials, or deployment.

## Licence

Original Demo Client code is deliberately licensed under MIT to permit broad integration and modification: see [LICENSE](LICENSE). This is an explicit project exception to the RCPCH default of AGPL-3.0-or-later for applications. The bundled RCPCH Chart Component remains AGPL-3.0-or-later: that licence permits modification, but its source-availability and share-alike conditions continue to apply to use and distribution of the component and its modifications. The MIT licence for this Client does not relicense the Chart Component or other third-party assets.
