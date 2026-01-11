---
description: Prepare for release
agent: build
---

Prepare the ops-toolkit project for a new release.

Complete these steps:

1. Check if all tests pass: !`bun test`
2. Run type checking: !`bun run typecheck`
3. Run lint and fix issues: !`bun run lint:fix`
4. Review recent changes: !`git log --oneline -5`

Based on the changes, suggest:

- Proper conventional commit message type (feat, fix, refactor, docs, etc.)
- Version bump type (major, minor, patch)
- Any additional documentation updates needed
- Breaking changes that need to be mentioned

After review, use:

- `bun run release` - Standard patch release
- `bun run release:minor` - Minor feature release
- `bun run release:major` - Major breaking change release

Ensure the changelog is properly updated and commit messages follow the project's conventional commits format.
