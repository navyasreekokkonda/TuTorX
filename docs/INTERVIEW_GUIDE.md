# TutorX — Staff Architect Interview Q&A Guide

Use this guide when explaining technical trade-offs and architectural choices in software engineering or system design interviews.

---

### Q1: Why did you choose Next.js 16 App Router over a separate React SPA + Node/Express backend?
**Answer:**
We needed seamless full-stack type safety, server-side rendering (SSR) for initial dashboard load speed, and edge middleware capabilities. Next.js App Router allows us to co-locate backend API route handlers (`app/api/...`) with frontend views while leveraging React Server Components. Furthermore, using Next.js 16 Edge Proxy (`proxy.jsx`) allows us to authenticate requests at the CDN edge before they ever spin up serverless compute instances.

---

### Q2: How do you handle third-party AI provider reliability and rate limits?
**Answer:**
Calling LLM providers directly in business logic creates a single point of failure and vendor lock-in. We designed an **AI Gateway (`shared/lib/ai/Gateway.js`)** that implements the Command pattern and Strategy pattern (`BaseProvider`, `GroqProvider`, `GeminiProvider`). 
When a request enters the Gateway:
1. It is checked against an in-memory TTL cache (`CacheManager`).
2. If uncached, it runs through `PromptGuard` to sanitize adversarial prompt injections.
3. It attempts generation via our primary low-latency inference provider (Groq Llama-3.3-70B) with exponential backoff.
4. If rate-limited (HTTP 429) or unavailable (HTTP 503), the Gateway catches the failure and transparently falls back to Google Gemini Flash.
5. Every execution logs token consumption to our `CostTracker` for observability.

---

### Q3: Why use MongoDB instead of PostgreSQL for an enterprise platform?
**Answer:**
While relational databases excel at structured tabular transactions, our AI platform generates dynamic educational artifacts where hierarchical document depth varies significantly. A single course contains chapters, each containing topics, each containing heterogeneous content blocks (`heading`, `text`, `code`), flashcards, and quizzes. Storing this in PostgreSQL would require joining 4–5 tables per course load. MongoDB allows atomic storage and retrieval of the entire course aggregate root in a single read operation. To ensure architectural portability, we wrapped Mongoose inside a **Repository Pattern (`BaseRepository`)**, making future migrations or caching layer additions trivial.

---

### Q4: How did you remediate security vulnerabilities during the repository transformation?
**Answer:**
During our security audit (`docs/security-audit.md`), we discovered several high-risk patterns:
1. The middleware file was misnamed or deprecated, leaving route protection unapplied. We standardized on `proxy.jsx`.
2. Client fetch calls were sending spoofable `x-user-id` headers. We stripped client header reliance and enforced cryptographic verification via `await auth()` inside route handlers wrapped by our higher-order `apiHandler`.
3. API keys were exposed in client bundles (`NEXT_PUBLIC_RAPIDAPI_KEY`). We confined sensitive credentials to server-only validation arrays (`lib/config/env.js`).
4. AI endpoints lacked rate throttling. We implemented sliding-window rate limiters tailored to endpoint expense (`RATE_LIMITS.AI_GENERATION`).
