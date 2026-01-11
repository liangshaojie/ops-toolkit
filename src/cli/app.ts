#!/usr/bin/env bun

import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { Logger } from '@/utils/logger';
import { Config } from '@/utils/config';
import { setupErrorHandlers } from '@/utils/error-handlers';
import { CommandRegistry, type CommandDefinition } from './command-registry';
import { CommandDiscovery } from './command-discovery';

/**
 * CLI应用程序主入口
 * 统一处理CLI启动、命令注册和错误处理
 */
export class CLIApp {
  private version: string;
  private commandRegistry: CommandRegistry;

  constructor(version: string = '1.2.0') {
    this.version = version;
    this.commandRegistry = new CommandRegistry(program);
  }

  /**
   * 初始化CLI应用
   */
  public async initialize(): Promise<void> {
    this.setupProgram();
    await this.registerCommands();
    setupErrorHandlers();
  }

  /**
   * 初始化程序配置
   */
  private setupProgram(): void {
    program.name('ops').description('全面的DevOps CLI工具包').version(this.version);

    // 全局选项
    program
      .option('-d, --debug', '启用调试模式', false)
      .option('-v, --verbose', '启用详细日志', false);
  }

  /**
   * 注册所有命令
   */
  private async registerCommands(): Promise<void> {
    // 注册基础命令
    const commands = this.getAllCommands();
    this.commandRegistry.registerMultiple(commands);

    // 发现并注册命令目录中的命令
    const discovery = new CommandDiscovery(this.commandRegistry);
    await discovery.discoverAndRegister();
  }

  /**
   * 获取所有命令定义
   */
  private getAllCommands(): CommandDefinition[] {
    return [
      {
        name: 'ui',
        description: '启动交互式终端界面',
        action: async () => {
          await this.handleUICommand();
        },
      },
      {
        name: 'monitor',
        description: '系统监控',
        action: async () => {
          await this.handleMonitorCommand();
        },
      },
      {
        name: 'logs',
        description: '日志管理',
        action: async () => {
          await this.handleLogsCommand();
        },
      },
      {
        name: 'deploy',
        description: '部署工具',
        action: async () => {
          await this.handleDeployCommand();
        },
      },
      {
        name: 'system',
        description: '系统管理',
        action: async () => {
          await this.handleSystemCommand();
        },
      },
    ];
  }

  /**
   * 显示欢迎信息
   */
  private showWelcome(): void {
    const welcomeText = figlet.textSync('ops-toolkit', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    });

    console.log(chalk.cyan(welcomeText));
  }

  /**
   * 处理UI命令
   */
  private async handleUICommand(): Promise<void> {
    this.showWelcome();
    console.log(chalk.green('🚀 ops-toolkit CLI正在运行!'));
    console.log(chalk.blue('📋 可用命令:'));
    console.log(chalk.white('  ops monitor    - 系统监控'));
    console.log(chalk.white('  ops logs       - 日志管理'));
    console.log(chalk.white('  ops deploy     - 部署工具'));
    console.log(chalk.white('  ops system     - 系统管理'));
    console.log(chalk.gray('\n🔧 UI功能即将推出...'));
  }

  /**
   * 处理监控命令
   */
  private async handleMonitorCommand(): Promise<void> {
    console.log(chalk.blue('📊 系统监控'));
    console.log(chalk.yellow('⚠️  监控功能即将推出...'));
  }

  /**
   * 处理日志命令
   */
  private async handleLogsCommand(): Promise<void> {
    console.log(chalk.blue('📋 日志管理'));
    console.log(chalk.yellow('⚠️  日志管理功能即将推出...'));
  }

  /**
   * 处理部署命令
   */
  private async handleDeployCommand(): Promise<void> {
    console.log(chalk.blue('🚀 部署工具'));
    console.log(chalk.yellow('⚠️  部署功能即将推出...'));
  }

  /**
   * 处理系统命令
   */
  private async handleSystemCommand(): Promise<void> {
    console.log(chalk.blue('⚙️  系统管理'));
    console.log(chalk.yellow('⚠️  系统管理功能即将推出...'));
  }

  /**
   * 启动CLI应用程序
   */
  public async start(): Promise<void> {
    try {
      program.parse();
    } catch (error) {
      Logger.error('CLI启动失败');
      if (error instanceof Error) {
        Logger.error('错误详情', error);
      }
      process.exit(1);
    }
  }
}

/**
 * 创建并启动CLI应用程序
 */
export async function createCLI(): Promise<void> {
  const config = Config.get();
  const version = config?.version || '1.2.0';

  const app = new CLIApp(version);
  await app.initialize();
  await app.start();
}
