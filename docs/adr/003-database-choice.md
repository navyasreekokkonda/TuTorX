# ADR 003: Database & Repository Pattern

## Status
Accepted

## Context
TutorX generates dynamic learning materials (courses, flashcards, quizzes, study notes) via AI LLMs. The schema of AI responses can vary or evolve rapidly. At the same time, direct Mongoose calls inside API endpoints prevented caching and database portability.

## Decision
1. We retain **MongoDB** (via Mongoose) as our primary document store due to its natural fit for deeply nested JSON documents (chapters → topics → content blocks → quizzes).
2. All database interactions are routed through a **Repository Pattern** (`BaseRepository`, `CourseRepository`, etc.).

## Consequences
### Positive
- Flexible document structure perfect for AI-generated artifacts.
- Repositories provide a single interception point for caching (via `CacheManager`) and auditing.
- Swapping to PostgreSQL for relational features later only requires rewriting repository classes, keeping services untouched.

### Negative
- Document databases require careful indexing to prevent slow queries on user-scoped lookups.
