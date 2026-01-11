---
description: Get help with debugging
agent: build
---

Help debug the following issue: $ARGUMENTS

Debugging approach:

1. **Analyze the error**
   - Identify error type and message
   - Locate where the error occurs
   - Check stack trace if available

2. **Check common issues**
   - Missing dependencies
   - Type errors
   - Async/await issues
   - Missing error handling

3. **Suggest debugging steps**
   - Add appropriate breakpoints or console.log statements
   - Verify input/output values
   - Check environment variables

4. **Provide fix**
   - Write corrected code
   - Ensure proper error handling
   - Add comments explaining the fix

5. **Verify fix**
   - Run `bun run typecheck`
   - Run `bun run lint:fix`
   - Test the fix manually if possible

Focus on providing a clear explanation of what went wrong and how to prevent similar issues in the future.
