# TutorX — Security Audit Report

> **Date:** 2026-07-01  
> **Scope:** Full application security review  
> **Status:** Sprint 1 fixes applied

---

## Summary

| Category | Before | After Sprint 1 |
|----------|--------|----------------|
| Middleware enforced | ❌ No (file misnamed) | ✅ Yes (`middleware.js`) |
| Security headers | ❌ None | ✅ 6 headers configured |
| Client-exposed secrets | ❌ `NEXT_PUBLIC_RAPIDAPI_KEY` | ⚠️ Still in .env.local — needs manual removal |
| Rate limiting | ❌ None | ✅ Utility created (needs integration in Sprint 3) |
| Environment validation | ❌ None | ✅ Fail-fast validation added |
| Health endpoint | ❌ None | ✅ `/api/health` added |

---

## Findings & Remediations

### 1. Authentication Middleware (CRITICAL — FIXED)
- **Finding:** `proxy.jsx` was ignored by Next.js — no routes were protected
- **Fix:** Renamed to `middleware.js` at project root
- **Status:** ✅ Fixed

### 2. Security Headers (HIGH — FIXED)
- **Finding:** No security headers configured
- **Fix:** Added X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, Permissions-Policy, disabled x-powered-by
- **Status:** ✅ Fixed

### 3. Client-Exposed API Key (CRITICAL — PARTIALLY FIXED)
- **Finding:** `NEXT_PUBLIC_RAPIDAPI_KEY` exposes Judge0 API key in client bundle
- **Fix:** Created `.env.example` without the public prefix. Actual `.env.local` needs manual update.
- **Action Required:** Rename `NEXT_PUBLIC_RAPIDAPI_KEY` to just `RAPIDAPI_KEY` in `.env.local`
- **Status:** ⚠️ Requires manual env update

### 4. Unprotected API Routes (CRITICAL — Sprint 3)
Routes missing `auth()` checks:
- `POST /api/notebook/save` — accepts ANY JSON, no userId verification
- `GET /api/notebook/list` — returns ALL users' notebooks
- `POST /api/notebook/chat` — anyone can use AI at your cost
- `POST /api/notebook/section-explain` — no auth
- `GET /api/goals` — uses spoofable `x-user-id` header
- `PATCH /api/goals` — no userId verification
- `POST /api/translate` — no auth
- `GET /api/roadmap` — no auth (low risk, global data)
- **Status:** 🔲 Planned for Sprint 3

### 5. Input Validation (HIGH — Sprint 3)
- No request body validation on any endpoint
- NoSQL injection possible via unvalidated MongoDB queries
- **Status:** 🔲 Planned for Sprint 3

### 6. Rate Limiting (HIGH — PARTIALLY FIXED)
- **Finding:** No rate limiting on AI-heavy endpoints
- **Fix:** Rate limiting utility created with preset limits
- **Status:** ⚠️ Utility created, needs integration

### 7. CORS (MEDIUM — Sprint 3)
- No explicit CORS configuration
- **Status:** 🔲 Planned

### 8. Prompt Injection (MEDIUM — Sprint 4)
- User input passed directly into AI prompts without sanitization
- **Status:** 🔲 Planned for Sprint 4 (AI Gateway)

### 9. File Upload Security (MEDIUM — Sprint 4)
- PDF uploads not scanned for malicious content
- No file size limits visible
- **Status:** 🔲 Planned

### 10. Credential Exposure (CRITICAL — Manual Action Required)
- `.env.local` contains real API keys
- `.gitignore` covers `.env*` — verify not in git history
- **Action:** Run `git log --all --full-history -- .env.local` to check
- **Status:** ⚠️ Requires manual verification

---

## OWASP Top 10 Assessment

| # | Risk | Status |
|---|------|--------|
| A01 | Broken Access Control | ⚠️ Partial (middleware fixed, route-level auth pending) |
| A02 | Cryptographic Failures | ✅ OK (Clerk handles auth crypto) |
| A03 | Injection | ⚠️ NoSQL injection risk (no validation) |
| A04 | Insecure Design | ⚠️ Architecture improvements planned |
| A05 | Security Misconfiguration | ✅ Fixed (headers, x-powered-by) |
| A06 | Vulnerable Components | 🔲 Need dependency audit |
| A07 | Auth Failures | ⚠️ Middleware fixed, route auth pending |
| A08 | Data Integrity Failures | ⚠️ No input validation |
| A09 | Logging Failures | ✅ Fixed (structured logger added) |
| A10 | SSRF | ✅ Low risk (external API calls controlled) |
