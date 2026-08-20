# Product Requirement Document (PRD) — TutorX AI Platform

## 1. Product Vision
TutorX is an autonomous, enterprise-grade AI learning platform designed to transform passive consumption into interactive mastery. By harnessing multi-provider LLMs (Groq and Google Gemini), TutorX dynamically synthesizes customized learning paths, interactive code practice labs, and intelligent research notebooks from raw user input or PDF documents.

## 2. Target Personas
- **University Students & Researchers**: Need deep analysis and summarization of complex academic PDFs (NotebookLLM feature).
- **Software Engineers & Job Seekers**: Need structured, LeetCode-style algorithmic problem sets with live multi-language code compilation (AI Practice Lab).
- **Self-Directed Learners**: Need structured multi-chapter courses with integrated video tutorials, flashcards, and quizzes.

## 3. Core Functional Requirements

### 3.1 Dynamic Course Generator
- **Input**: Topic title, description, difficulty level (Beginner/Intermediate/Advanced), chapter count (1–10), optional YouTube integration.
- **Output**: Full course JSON hierarchy featuring deep technical sections, code examples, best practices lists, interactive flashcards, and multiple-choice quizzes.
- **Resilience**: Automated JSON validation and retry fallback via AI Gateway.

### 3.2 NotebookLLM Research Hub
- **Document Analysis**: Upload PDF documents or paste raw text (>200 characters) to generate structured summaries, simplified explanations, and flashcards.
- **Interactive Chat**: Ask complex academic queries against uploaded research notes with citation instructions.

### 3.3 AI Practice Lab & Code Execution
- **DSA Problem Generation**: Generate targeted algorithmic challenges based on specific patterns (Sliding Window, Two Pointers, DP).
- **Multi-Language IDE**: Embedded Monaco editor supporting JavaScript, Python, and Java.
- **Sandboxed Compilation**: Secure code execution via Judge0 API against 5 edge test cases.

### 3.4 Goals & Learning Progress
- **Habit Tracking**: Create, complete, and track personal learning objectives.
- **Course Telemetry**: Automated topic completion tracking and dashboard progress percentage calculation.
