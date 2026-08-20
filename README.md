# TutorX AI: Next-Generation Engineering & Research Ecosystem 

**TutorX AI** is a state-of-the-art, production-grade AI-powered learning, code practice, and research platform. Designed with **LeetCode, Take U Forward (TUF), and HackerRank** standards, it bridges the gap between structured academic learning, deep document analysis (**NotebookLLM**), and hands-on algorithm training.

---

## Key Platform Modules & Features

### 1.  AI Course & Curriculum Studio
- **Dynamic Multi-Chapter Generation**: Enter any topic (e.g., *Distributed Systems*, *System Design*, *Advanced React*) to generate comprehensive curriculums with multiple chapters and topics.
- **Rich Multimedia & Practice Integration**: Every topic includes curated theory, relevant YouTube lectures, interactive quizzes, **AI Flashcards**, and embedded live **Practice Workspaces**.
- **Resume Learning Pill**: Smart progress tracking (`userProgress` & `localStorage`) that instantly restores exact chapter and topic positions with a single click.

### 2.NotebookLLM Research Studio (With Interactive Sliders)
- **Dual-Pane Sliding Workspace**: Adjust the visual ratio between Document Notes and the Research Hub using an interactive **Split Ratio Slider** (`40% to 75%`).
- **Text Scale Slider**: Customize typography size on the fly (`12px to 20px`) for comfortable reading during extended study sessions.
- **Sliding Pill Navigation**: Switch effortlessly between **Assistant & Chat**, **Executive Summary**, **Deep Insights (Explain Section)**, and **Neural Knowledge Cards**.
- **High-Resilience Chat Assistant**: Real-time contextual document Q&A backed by Google Gemini with **automatic analytical fallbacks** so the chat never drops or throws 500 errors.
- **Multilingual & Accessibility Tools**: Built-in translation to **Hindi** and **Telugu**, plus browser-native **Text-to-Speech (TTS)**.

### 3.AI Practice Lab (LeetCode / TUF / HackerRank Workspace)
- **Interactive Pattern Target Grid**: Select from high-frequency FAANG target patterns including **Sliding Window, Two Pointers, Dynamic Programming, Graphs & BFS/DFS, Trees & BST, and Binary Search**.
- **Customizable Intensity & Difficulty**: Use smooth sliders to pick problem counts (`1 to 10 sprint problems`) and logic difficulty tiers (`Easy Warmup`, `Medium Standard`, `Hard FAANG`).
- **Live Code Execution Engine**: Remote or multi-language code evaluation (`JavaScript`, `Python`, `Java`) with real-time console output, sample test cases, and instant submission verification.

### 4.Frictionless Guest Sandbox (`/demo`)
- **Pre-Seeded Demo Experience**: Explore the complete dashboard, pre-generated DSA courses, and Notebooks without signing in.
- **Automatic Fallback Capabilities**: Operates seamlessly via pre-loaded mock sessions when database queries or external AI APIs are unreachable.

---

## System Architecture & Engineering Excellence

```
+-----------------------------------------------------------------------------+
|                                FRONTEND LAYER                               |
|   Next.js  (App Router) + Tailwind CSS + Lucide Icons + React Markdown    |
+--------------------------------------+--------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                               MIDDLEWARE & API                              |
|       Clerk Auth + Sliding Window Rate Limiter + Defensive API Handler      |
+--------------------------------------+--------------------------------------+
                                       |
                    +------------------+------------------+
                    |                                     |
                    v                                     v
+--------------------------------------+  +-----------------------------------+
|            AI ENGINE LAYER           |  |          DATA STORAGE LAYER       |
|    Google Gemini Pro / Flash AI      |  |     MongoDB + Mongoose ODM        |
|  (With In-Memory & Mock Fallbacks)   |  |   (Courses, Notebooks, Sessions)  |
+--------------------------------------+  +-----------------------------------+
```

### Security & Production Hardening
- **Multi-Tier Rate Limiting**: Built-in sliding-window rate limiters across `AI_GENERATION`, `CODE_EXECUTION`, and `AUTH_SENSITIVE` endpoints to prevent denial-of-service and API abuse.
- **Defensive Error Boundaries**: Centralized `apiHandler` catches all runtime errors, returning standardized JSON payloads (`{ success: boolean, data?: any, error?: string }`).
- **Input Validation & Sanitization**: Strict boundary and type verification before interacting with Mongoose schemas or prompt pipelines.

### Tier Management & Quotas
- **Free Tier Constraints**: Enforces strict quotas (`Max 2 Courses`, `Max 2 AI Practice Questions`) to optimize API costs and server stability.
- **Pro & Guest Overrides**: Smooth upgrade prompts and bypass capabilities for guest evaluation (`demo_user_123`).

---

## Repository Structure

```bash
├── app/
│   ├── (auth)/             # Clerk Authentication pages (sign-in, sign-up)
│   ├── api/                # Modular Serverless API routes
│   │   ├── ai/             # Problem generation, code execution, sessions
│   │   ├── course/         # Course completion & topic tracking
│   │   ├── notebook/       # Notebook creation, chat, explanation
│   │   └── progress/       # User learning progress endpoints
│   ├── components/         # Global header, sidebar, and status widgets
│   ├── course/[id]/        # Dynamic multi-chapter course viewer & roadmap
│   ├── dashboard/          # Main user dashboard & AI Practice Lab
│   ├── notebook/           # NotebookLLM research studio workspace
│   └── demo/               # Frictionless Guest Sandbox experience
├── components/
│   ├── ai-practice/        # AIPracticeForm, ProblemDisplay, CodeTerminal
│   └── ui/                 # Atomic design tokens and reusable widgets
├── controllers/            # Business logic layer (aiController, etc.)
├── models/                 # Mongoose database schemas
├── services/               # External abstractions (aiService, judgeService)
├── shared/
│   └── lib/                # Database connection (`db.js`), rate-limiting (`rateLimit.js`), error handling
└── docs/                   # Architectural & technical design documentation
```

---

## Local Development & Setup

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **MongoDB** cluster URI (MongoDB Atlas or local instance)
- **Clerk Authentication** publishable & secret keys
- **Google Gemini API Key** (`GEMINI_API_KEY`)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/tutorx-ai.git
cd tutorx-ai

# Install dependencies
npm install
```

### 3. Environment Variables (`.env.local`)
Create a `.env.local` file in the root directory:
```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database (MongoDB)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/tutorx?retryWrites=true&w=majority

# AI Engine (Google Gemini)
GEMINI_API_KEY=AIzaSy...

# Optional Code Runner (Judge0)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-rapidapi-key
```

### 4. Running Locally
```bash
# Start the Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build Verification
To verify zero TypeScript, linting, or Next.js build errors:
```bash
npm run build
```
The build produces optimized static and dynamic routes powered by Next.js 16 (Turbopack).

---

## Design Aesthetics & UI Tokens
- **Surface Palette**: Deep Obsidian (`#0a0a0c`), Charcoal (`#121216`), and Dark Elevate (`#18181d`).
- **Accent Tokens**: Vibrant Electric Orange (`#f97316` / `orange-500`) with subtle glow rings (`shadow-[0_0_25px_rgba(249,115,22,0.15)]`).
- **Interactive Controls**: Capsule and pill-shaped input boundaries (`rounded-full`) with crisp `text-xs` font hierarchies and smooth CSS transition states.

---
*Built with ❤️ for engineers, researchers, and competitive programmers.*
