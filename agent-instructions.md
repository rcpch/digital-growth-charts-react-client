# Agent Instructions

This repository contains the public React demonstration client for the RCPCH Digital Growth Charts API and chart component. It demonstrates integration and is not a standalone clinical calculation engine or an approved host application for clinical use.

## Read First

- [README.md](README.md) - purpose, status, setup, and validation.
- [SAFETY.md](SAFETY.md) - clinical scope, data boundary, and authoritative safety links.
- [spec/roadmap.md](spec/roadmap.md) - current compliance gaps, owner decisions, and remediation status.
- [`rcpch-house-style`](https://github.com/rcpch/rcpch-house-style) - RCPCH engineering standards. The local checkout is normally at `~/code/rcpch/rcpch-house-style/AGENTS.md`.

## Core Invariants

- Never use real or identifiable patient data in development, tests, screenshots, fixtures, or the public demo.
- Do not implement centile or SDS calculations in this client. Clinical calculations belong in the API and its reviewed calculation dependencies.
- A chart contains one patient's measurements only. DOB, sex, and gestation must remain consistent across every measurement method.
- Treat every `VITE_*` value as public because Vite embeds it in the browser bundle. Never put a confidential credential there.
- Changes affecting clinical presentation, validation, fixtures, provenance, or API contracts require independent review against authoritative evidence and a safety-impact assessment.
- Files under `src/fictional-children/` are reviewed clinical demonstration fixtures. Do not hand-edit or regenerate them without recording provenance and review evidence.
- `live` is currently the protected default and deployment branch. Use a feature branch and pull request; never push directly to `live`.
- Retaining `live` rather than migrating this established static deployment to `main` is a documented project exception.
- The repository remains MIT pending an explicit RCPCH licensing review. Do not change the licence or add SPDX/REUSE declarations that imply a relicensing decision.

## Workflow

- `s/dev` - run the Vite development server.
- `s/lint` - run ESLint.
- `s/test` - run the test suite once.
- `s/smoke` - build and run the production-browser compatibility smoke tests.
- `s/smoke-live` - run the opt-in smoke matrix against a nominated API deployment.
- `s/build` - build the production bundle.
- `s/audit` - fail on high-severity npm advisories.
- `s/docker-rebuild` - rebuild the development image.
- `s/docker-start` - run the development image.

## Before Every Commit

```sh
s/lint
s/test
s/build
s/audit
s/smoke
```

Review the diff as well as the command results. Agent-generated tests are not independent clinical evidence.

## Approval Required

Ask before changing secrets or authentication architecture, changing licensing, publishing a release, deploying or pushing to `live`, changing safety or regulatory claims, deleting branches, force-pushing, changing repository protections, or taking other externally visible actions.
