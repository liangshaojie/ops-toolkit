---
description: Add a new CLI command
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Create a new CLI command named $ARGUMENTS for ops-toolkit.

Follow these steps:

1. Create command file in src/commands/$ARGUMENTS/index.ts
2. Implement the command handler with TypeScript
3. Register the command in src/index.ts using commander.js
4. Add type definitions in src/types/ if needed
5. Include error handling with try-catch
6. Use chalk for colored terminal output

Command structure:

```typescript
import { program } from 'commander';
import chalk from 'chalk';

program
  .command('$ARGUMENTS')
  .description('Description here')
  .action(async () => {
    try {
      console.log(chalk.blue('$ARGUMENTS command'));
      // Implementation here
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error);
      process.exit(1);
    }
  });
```

Make sure to follow the project's code style and conventions as defined in AGENTS.md.
