# 🐛 Debugging Guide for ops-toolkit

This guide shows you how to debug the ops-toolkit CLI application using various debugging methods.

## 🔧 VS Code Debugging (Recommended)

### 1. Install VS Code Extensions

Make sure you have these extensions installed:

- **Bun** (`oven.bun-vscode`)
- **TypeScript** (`ms-vscode.vscode-typescript-next`)
- **ESLint** (`ms-vscode.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)

### 2. Set Breakpoints

Open any TypeScript file and click in the gutter to set breakpoints:

```typescript
// Example: src/commands/monitor/index.ts
.action(async (_options: MonitorOptions) => {
  debugger; // ← Click here to set breakpoint
  console.log(chalk.blue('📊 System Monitor'));
});
```

### 3. Start Debugging

- Press `F5` or go to **Run and Debug** panel
- Select "Debug CLI (ops-toolkit)" from the dropdown
- Click the green play button ▶️

### 4. Available Debug Configurations

#### **Debug CLI (ops-toolkit)**

- Runs the CLI without arguments
- Full debugging support
- Break on startup

#### **Debug CLI with arguments**

- Runs `ops monitor` command
- Perfect for testing specific commands

#### **Debug TypeScript file directly**

- Debug any TypeScript file
- Select file from prompt

## 🚀 Command Line Debugging

### Method 1: Bun Inspector

```bash
# Start debugging server
bun run debug


# Connect to Chrome DevTools
# Open Chrome and go to: chrome://inspect
```

### Method 2: Node Inspector

```bash
# Start with node inspector
bun --inspect-brk bin/ops-toolkit.ts

# This will wait for debugger to connect
```

## 📍 Breakpoint Strategies

### 1. Entry Points

```typescript
// bin/ops-toolkit.ts
async function main() {
  debugger; // ← Program startup
  // ... code
}
```

### 2. Command Handlers

```typescript
// src/commands/monitor/index.ts
.action(async (_options: MonitorOptions) => {
  debugger; // ← Command execution
  console.log(chalk.blue('📊 System Monitor'));
});
```

### 3. Utility Functions

```typescript
// src/utils/system.ts
static async getProcessList(): Promise<any[]> {
  debugger; // ← Utility function entry
  try {
    const platform = os.platform();
    // ... code
  }
}
```

### 4. Error Handling

```typescript
// bin/ops-toolkit.ts
process.on('uncaughtException', error => {
  debugger; // ← Error breakpoint
  console.error(chalk.red('❌ Uncaught Exception:'), error);
});
```

## 🔍 Chrome DevTools Integration

### 1. Start with Inspector

```bash
bun --inspect-brk bin/ops-toolkit.ts
```

### 2. Open Chrome DevTools

1. Open Chrome
2. Go to `chrome://inspect`
3. Find "Node.js" target
4. Click "inspect"

### 3. Debugging Features

- **Breakpoints**: Set/clear breakpoints
- **Call Stack**: Navigate function calls
- **Variables**: Inspect local and global variables
- **Console**: Execute code in context
- **Network**: Monitor network requests

## 🐛 Common Debugging Scenarios

### Debug CLI Argument Parsing

```typescript
// bin/ops-toolkit.ts
// Set breakpoint here to inspect parsed arguments
const options = program.opts();
debugger;
console.log('CLI Options:', options);
```

### Debug Error Conditions

```typescript
// src/utils/system.ts
static async execCommand(command: string): Promise<string> {
  try {
    debugger; // ← Debug before execution
    const { stdout } = await execAsync(command);
    return stdout.trim();
  } catch (error) {
    debugger; // ← Debug error handling
    throw new Error(`Command execution failed: ${command}`);
  }
}
```

## 🛠️ Advanced Debugging

### 1. Conditional Breakpoints

```typescript
if (process.env.DEBUG && someCondition) {
  debugger; // Only breaks when condition is true
}
```

### 2. Log Point Breakpoints

```typescript
// Instead of breaking, just log values
console.log('🐛 Debug Value:', someVariable);
// debugger; // Uncomment to actually break
```

### 3. Async Debugging

```typescript
async function asyncOperation() {
  debugger; // ← Break before async operation
  const result = await someAsyncCall();
  debugger; // ← Break after async operation completes
  return result;
}
```

## 📱 Debugging with Console

### Real-time Variable Inspection

```bash
# Run with debug flag
DEBUG=true bun bin/ops-toolkit.ts monitor
```

### Environment Variables for Debugging

```bash
# Enable verbose logging
NODE_ENV=development DEBUG=* bun bin/ops-toolkit.ts

# Enable specific debug modules
DEBUG=system,config bun bin/ops-toolkit.ts
```

## 🚨 Troubleshooting

### Breakpoints Not Working?

1. Ensure you're running with `--inspect` flag
2. Check that source maps are enabled
3. Verify files are included in tsconfig.json

### Source Maps Issues?

- Files must be included in `tsconfig.json`
- Use `verbatimModuleSyntax: false`
- Ensure proper TypeScript configuration

### Inspector Not Connecting?

1. Check if port 9229 is available
2. Try `--inspect-brk` to wait for connection
3. Verify firewall settings

## 🎯 Pro Tips

1. **Use meaningful variable names** - Makes debugging easier
2. **Add debug logs early** - Instrument code before you need it
3. **Test edge cases** - Debug with invalid inputs
4. **Use conditional breakpoints** - Reduce noise
5. **Document debug findings** - Save insights for later

## 📚 Additional Resources

- [Bun Debugging Documentation](https://bun.sh/docs/debugger)
- [VS Code Debugging Guide](https://code.visualstudio.com/docs/editor/debugging)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [TypeScript Debugging](https://code.visualstudio.com/docs/typescript/typescript-debugging)

---

Happy debugging! 🐛✨
