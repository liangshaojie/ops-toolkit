#!/usr/bin/env bun

// 调试版本的CLI入口
import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';

// 调试信息
console.log(chalk.yellow('🔍 Debug mode enabled'));
console.log(chalk.gray(`Process ID: ${process.pid}`));
console.log(chalk.gray(`Node version: ${process.version}`));
console.log(chalk.gray(`Platform: ${process.platform}`));
console.log(chalk.gray(`Working directory: ${process.cwd()}`));

// CLI入口点
async function main() {
  console.log(chalk.cyan('\n🎯 Starting ops-toolkit in debug mode...\n'));

  // 显示欢迎信息
  const welcomeText = figlet.textSync('ops-toolkit', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });
  
  console.log(chalk.cyan(welcomeText));

  // 设置CLI程序
  program
    .name('ops')
    .description('A comprehensive DevOps CLI toolkit (Debug Mode)')
    .version('1.0.0-dev');

  // 添加调试选项
  program.option('-d, --debug', 'Enable debug mode', true);
  program.option('-v, --verbose', 'Enable verbose logging', false);

  // 默认启动命令
  program
    .command('ui', { isDefault: true })
    .description('Start interactive terminal UI')
    .action(async () => {
      console.log(chalk.green('🚀 ops-toolkit CLI is running in debug mode!'));
      console.log(chalk.blue('📋 Available commands:'));
      console.log(chalk.white('  ops monitor    - System monitoring'));
      console.log(chalk.white('  ops logs       - Log management'));
      console.log(chalk.white('  ops deploy     - Deployment tools'));
      console.log(chalk.white('  ops system     - System management'));
      console.log(chalk.gray('\n🔧 UI features coming soon...'));
      
      // 调试点：检查程序状态
      debugger; // ← 在这里设置断点
      console.log(chalk.magenta('🐛 Debug: Program reached end of UI command'));
    });

  // 监控命令（带调试）
  program
    .command('monitor')
    .description('System monitoring (Debug)')
    .action(async () => {
      console.log(chalk.blue('📊 System Monitor - Debug Mode'));
      
      // 调试点：系统信息收集
      debugger; // ← 在这里设置断点
      console.log(chalk.magenta('🐛 Debug: Starting system monitoring...'));
      console.log(chalk.yellow('⚠️  Monitoring features coming soon...'));
    });

  // 其他命令...
  program
    .command('logs')
    .description('Log management')
    .action(async () => {
      debugger; // ← 在这里设置断点
      console.log(chalk.blue('📋 Log Management'));
      console.log(chalk.yellow('⚠️  Log management features coming soon...'));
    });

  program
    .command('deploy')
    .description('Deployment tools')
    .action(async () => {
      debugger; // ← 在这里设置断点
      console.log(chalk.blue('🚀 Deployment Tools'));
      console.log(chalk.yellow('⚠️  Deployment features coming soon...'));
    });

  program
    .command('system')
    .description('System management')
    .action(async () => {
      debugger; // ← 在这里设置断点
      console.log(chalk.blue('⚙️  System Management'));
      console.log(chalk.yellow('⚠️  System management features coming soon...'));
    });

  // 解析命令行参数
  const options = program.opts();
  console.log(chalk.magenta(`\n🐛 Debug: CLI options = ${JSON.stringify(options, null, 2)}`));
  
  // 调试点：命令解析前
  debugger; // ← 在这里设置断点
  program.parse();
  
  // 调试点：命令解析后
  debugger; // ← 在这里设置断点
  console.log(chalk.magenta('🐛 Debug: Command parsing completed'));
}

// 错误处理（带调试）
process.on('uncaughtException', (error) => {
  debugger; // ← 在这里设置断点
  console.error(chalk.red('❌ Uncaught Exception:'), error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  debugger; // ← 在这里设置断点
  console.error(chalk.red('❌ Unhandled Rejection at:'), promise, 'reason:', reason);
  process.exit(1);
});

// 启动应用（带调试）
console.log(chalk.magenta('🐛 Debug: About to call main()'));
debugger; // ← 在这里设置断点

main().catch((error) => {
  debugger; // ← 在这里设置断点
  console.error(chalk.red('❌ Failed to start application:'), error);
  process.exit(1);
});