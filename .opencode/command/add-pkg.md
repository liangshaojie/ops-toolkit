---
description: Add a new dependency
agent: build
---

Add $ARGUMENTS to the project.

Determine if it's a runtime dependency or dev dependency:

- Runtime: Use `bun add <package>`
- Dev: Use `bun add -d <package>`

After adding:

1. Check package.json for proper installation
2. Update src/index.ts to import and use the package
3. Add type definitions if needed (@types/package)
4. Run `bun run typecheck` to verify types
5. Run `bun run lint:fix` to check for issues
6. Add basic usage example or documentation

Ensure the package is compatible with:

- Bun runtime
- Project's TypeScript version (5.3.3+)
- Node version requirement (18.0.0+)

If the package replaces existing functionality, help refactor the code to use the new package.
