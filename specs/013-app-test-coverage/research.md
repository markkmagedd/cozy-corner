# Research: App Test Coverage

## Decision 1: Unit and Component Testing Framework
- **Decision:** Vitest with React Testing Library.
- **Rationale:** The user specified Vitest. Vitest is significantly faster than Jest, shares configuration with Vite, and integrates well with modern TypeScript/Next.js stacks. React Testing Library is the industry standard for testing React components in a user-centric way.
- **Alternatives considered:** Jest (slower, requires more complex Babel/SWC configuration for TypeScript), Mocha (outdated for modern React testing).

## Decision 2: End-to-End (E2E) Testing Framework
- **Decision:** Playwright.
- **Rationale:** The user specified Playwright. Playwright provides excellent cross-browser support, runs exceptionally fast, and has built-in UI tracing, video recording, and auto-waiting which reduces test flakiness.
- **Alternatives considered:** Cypress (runs inside the browser, struggles with multiple tabs/origins, historically slightly slower test execution for large suites), Selenium (too heavy and slow).

## Decision 3: Continuous Integration (CI) Provider
- **Decision:** GitHub Actions.
- **Rationale:** The user specified GitHub Actions. The codebase is already hosted in a Git/GitHub compatible structure. Actions allow us to spin up a PostgreSQL service container easily to run Prisma migrations and execute our E2E and integration tests against a real database environment before deploying.
- **Alternatives considered:** Vercel (good for deployments, but sometimes less flexible for complex multi-service test setups), GitLab CI (only if using GitLab).

## Decision 4: Database Testing Strategy
- **Decision:** Use an isolated test database (e.g., PostgreSQL service container in CI, and a local test DB for local development) rather than mocking Prisma for integration tests.
- **Rationale:** Mocking Prisma (`prisma-mock`) is often brittle and fails to catch real SQL-level constraints, unique violations, or cascading delete issues. Running tests against a real, ephemeral database ensures the highest fidelity.
- **Alternatives considered:** Mocking the Prisma client (rejected due to reduced test fidelity for complex queries).
