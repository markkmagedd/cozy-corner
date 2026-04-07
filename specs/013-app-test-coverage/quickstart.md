# Quickstart: App Test Coverage

This guide explains how to run the new testing tools in the repository.

## Commands

### Unit and Integration Tests (Vitest)
Run all unit and integration tests:
```bash
npm run test
```

Run unit tests in watch mode (for development):
```bash
npm run test:watch
```

Run test suite with coverage report:
```bash
npm run test:coverage
```

### End-to-End Tests (Playwright)
Install Playwright browsers (first-time only):
```bash
npx playwright install --with-deps
```

Run E2E tests:
```bash
npm run test:e2e
```

View the E2E HTML report:
```bash
npx playwright show-report
```

## Continuous Integration
Any changes pushed to the repository automatically trigger the new GitHub Actions workflows, running the `npm run test` and `npm run test:e2e` commands in a clean environment to block failing code from being merged.
