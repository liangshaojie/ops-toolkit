# OpenCode Configuration for ops-toolkit

## Project Overview

**Type**: Bun + TypeScript CLI toolkit  
**Purpose**: DevOps CLI tool with terminal UI  
**Tech Stack**: Bun, TypeScript, Commander, Chalk, OpenTUI  
**Entry Point**: `src/index.ts`  
**Debug Entry**: Use `bun --watch src/index.ts` for development, `tsx` for debugging

## Essential Commands

### Development

```bash
bun run dev          # Run in watch mode (use this for active development)
bun run start        # Run once
bun run build        # Build for production
```

### Code Quality

```bash
bun run lint         # Run ESLint
bun run lint:fix     # Auto-fix linting issues
bun run format       # Format code with Prettier
bun run typecheck    # TypeScript type checking
```

### Testing

```bash
bun test             # Run all tests
```

### Git & Release

```bash
bun run release              # Create release with changelog
bun run release:minor        # Minor version bump
bun run release:major        # Major version bump
```

## Code Style & Conventions

### Commit Message Format

Must follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

**Note**: Commit messages are automatically linted. Body lines must be ≤72 characters.

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules (auto-fix available)
- Use Prettier for formatting
- No console.log in production code (use Logger utils when available)
- Error handling with try-catch in async functions
- Use chalk for colored terminal output

### File Structure

```
src/
├── index.ts          # Main CLI entry point
├── commands/         # CLI command implementations
├── components/       # UI components
├── utils/            # Utility functions
└── types/            # TypeScript type definitions
```

## Development Workflow

### When Adding New Features

1. Create command handler in `src/commands/`
2. Add CLI command in `src/index.ts`
3. Write tests (if applicable)
4. Run `bun run typecheck` and `bun run lint`
5. Test manually with `bun run dev`

### When Fixing Bugs

1. Identify the issue location
2. Create a fix
3. Run `bun run typecheck` and `bun run lint:fix`
4. Test the fix manually

### Debugging

1. Use `ts-node` or `tsx` for debugging with VS Code
2. Breakpoints can be set in `.ts` files directly
3. Use F5 or the "Run and Debug" panel in VS Code
4. The launch.json is configured for tsx debugging

## Important Notes

- **Never commit secrets or credentials**
- **Always run lint:fix before committing** (handled automatically by husky)
- **Use Bun as the runtime** (not Node)
- **The bin entry is `bin/ops-toolkit.ts`** (not src/index.ts)
- **TypeScript is configured with strict mode** - all types must be defined
- **Husky pre-commit hooks run lint-staged** automatically

## Common Tasks

### Add a new CLI command

```bash
# 1. Create command file
touch src/commands/mycommand/index.ts

# 2. Implement the command handler
# Follow existing command patterns

# 3. Register in src/index.ts
program
  .command('mycommand')
  .description('Description here')
  .action(async () => {
    // Implementation
  });
```

### Add a new dependency

```bash
# Runtime dependency
bun add <package>

# Dev dependency
bun add -d <package>
```

### Run type checking only

```bash
bun run typecheck
```

### Format all files

```bash
bun run format
```

## VS Code Shortcuts

Recommended VS Code extensions:

- Bun (oven.bun-vscode)
- TypeScript (ms-vscode.vscode-typescript-next)
- ESLint (ms-vscode.vscode-eslint)
- Prettier (esbenp.prettier-vscode)

Useful shortcuts:

- `Cmd+Shift+B` - Build project
- `F5` - Start debugging
- `Cmd+Shift+F` - Format document
- `Cmd+Shift+P` then "ESLint: Fix all auto-fixable Problems"

## Testing Strategy

Tests are run with `bun test`. When adding features:

- Unit tests for utility functions
- Integration tests for CLI commands
- Test edge cases and error conditions

## Performance Notes

- Bun is used as runtime for performance
- Avoid blocking operations in event loop
- Use async/await for all I/O operations
- Optimize large file operations

## Error Handling Pattern

Always handle errors in async operations:

```typescript
try {
  // Your code here
} catch (error) {
  console.error(chalk.red('❌ Error:'), error);
  process.exit(1);
}
```

## Quick Reference

| Task             | Command             |
| ---------------- | ------------------- |
| Start dev server | `bun run dev`       |
| Build project    | `bun run build`     |
| Run tests        | `bun test`          |
| Type check       | `bun run typecheck` |
| Lint and fix     | `bun run lint:fix`  |
| Format code      | `bun run format`    |
| Debug            | F5 in VS Code       |

## OpenCode Custom Commands

The project includes custom OpenCode commands for faster development. These commands are available in `.opencode/command/` directory:

### Available Commands

- `/add-cmd <name>` - Add a new CLI command
- `/fix <issue>` - Fix code issues with automated checks
- `/test` - Run and analyze test suite
- `/release` - Prepare project for release
- `/review <location>` - Review code changes
- `/build` - Build and verify project
- `/add-pkg <package>` - Add a new dependency
- `/debug <issue>` - Get debugging help

### Usage Examples

```bash
# Add a new command
/add-cmd backup

# Fix an issue
/fix monitor command error

# Run and analyze tests
/test

# Prepare for release
/release

# Review code
/review src/utils/logger.ts

# Build and verify
/build

# Add dependency
/add-pkg axios

# Get debugging help
/debug async function not awaiting
```

### Documentation

See `.opencode/README.md` for detailed documentation of all custom commands.

### Creating Custom Commands

To create your own commands:

1. Create a `.md` file in `.opencode/command/`
2. Use YAML frontmatter for configuration
3. Use `$ARGUMENTS` for command arguments
4. Use `!`command`` for shell output
5. Use `@filename` for file references

Example:

```yaml
---
description: My custom command
agent: build
---
My prompt template with $ARGUMENTS
```
