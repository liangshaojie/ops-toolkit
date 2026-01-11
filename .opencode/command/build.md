---
description: Build and verify project
agent: build
---

Build and verify ops-toolkit project.

Run these checks in order:

1. **Type Check**
   Execute: !`bun run typecheck`
   Report any TypeScript errors

2. **Lint**
   Execute: !`bun run lint`
   Report any linting issues

3. **Build**
   Execute: !`bun run build`
   Verify build completes successfully

4. **Test**
   Execute: !`bun test`
   Report any test failures

Summary the results and identify any issues that need to be fixed before deployment.
If all checks pass, confirm the project is ready for production.
