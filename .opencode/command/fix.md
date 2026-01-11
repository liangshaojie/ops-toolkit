---
description: Fix code issues and run checks
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Fix the following code issue: $ARGUMENTS

Analyze the problem and provide a solution that:

1. Follows TypeScript strict mode
2. Includes proper error handling
3. Uses project's utilities (chalk for colors, etc.)
4. Passes ESLint checks
5. Passes type checking

After fixing, run these checks to verify:

- `bun run typecheck` - TypeScript type checking
- `bun run lint:fix` - ESLint auto-fix
- `bun test` - Run tests if applicable

Make sure the fix doesn't break existing functionality.
