# Publishing to npm

## Quick Start

To publish a new version to npm, run one of the following commands:

```bash
# Patch version (bug fixes): 1.2.1 → 1.2.2
bun run publish:patch

# Minor version (new features): 1.2.1 → 1.3.0
bun run publish:minor

# Major version (breaking changes): 1.2.1 → 2.0.0
bun run publish:major
```

## What Happens When You Publish

The `publish:*` commands automatically:

1. **Quality Checks**
   - Run ESLint to check code quality
   - Run TypeScript type checking

2. **Version Bump**
   - Increment version number in package.json
   - Create git tag (e.g., v1.2.2)
   - Create git commit with changelog

3. **Build**
   - Build the project
   - Generate distribution files in `dist/`

4. **Changelog**
   - Update CHANGELOG.md with changes
   - Based on git commit history

5. **Publish**
   - Publish package to npm registry
   - Create GitHub release
   - Push git tags and commits to remote

## Prerequisites

Before publishing, make sure:

1. **Code is committed**
   - All changes are committed to git
   - Working directory is clean

2. **Tests pass**

   ```bash
   bun test
   ```

3. **Build succeeds**

   ```bash
   bun run build
   ```

4. **You're logged in to npm**
   ```bash
   npm login
   ```

## Version Guidelines

### Patch (bug fixes)

```bash
bun run publish:patch
```

Use for:

- Bug fixes
- Small improvements
- Non-breaking changes
- Documentation updates

### Minor (new features)

```bash
bun run publish:minor
```

Use for:

- New features
- Backwards compatible changes
- Adding functionality

### Major (breaking changes)

```bash
bun run publish:major
```

Use for:

- Breaking changes
- API changes
- Removing features

## Troubleshooting

### "Git working directory not clean"

```bash
# Commit your changes first
git add .
git commit -m "your commit message"
```

### "403 Forbidden - You cannot publish over previously published versions"

This means the version already exists on npm. The publish commands will automatically bump the version, so you shouldn't see this error.

### Build errors

```bash
# Check build output
bun run build

# Fix any errors, then try publishing again
bun run publish:patch
```

## Manual Publishing

If you need more control, you can use `release-it` directly:

```bash
# Interactive release
npx release-it

# Specific version
npx release-it 1.2.5

# Skip git operations
npx release-it --no-git --no-github
```

## After Publishing

Once published, users can install your package:

```bash
# Global installation
npm install -g ops-toolkit

# Or using bun
bun install -g ops-toolkit

# Run the CLI
ops --help
```

## Configuration

Publishing behavior is configured in `.release-it.json`:

- **Git**: Automatic commits and tags
- **NPM**: Automatic publishing to public registry
- **GitHub**: Automatic releases
- **Hooks**: Pre-publish checks and post-build actions
- **Changelog**: Auto-generated from commit history

For more details, see [release-it documentation](https://github.com/release-it/release-it).
