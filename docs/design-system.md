# TutorX — Design System & UI Architecture

## 1. Core Principles
- **Dark-First Aesthetics**: High contrast, vibrant orange/gradient accents against deep obsidian (`#0b0b0c` / `#111113`) backdrops.
- **Glassmorphism & Micro-Interactions**: Subtle borders (`border-white/5`), smooth scaling on hover (`hover:scale-[1.02]`), and smooth transitions (`transition-all duration-300`).
- **Accessibility (A11y)**: Minimum WCAG AA contrast ratio for text and buttons. Interactive elements require distinct focus states (`focus:ring-2 focus:ring-orange-500`).

## 2. Design Tokens
All tokens are managed centrally in `app/globals.css` (`:root` / `@theme inline`):
```css
--background: #0a0a0a;
--foreground: #ededed;
--bg: #0b0b0c;
--bg-card: #111113;
--accent: #f97316; /* Orange 500 */
--border: rgba(255, 255, 255, 0.05);
```

## 3. Reusable UI Primitives
- **Cards**: Surface elevation with `#111113` background and 24px/32px border radius (`rounded-[24px]` / `rounded-3xl`).
- **Buttons**: Primary CTA uses `#ff7a00` (`bg-orange-500 text-black font-bold py-3 px-6 rounded-xl shadow-lg hover:opacity-90 active:scale-95`).
- **Skeletons**: Pulse animated placeholder boxes (`bg-white/5 animate-pulse rounded-xl`) while data is loading.
