# System Design Document — TutorX

## 1. System Overview
TutorX is designed as a modular, edge-accelerated Next.js 16 full-stack application backed by MongoDB Atlas and a resilient multi-provider AI Gateway.

## 2. Scale & Traffic Assumptions
- **Daily Active Learners (DAU)**: 10,000
- **Average API Requests / User / Day**: 30 (300,000 requests/day ≈ 3.5 QPS avg, 20 QPS peak)
- **AI Completions / Day**: 20,000 heavy LLM prompts
- **Database Storage Growth**: ~500MB / month (courses, user progress, notebook notes)

## 3. Database Schema Design (MongoDB Document Models)

### Courses Collection (`courses`)
```json
{
  "_id": "ObjectId",
  "userId": "String (Clerk UID)",
  "title": "String",
  "difficulty": "Beginner | Intermediate | Advanced",
  "chapters": [
    {
      "chapterTitle": "String",
      "topics": [
        {
          "title": "String",
          "content": [ { "type": "heading|text|code", "text": "...", "code": "..." } ],
          "flashcards": [ { "question": "...", "answer": "..." } ],
          "quiz": [ { "question": "...", "options": ["..."], "correctAnswer": "..." } ]
        }
      ]
    }
  ],
  "createdAt": "ISODate"
}
```
*Indexes*: `{ userId: 1, createdAt: -1 }`

## 4. Availability & Reliability Engineering
1. **AI Gateway Fallback**: If Groq API throws 429 Too Many Requests or 5xx Server Error, the Gateway catches the exception and immediately dispatches the prompt to Google Gemini Flash.
2. **Exponential Backoff**: Transient network timeouts trigger automatic retries (`retries: 2` with `Math.pow(2, attempt) * 500ms` delay).
3. **Fail-Fast Environment Validation**: `shared/lib/config/env.js` validates required database keys and provider secrets during server startup, preventing runtime crashes.

## 5. Security & Threat Modeling
- **Edge Proxy Verification**: Next.js 16 Proxy convention (`proxy.jsx`) inspects route prefixes before server rendering.
- **Prompt Injection Defense**: `PromptGuard` uses regex heuristics and unicode control character stripping to neutralize adversarial jailbreaks before they reach LLM endpoints.
- **Rate Limiting**: Sliding window in-memory limiter throttles AI generation requests (`10 req/min`) to prevent Denial of Wallet (DoW) attacks.
