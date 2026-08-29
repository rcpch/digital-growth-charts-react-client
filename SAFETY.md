# Clinical Safety

## Purpose And Scope

This repository contains a demonstration React client for the RCPCH Digital Growth Charts API and chart component. It illustrates integration, data entry, fictional examples, and presentation of API results. The repository does not implement the underlying centile or SDS calculation engine.

The application currently labels itself as demonstration-only and not for clinical use. It must not be used as a standalone clinical decision-making system, and real or identifiable patient data must not be entered into development, tests, screenshots, fixtures, or the public demonstration.

## Intended Users And Environment

The intended users of this repository are developers, integrators, implementers, and reviewers evaluating the Digital Growth Charts integration workflow. A downstream clinical deployment is responsible for its own clinical risk management, data protection, usability, integration, and DCB0160 obligations.

## Current Safety Status

This repository is not independently assured for clinical use. Known assurance gaps are recorded in [spec/roadmap.md](spec/roadmap.md), including comprehensive clinical assurance, patient-state review, fixture provenance, accessibility, and the browser credential boundary. Safety-relevant changes require independent review and must not rely on agent-generated tests as their sole evidence.

The wider RCPCH Digital Growth Charts platform has a controlled clinical safety and medical-device file. The product owner and Clinical Safety Officer must confirm whether a particular deployment of this client is inside the warranted platform boundary before clinical use or a change in the claims made here.

The public static demo uses an intentionally public, tightly constrained, rate-limited demo credential. It is not a secret and must grant no authority beyond the demo endpoint. Credential rotation and API gateway controls are operational responsibilities outside this repository.

## Data Boundary

Calculation inputs are sent to the configured Digital Growth Charts API. The RCPCH API is documented as stateless, but users must still avoid entering real patient data into this demonstration. Browser developer tools, local state, screenshots, host systems, and third-party deployments can create additional data-handling risks outside the API's persistence model.

## Clinical Governance

- [React demo client](https://growth.rcpch.ac.uk/products/react-client/)
- [Intended purpose](https://growth.rcpch.ac.uk/safety/csmf/intended-purpose/)
- [Clinical safety case](https://growth.rcpch.ac.uk/safety/csmf/clinical-safety-case-report/)
- [Hazard log](https://growth.rcpch.ac.uk/safety/csmf/hazard-log/)
- [Medical-device registration](https://growth.rcpch.ac.uk/safety/medical-device-reg/mhra/)
- [Privacy notice](https://growth.rcpch.ac.uk/legal/privacy-notice/)
- [Quality management system](https://growth.rcpch.ac.uk/safety/qms/)

The RCPCH Incubator Clinical Safety Officer and product governance roles own safety acceptance. Suspected incidents, incorrect results, wrong-patient presentation, or unsafe clinical behaviour must be reported through the controlled Digital Growth Charts quality and safety process, without placing patient-identifiable information in public issues.

## Reassessment Triggers

Reassess this file and the central safety documentation when intended purpose, clinical claims, target users, patient-data policy, API contracts, chart interpretation, clinical validation, supported references, deployment architecture, or the medical-device boundary changes.
