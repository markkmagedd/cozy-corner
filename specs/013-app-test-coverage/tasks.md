# Implementation Tasks: App Test Coverage

**Branch**: `013-app-test-coverage`
**Feature**: App Test Coverage
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## 🎯 Implementation Strategy

- **Phase 1**: Setup (project initialization)
- **Phase 2**: Foundational (blocking prerequisites - test datatbase and utils, config)
- **Phase 3**: Unit and Integration Tests via Vitest (US1)
- **Phase 4**: End-to-End (E2E) Testing via Playwright (US2)
- **Phase 5**: Automated Test CI/CD Pipeline via GitHub Actions (US3)
- **Phase 6**: Polish & cross-cutting concerns

## 📋 Task List

### Phase 1: Setup & Initialization

- [ ] T001 Initialize Vitest & React Testing Library dependencies in `package.json` (npm install -D vitest @testing-library/react @testing-library/dom jsdom @vitejs/plugin-react vite-tsconfig-paths)
- [ ] T002 Initialize Playwright dependencies in `package.json` (npm init playwright@latest)
- [ ] T003 Create Vitest configuration file at `vitest.config.ts` based on contracts
- [ ] T004 Create Playwright configuration file at `playwright.config.ts`
- [ ] T005 [P] Create the `tests/` parent directory and specific sub-directories `tests/components`, `tests/server-actions`, `tests/e2e`, `tests/utils`

### Phase 2: Foundational (Prerequisites)

- [ ] T006 Create Vitest setup file at `tests/setup.ts`
- [ ] T007 Implement Test DB helper in `tests/utils/test-db.ts` to connect and reset test DB cleanly
- [ ] T008 [P] Develop Test Seeding script in `tests/utils/seed.ts` for Users, Categories, and Products
- [ ] T009 Add NPM scripts (test, test:watch, test:coverage, test:e2e) to `package.json`

### Phase 3: Unit and Integration Tests via Vitest (US1)

**Goal**: Automate testing of core components, utilities, and server actions.
**Independent Test**: `npm run test:coverage` finishes with passing tests.

- [ ] T010 [US1] Write unit tests for utility functions in `tests/utils/helpers.test.ts`
- [ ] T011 [P] [US1] Write component tests for `components/ui` React components in `tests/components/ui.test.tsx`
- [ ] T012 [P] [US1] Write integration tests for `Category` server actions in `tests/server-actions/categories.test.ts` (interacting with test-db.ts)
- [ ] T013 [P] [US1] Write integration tests for `Product` server actions in `tests/server-actions/products.test.ts` (interacting with test-db.ts)
- [ ] T014 [US1] Validate Vitest execution and configuration locally with `npm run test`

### Phase 4: End-to-End (E2E) Testing via Playwright (US2)

**Goal**: Simulate real user interactions across critical workflows.
**Independent Test**: `npm run test:e2e` runs Playwright and generates report.

- [ ] T015 [US2] Write E2E test for storefront product browsing in `tests/e2e/storefront/browse.spec.ts`
- [ ] T016 [P] [US2] Write E2E test for admin Category CRUD operations in `tests/e2e/admin/categories.spec.ts`
- [ ] T017 [P] [US2] Write E2E test for admin Product CRUD operations in `tests/e2e/admin/products.spec.ts`
- [ ] T018 [US2] Validate Playwright execution and configuration locally with `npm run test:e2e`

### Phase 5: Automated Test CI/CD Pipeline via GitHub Actions (US3)

**Goal**: Block production deployment on test failures.
**Independent Test**: Pushing breaking code fails CI.

- [ ] T019 [US3] Create GitHub Actions workflow file `.github/workflows/test-and-deploy.yml`
- [ ] T020 [US3] Configure CI pipeline to spin up PostgreSQL service container and run Prisma migrations
- [ ] T021 [US3] Add steps in pipeline to install dependencies and execute `npm run test`
- [ ] T022 [US3] Add steps in pipeline to run `npm run test:e2e`
- [ ] T023 [US3] Configure branch protection/blocking rules on deployment failure in the workflow

### Phase 6: Polish

- [ ] T024 Audit test speeds and apply test parallelization enhancements
- [ ] T025 Mock external dependencies (e.g. R2 storage or Supabase) in `tests/setup.ts` or specifically within `tests/e2e` to stabilize network failures

## 🔄 Dependencies & Execution Order

1. **Setup & Foundational** (T001-T009) must complete first.
2. **Phase 3 (Unit)** and **Phase 4 (E2E)** can be partially developed in parallel.
3. Component tests (T011) and E2E browsing (T015) can be built independently.
4. **Phase 5 (CI/CD)** relies on all test commands working smoothly.

- **Parallel Executables**: Component tests + E2E storefront tests + CI Workflow definition.
