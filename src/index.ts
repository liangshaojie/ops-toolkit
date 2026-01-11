#!/usr/bin/env bun

import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';

async function main() {
  const welcomeText = figlet.textSync('ops-toolkit', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });

  console.log(chalk.cyan(welcomeText));

  program.name('ops').description('全面的DevOps CLI工具包').version('1.0.0');

  program.option('-d, --debug', '启用调试模式', false);
  program.option('-v, --verbose', '启用详细日志', false);

  program
    .command('ui', { isDefault: true })
    .description('启动交互式终端界面')
    .action(async () => {
      console.log(chalk.green('🚀 ops-toolkit CLI正在运行!'));
      console.log(chalk.blue('📋 可用命令:'));
      console.log(chalk.white('  ops monitor    - 系统监控'));
      console.log(chalk.white('  ops logs       - 日志管理'));
      console.log(chalk.white('  ops deploy     - 部署工具'));
      console.log(chalk.white('  ops system     - 系统管理'));
      console.log(chalk.gray('\n🔧 UI功能即将推出...'));
    });

  program
    .command('monitor')
    .description('系统监控')
    .action(async () => {
      console.log(chalk.blue('📊 系统监控'));
      console.log(chalk.yellow('⚠️  监控功能即将推出...'));
    });

  program
    .command('logs')
    .description('日志管理')
    .action(async () => {
      console.log(chalk.blue('📋 日志管理'));
      console.log(chalk.yellow('⚠️  日志管理功能即将推出...'));
    });

  program
    .command('deploy')
    .description('部署工具')
    .action(async () => {
      console.log(chalk.blue('🚀 部署工具'));
      console.log(chalk.yellow('⚠️  部署功能即将推出...'));
    });

  program
    .command('system')
    .description('系统管理')
    .action(async () => {
      console.log(chalk.blue('⚙️  系统管理'));
      console.log(chalk.yellow('⚠️  系统管理功能即将推出...'));
    });

  program.parse();
}

process.on('uncaughtException', error => {
  console.error(chalk.red('❌ 未捕获异常:'), error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ 未处理的Promise拒绝:'), promise, '原因:', reason);
  process.exit(1);
});

main().catch(error => {
  console.error(chalk.red('❌ 启动应用失败:'), error);
  process.exit(1);
});
