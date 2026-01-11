---
description: Review code changes
agent: build
---

Review the code changes in the following location: $ARGUMENTS

Review checklist:

1. **Code Quality**
   - Follows TypeScript best practices
   - Uses proper types (no `any`)
   - Has good error handling
   - Uses project utilities appropriately

2. **Performance**
   - No blocking operations in event loop
   - Efficient use of async/await
   - Proper resource cleanup

3. **Security**
   - No exposed secrets or credentials
   - Proper input validation
   - Safe handling of user input

4. **Style**
   - Follows ESLint rules
   - Uses chalk for terminal output
   - Consistent code style

5. **Testing**
   - Has adequate test coverage
   - Tests cover edge cases
   - Tests are maintainable

Provide specific suggestions for improvements and highlight any issues that need to be addressed before merging.
