# Agent Configuration for RaahNuma

## Lint/Format Commands
- `npm run lint` - Run ESLint on the codebase

## Environment Variables Required
- `VITE_AI_PROVIDER` - AI provider to use (claude, openai, gemini, ollama, mock)
- `VITE_CLAUDE_API_KEY` - Claude API key (required when VITE_AI_PROVIDER=claude)
- `VITE_CLAUDE_MODEL` - Claude model (optional, defaults to claude-sonnet-4-6)