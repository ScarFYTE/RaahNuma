# RaahNuma UI Shell

RaahNuma is an AI-powered scholarship and financial aid navigator for undergraduate students in Pakistan. This repository contains the frontend UI shell built with React + Vite, Tailwind CSS, and React Router.

## Project Overview

- Sticky branded header, hero input section, and output cards for scholarship guidance
- Prop-driven component architecture for maintainable future scaling
- Query context and custom hook workflow for centralized state management
- Mock response contract aligned with the backend API schema
- Responsible AI disclaimer and source verification links across output cards

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment template if needed:

   ```bash
   cp .env.example .env
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

## Backend Integration Guide

The frontend expects the backend to provide this contract from `POST /api/v1/query`:

- `query_received` (string)
- `user_profile` (object)
- `preliminary_assessment` (array of scholarship matches)
- `jargon_busters` (array of term/explanation objects)
- `document_checklist` (array of strings)
- `responsible_ai_notice` (string)
- `sources` (array of `{ label, url }`)

Scaffolded integration points:

- `src/api/scholarshipService.js`
  - `submitScholarshipQuery(queryText)`
  - `getAllPrograms()`
- `src/hooks/useScholarshipQuery.js`
  - currently returns mock data
  - contains TODO where real API wiring should replace mock logic

Expected environment variable:

```bash
VITE_API_BASE_URL=http://localhost:8000
```
