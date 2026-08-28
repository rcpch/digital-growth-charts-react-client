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
s/docker-rebuild
s/docker-start
```

The Docker image is for local development and runs the Vite development server. GitHub Pages serves the public deployment.

## Validation

Run the same checks used by CI:

```sh
s/lint
s/test
s/build
s/audit
```

The current test suite is an initial baseline, not complete clinical assurance. Safety-relevant changes require independent review against authoritative evidence.

## Configuration

| Variable | Purpose |
|---|---|
| `VITE_APP_GROWTH_API_BASEURL` | Base URL of the Digital Growth Charts API. |
| `VITE_APP_PUBLIC_DEMO_KEY` | Optional public, rate-limited demo credential sent by the browser. It cannot be secret because Vite embeds it in downloadable JavaScript. |

## Contributing

Raise issues at <https://github.com/rcpch/digital-growth-charts-react-client/issues>. Use a feature branch and pull request targeting the protected `live` branch. This repository deliberately retains `live` as its default and GitHub Pages deployment branch rather than migrating the established deployment to `main`. Read [agent-instructions.md](agent-instructions.md) and [SAFETY.md](SAFETY.md) before changing clinical presentation, validation, fixtures, API contracts, credentials, or deployment.

## Licence

The repository currently declares the code as MIT: see [LICENSE](LICENSE). The bundled RCPCH chart component declares AGPL-3.0-or-later, so combined-distribution obligations and alignment with the RCPCH application licensing standard are under review in [HOUSE-STYLE-AUDIT.md](HOUSE-STYLE-AUDIT.md). No relicensing is implied by this documentation.
