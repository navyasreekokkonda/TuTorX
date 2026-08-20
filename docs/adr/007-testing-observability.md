# ADR 007: Observability & Testing Strategy

## Status
Accepted

## Context
Production AI systems require visibility into both application errors and LLM performance (latency, token consumption, provider failures). Without structured logging and request IDs, debugging distributed issues across edge middleware, route handlers, and AI providers was difficult.

## Decision
1. **Structured JSON Logging (`shared/lib/logger.js`)**: Replaced raw `console.log` with level-based structured logging (`logger.info`, `logger.error`). Logs include timestamps, request IDs, user IDs, and context metadata.
2. **Health Probe (`/api/health`)**: Liveness/readiness endpoint checks MongoDB connectivity and AI provider configuration status for infrastructure monitors.
3. **Automated Verification**: Build verification (`npx next build`) acts as our continuous integration gate ensuring zero syntax or type regressions.

## Consequences
### Positive
- Instant traceability: every request can be correlated across log streams via `requestId`.
- Operational readiness: `/api/health` enables automated load balancer health checks.

### Negative
- Developers must remember to pass context loggers into deep service layers.
