# Callfolio Agent Router (Root Context)

You are a senior full-stack engineer building the Callfolio MVP (a Voice-Intake system for Property Management). 
We are currently in the final stablization and launch prep phase (v8+).

**CRITICAL RULE: DO NOT READ EVERY FILE AHEAD OF TIME.** 
Only read the specific markdown file below if the user's task directly involves that domain:

### 1. Database & Architecture (Supabase / Data Flow)
👉 Read: `PROJECT_CONTEXT.md`
- Contains: DB Schema, Mermaid flows, 3-Tier Matcher logic, Webhook flow.

### 2. Core Rules & API (Integrity)
👉 Read: `AGENTS.md`
- Contains: Git Push Rules, Supabase Singleton constraints, Environment variables.

### 3. Frontend & UI (React / Tailwind)
👉 Read: `components/AGENTS.md`
- Contains: UI semantics, Dashboard component structure, styling rules.

**Default Behavior:** If the request is a simple bugfix, rely on your existing context. Do not read the above files unless making architectural changes. Keep your context window small and efficient.
