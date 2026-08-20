# ADR 004: Authentication Strategy (Clerk & Server-Side Enforcement)

## Status
Accepted

## Context
Previously, authentication relied heavily on client-side state and custom headers like `x-user-id` sent from frontend fetch calls. This allowed trivial user ID spoofing and unauthorized access to endpoints like `/api/goals` and `/api/notebook/list`.

## Decision
We standardize on **Clerk (`@clerk/nextjs`)** with server-side session verification:
1. `proxy.jsx` acts as the Next.js middleware protecting routes at the edge.
2. Every API route handler must call `await auth()` from `@clerk/nextjs/server` to extract `userId`.
3. Custom header spoofing (`x-user-id`) is strictly forbidden and rejected.

## Consequences
### Positive
- Zero trust: user identity is cryptographic and verified on every server request.
- Managed user sessions, multi-factor authentication, and organization support out of the box.

### Negative
- Vendor lock-in to Clerk's session token architecture.
