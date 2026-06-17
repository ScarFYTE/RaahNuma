# Agent Configuration for RaahNuma

## Lint/Format Commands
- `npm run lint` - Run ESLint on the codebase

## Environment Variables Required
- `VITE_AI_PROVIDER` - AI provider to use (`gemini` for production, `mock` for offline demo)
- `VITE_GEMINI_API_KEY` - Gemini API key (required when `VITE_AI_PROVIDER=gemini`)
- `VITE_GEMINI_MODEL` - Gemini model (optional, defaults to `gemini-2.0-flash`)
