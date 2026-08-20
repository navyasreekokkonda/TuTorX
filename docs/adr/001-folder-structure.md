# ADR 001: Feature-Driven Folder Structure

## Status
Accepted

## Context
The previous folder structure mixed components, hooks, and services flatly under root or `app/` directories. As the application grew, this created severe maintainability problems:
1. Files related to a single business capability (e.g. Course Generation) were scattered across `app/api/`, `app/components/`, `services/`, and `models/`.
2. Pages became massive 800+ line monoliths importing dozens of disconnected components.
3. Code ownership and modular boundaries were unclear.

## Decision
We adopt a **Feature-Driven Architecture** combined with Next.js App Router conventions:

- `app/` handles routing, layouts, and page entry points ONLY.
- `features/<feature-name>/` encapsulates all domain-specific logic, components, services, and hooks for that capability.
- `shared/` contains cross-cutting concerns (database connection, logging, UI primitives, generic hooks).

Example feature boundary:
```
features/course-generator/
├── components/
├── hooks/
├── services/
├── types/
└── validators/
```

## Consequences
### Positive
- High cohesion: all code required to understand or modify a feature lives in one directory.
- Reduced merge conflicts across engineering teams working on different features.
- Easier extraction into micro-frontends or packages if needed later.

### Negative
- Slightly deeper import paths when crossing feature boundaries.
- Requires strict enforcement so developers don't revert to putting domain logic inside `shared/` or `app/`.
