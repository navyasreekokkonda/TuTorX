# ADR 005: AI Gateway & Provider Abstraction

## Status
Accepted

## Context
TutorX relies heavily on multiple LLM providers (Groq for fast 70B generation, Gemini for multi-modal and large context tasks). Calling provider SDKs directly inside individual API handlers led to code duplication, zero cost visibility, vulnerability to prompt injection, and application downtime whenever a single provider experienced API outages or rate limiting.

## Decision
All AI completions must pass through the **AI Gateway (`shared/lib/ai/Gateway.js`)**:
1. **Provider Abstraction**: Standardized `BaseProvider` interface implemented by `GroqProvider` and `GeminiProvider`.
2. **Security & Guardrails**: Automatic prompt inspection via `PromptGuard` before transmission to any LLM.
3. **Resilience**: Exponential backoff retry loop with automatic provider fallback (e.g. Groq → Gemini).
4. **Observability**: Token estimator and `CostTracker` logging USD cost estimates per user and model.
5. **Caching**: Response caching via `CacheManager` to eliminate redundant generation costs.

## Consequences
### Positive
- Zero vendor lock-in: switching models or adding OpenAI takes <20 lines in a new provider class.
- High resilience: rate limits or outages on one provider don't crash user workflows.
- Financial control: clear logs of token spend across different platform features.

### Negative
- Slightly higher overhead when routing through gateway abstraction layers.
