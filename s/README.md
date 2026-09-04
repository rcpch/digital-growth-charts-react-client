# `s/`

The `s/` directory contains simple convenience scripts to standardise work on this repository.

- `s/dev` - run the Vite development server.
- `s/lint` - run ESLint.
- `s/test` - run Vitest once.
- `s/smoke` - build and exercise the installed chart package in Chromium.
- `s/smoke-live` - run the opt-in API compatibility matrix against a nominated deployment.
- `s/e2e-local` - run the `local-everything` E2E preset (local engine, API, Chart Component, and this checkout). Requires Docker and sibling checkouts; see spec/e2e.md. Add `--serve` to keep the stack running for manual browser interaction instead of tearing down after the automated checks.
- `s/regenerate-example-scenarios` - regenerate the bundled `src/example-scenarios/**/data.json` demo datasets from `scenario-manifest.json` against a real API.
- `s/build` - build the production bundle.
- `s/audit` - audit the locked npm dependencies.
- `s/docker-rebuild` - rebuild the local development image.
- `s/docker-start` - run the local development image using `.env`.
