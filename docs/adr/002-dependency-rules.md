# ADR 002: Strict Architecture Layering & Dependency Rules

## Status
Accepted

## Context
In the legacy codebase, React components directly fetched from third-party APIs, API route handlers directly executed Mongoose database queries, and business logic was intertwined with presentation layers. This caused tight coupling, impossible unit testing without full database integration, and duplication of business rules.

## Decision
We enforce a **Layered Architecture** with strict dependency direction:

```
[ UI Layer ] (Pages / Components)
     ↓
[ Feature Module Layer ] (Feature hooks / Feature components)
     ↓
[ Service Layer ] (Business Logic / Orchestration)
     ↓
[ Repository Layer ] (Data Access / Persistence)
     ↓
[ Database / External API ]
```

### Strict Rules:
1. **Pages and Components NEVER touch Mongoose or MongoDB.** All database queries must pass through a Repository.
2. **No skipping layers.** A Route Handler (`app/api/...`) cannot call a Repository directly; it must invoke a Service.
3. **Repositories are storage-agnostic interfaces.** `CourseRepository` abstracts MongoDB so that migrating to Postgres or adding a Redis cache layer requires zero changes to Service or UI code.

## Consequences
### Positive
- High testability: Services can be unit-tested by mocking Repositories.
- Single responsibility: UI renders data, Services execute business rules, Repositories handle storage queries.
- Future-proof: Easy database swapping or caching insertion.

### Negative
- Requires writing intermediary pass-through functions for simple CRUD operations.
