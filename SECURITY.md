# Security Policy

## Reporting A Vulnerability

Please report suspected vulnerabilities privately through [GitHub private vulnerability reporting](https://github.com/rcpch/digital-growth-charts-react-client/security/advisories/new). Do not open a public issue for a vulnerability, credential, exploit, or patient-data concern.

Include the affected version or deployment, reproduction steps, likely impact, and any suggested mitigation. Do not include real patient data, live credentials, or unnecessary exploit detail.

The RCPCH team will acknowledge the report, assess security and clinical-safety impact, and coordinate remediation and disclosure. If private vulnerability reporting is unavailable, use the security contact published by the [RCPCH Incubator](https://growth.rcpch.ac.uk/).

## Supported Version

The public demonstration deployed from the protected `live` branch is the supported version. Older commits, forks, and self-hosted deployments are not supported or warranted by RCPCH.

## Browser Credentials

This is a static browser application. Every value exposed through a `VITE_*` environment variable is included in the downloadable browser bundle and must be treated as public. `VITE_APP_PUBLIC_DEMO_KEY` is deliberately named and managed as a public, tightly constrained, rate-limited demo credential. Confidential credentials must be applied by a server-side service, not this client.
