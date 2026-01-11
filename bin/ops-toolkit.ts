#!/usr/bin/env bun

import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';

// CLI入口点
async function main() {
  // 显示欢迎信息
  console.log(
    chalk.cyan(
      figlet.textSync('ops-toolkit', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );

  // 设置CLI程序
  program.name('ops').description('A comprehensive DevOps CLI toolkit').version('1.0.0');

  // 默认启动命令
  program
    .command('ui', { isDefault: true })
    .description('Start interactive terminal UI')
    .action(async () => {
      console.log(chalk.green('🚀 ops-toolkit CLI is running!'));
      console.log(chalk.yellow('📋 Available commands:'));
      console.log(chalk.white('  ops monitor    - System monitoring'));
      console.log(chalk.white('  ops logs       - Log management'));
      console.log(chalk.white('  ops deploy     - Deployment tools'));
      console.log(chalk.white('  ops system     - System management'));
      console.log(chalk.gray('\n🔧 UI features coming soon...'));
    });

  // 监控命令
  program
    .command('monitor')
    .description('System monitoring')
    .action(async () => {
      console.log(chalk.blue('📊 System Monitor'));
      console.log(chalk.yellow('⚠️  Monitoring features coming soon...'));
    });

  // 日志命令
  program
    .command('logs')
    .description('Log management')
    .action(async () => {
      console.log(chalk.blue('📋 Log Management'));
      console.log(chalk.yellow('⚠️  Log management features coming soon...'));
    });

  // 部署命令
  program
    .command('deploy')
    .description('Deployment tools')
    .action(async () => {
      console.log(chalk.blue('🚀 Deployment Tools'));
      console.log(chalk.yellow('⚠️  Deployment features coming soon...'));
    });

  // 系统命令
  program
    .command('system')
    .description('System management')
    .action(async () => {
      console.log(chalk.blue('⚙️  System Management'));
      console.log(chalk.yellow('⚠️  System management features coming soon...'));
    });

  // 解析命令行参数
  program.parse();
}

// 错误处理
process.on('uncaughtException', error => {
  console.error(chalk.red('❌ Uncaught Exception:'), error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Unhandled Rejection at:'), promise, 'reason:', reason);
  process.exit(1);
});

// 启动应用
main().catch(error => {
  console.error(chalk.red('❌ Failed to start application:'), error);
  process.exit(1);
});
