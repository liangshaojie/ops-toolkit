# ops-toolkit

A comprehensive DevOps CLI toolkit with terminal UI built with Bun, TypeScript, and OpenTUI.

## Features

- 🔍 **System Monitoring** - Real-time CPU, memory, and disk usage
- 📋 **Log Management** - View, search, and analyze logs
- 🚀 **Deployment Tools** - Deploy applications with ease
- ⚙️ **System Management** - User and service management
- 🎨 **Terminal UI** - Beautiful interface with OpenTUI

## Installation

```bash
# Install globally
bun add -g ops-toolkit

# Or use npx
npx ops-toolkit
```

## Quick Start

```bash
# Start the interactive UI
ops

# Show system monitoring
ops monitor

# View logs
ops logs

# Deploy application
ops deploy

# System management
ops system
```

## Commands

### Monitor

```bash
ops monitor              # Show system monitoring dashboard
ops monitor system      # System resources
ops monitor processes   # Process monitoring
ops monitor network     # Network monitoring
```

### Logs

```bash
ops logs                 # Interactive log viewer
ops logs view <file>     # View specific log file
ops logs search <query>  # Search logs
ops logs tail <file>     # Tail log file
```

### Deploy

```bash
ops deploy               # Interactive deployment
ops deploy <app>         # Deploy specific application
ops deploy rollback      # Rollback deployment
ops deploy status        # Check deployment status
```

### System

```bash
ops system               # System management menu
ops system users         # User management
ops system services      # Service management
ops system config        # Configuration management
```

## Development

```bash
# Clone the repository
git clone https://github.com/username/ops-toolkit.git
cd ops-toolkit

# Install dependencies
bun install

# Run in development mode
bun run dev

# Build the project
bun run build

# Run tests
bun test

# Lint code
bun run lint

# Format code
bun run format
```

## Configuration

Configuration files are located in `~/.ops-toolkit/`:

```json
{
  "monitor": {
    "refreshInterval": 1000,
    "showProcesses": true
  },
  "logs": {
    "defaultPath": "/var/log",
    "maxLines": 1000
  },
  "deploy": {
    "defaultEnv": "production",
    "backupEnabled": true
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Bun](https://bun.sh/)
- UI powered by [OpenTUI](https://opentui.dev/)
- Inspired by modern DevOps tools
