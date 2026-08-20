# ADR 006: Streaming vs Caching & Queue-Ready Architecture

## Status
Accepted

## Context
AI generations (especially full 5-chapter courses with 15+ topics via Llama-3.3-70B) can take 8–15 seconds to generate. When running synchronously over HTTP without streaming or asynchronous queue processing, users face long loading spinners and timeouts on edge serverless functions.

## Decision
1. **Caching Layer First**: Before triggering any LLM generation, `executeAIGateway` checks `CacheManager`. If an identical prompt/topic was generated recently, it returns instantly (<5ms).
2. **Queue-Ready Asynchronous Architecture**: Heavy operations (PDF Document Analysis & Full Course Generation) are decoupled into isolated handler functions (`executeAIGateway`). When scaling beyond single-instance deployment, these handlers can be dropped into a Redis/BullMQ or AWS SQS background worker without rewriting business logic.
3. **Optimistic UI Feedback**: Client components render step-by-step progress bars ("Analyzing Document → Distilling Knowledge → Generating Topics") to maintain perceived performance during generation.

## Consequences
### Positive
- Prevents redundant LLM API costs through TTL caching.
- Architecture is prepared for async background job workers without breaking API contracts.

### Negative
- Caching dynamic AI output requires thoughtful TTL tuning so content doesn't become stale.
