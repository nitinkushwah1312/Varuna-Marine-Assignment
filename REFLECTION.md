# Reflection

Using AI agents to build this assignment reinforced a few patterns:

- Start with architecture: defining ports and use-cases first made the rest (adapters, HTTP, UI) straightforward and testable. The hexagonal split prevented framework coupling.
- Small, composable steps: code generation for each layer (domain → ports → use-cases → adapters) helped keep changes traceable and simple to validate.
- Tests early: in-memory adapters let me validate CB, banking, and pooling logic without a database, keeping iteration fast.

Efficiency gains:
- Agents sped up boilerplate (TypeScript configs, folder layout, repetitive ports/adapters, React pages) and consistent naming.
- I kept the frontend chart minimal (SVG) to avoid over-dependence on packages while still delivering value.

What I’d improve next time:
- Add ESLint/Prettier with consistent rules and CI checks.
- Expand integration tests to exercise the Postgres adapters using a test database and seeds.
- Add a dockerd-compose for Postgres + one-liner scripts.

