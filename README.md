# FuelEU Maritime — Compliance Module (Frontend + Backend)

This repository implements a minimal Fuel EU Maritime compliance platform with a hexagonal architecture across frontend and backend. It includes domain logic for routes, compliance balance (CB), banking, and pooling, and a React + Tailwind dashboard consuming the backend APIs.

## Overview

- Frontend: React + TypeScript + TailwindCSS (Vite)
- Backend: Node.js + TypeScript + Express + PostgreSQL
- Architecture: Hexagonal (Ports & Adapters / Clean Architecture)
- Docs: AGENT_WORKFLOW.md (agent usage), REFLECTION.md (essay)
- Tests: Vitest unit tests for core use-cases; a minimal HTTP integration test (in‑memory adapters)

## Architecture

Folders follow hexagonal separation:

backend/src
  core/
    domain/            // pure types
    application/       // use-cases
    ports/             // repository/service ports
  adapters/
    inbound/http/      // Express HTTP (inbound)
    outbound/postgres/ // Postgres repos (outbound)
  infrastructure/
    db/                // migrations + seed
    server/            // composition root
  shared/              // cross-cutting constants

frontend/src
  core/                // domain types (no React)
  adapters/
    ui/                // components/pages (inbound adapters)
    infrastructure/    // API client (outbound adapter)

Core is framework-free; adapters implement ports; infrastructure composes and wires dependencies.

## Backend: Setup & Run

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `PORT`.
2. Install deps: `cd backend && npm i`.
3. Run migration: `npm run migrate`.
4. Seed data: `npm run seed`.
5. Start dev server: `npm run dev` (http://localhost:3001).

Scripts:
- `npm run test` — Vitest unit + integration (in-memory) tests
- `npm run build` and `npm start` — build and run compiled server

## Frontend: Setup & Run

1. Install deps: `cd frontend && npm i`.
2. Start dev server: `npm run dev` (Vite at http://localhost:5173).
   - Vite dev server proxies API calls to `http://localhost:3001`.

## API Summary

- `GET /routes` — list seeded routes
- `POST /routes/:id/baseline` — set baseline route
- `GET /routes/comparison` — baseline vs others, percent diff + compliant
- `GET /compliance/cb?shipId&year` — compute/store CB snapshot
- `GET /compliance/adjusted-cb?shipId&year` — CB plus applied banked entries
- `GET /banking/records?shipId&year` — banking ledger entries
- `POST /banking/bank` — bank positive CB for that year
- `POST /banking/apply` — apply banked surplus against a deficit
- `POST /pools` — greedy reallocation; returns before/after CBs

Notes:
- In this seed, `shipId` equals `routeId` (e.g., `R001`).
- Energy scope = `fuelConsumption * 41,000 MJ/t`.
- CB = `(Target(89.3368) − Actual) × Energy`.

## Tests

- Unit tests under `backend/tests/unit/` cover `ComputeCB`, `ComputeComparison`, `BankSurplus`, `ApplyBanked`, `CreatePool`.
- A light HTTP integration test uses in-memory adapters; no DB required.

Run: `cd backend && npm test`.

## Screenshots / Samples

##  Routes tab  
Lists routes, allows filtering (vessel / fuel / year), and lets the user set a baseline.  
<img src="./docs/screenshots/Routes.png" width="750"/>

## 📊 Compare tab  
Shows baseline vs. other routes with percentage difference and a simple SVG visual.  
<img src="./docs/screenshots/Compare.png" width="750"/>

##  Banking tab  
Displays CB (Compliance Balance), allows banking or applying surplus with validations.  
<img src="./docs/screenshots/Banking.png" width="750"/>

##  Pooling tab  
Add members, load CBs, validate pool sum, and create a pool.  
<img src="./docs/screenshots/Pooling.png" width="750"/>


## Notes

- ESLint/Prettier can be added if required; TypeScript strict mode is enabled.
- Postgres adapters are implemented with `pg`. Tests rely on in-memory repos to avoid DB coupling.

