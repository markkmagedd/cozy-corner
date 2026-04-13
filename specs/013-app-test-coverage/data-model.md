# Data Model: App Test Coverage

No new database entities or schemas are required for adding test coverage to the application. 

However, testing the existing data model requires test seeding utilities.

## Test Data Entities (Virtual)
We will need to generate factories or seed scripts to reliably test the CRUD operations for:
1. `Category`
2. `Product`
3. `User` (if authentication is part of E2E down the road)
