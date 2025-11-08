# AI Agent Workflow Log

## Agents Used
- OpenAI Codex CLI (this session)

## Prompts & Outputs
- Task brief pasted in full; I planned the repo structure, ports and use-cases, and generated code for backend (core use-cases, ports, Express HTTP, Postgres repos), frontend (React + Tailwind tabs and pages), and tests.
- Iteration examples:
  - Initial plan → scaffold backend packages, tsconfig, constants.
  - Generate use-cases (`ComputeCB`, `ComputeComparison`, `BankSurplus`, `ApplyBanked`, `CreatePool`) → add ports and domain types.
  - Add inbound HTTP → proxy for Vite → wire pages and API client.

## Validation / Corrections
- Wrote unit tests for all core use-cases with in-memory adapters to validate CB math, banking flow (bank/apply), pooling greedy allocation, and comparison.
- Added a minimal HTTP integration test with in-memory adapters to validate routes without a DB.

## Observations
- Agents save time scaffolding repeat boilerplate (ports, adapters) and keeping structure consistent across frontend/back.
- Biggest risks: over-scoping; mitigated by keeping minimal viable endpoints and simple charting (SVG, no heavy libs).
- Effective combo: generate core first, then adapters, then UI.

## Best Practices Followed
- Hexagonal separation (core → ports → adapters).
- TypeScript strict mode on both packages.
- Tests target pure use-cases with in-memory repos.
- Minimal dependencies; DB behind port with `pg` only in adapter.

