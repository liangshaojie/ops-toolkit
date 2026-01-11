import { type CommandDefinition } from '@/cli/command-registry';
import { Logger } from '@/utils/logger';
import { SystemUtils } from '@/utils/system';
import type { MonitorOptions } from '@/types/commands';
import chalk from 'chalk';

/**
 * 系统监控命令处理器
 */
class MonitorHandler {
  /**
   * 系统资源监控
   */
  async handleSystem(options: MonitorOptions): Promise<void> {
    console.log(chalk.blue('📊 系统资源监控'));
    console.log(chalk.gray(`刷新间隔: ${options.refresh}秒`));

    const systemInfo = await SystemUtils.getSystemInfo();
    const memoryUsage = SystemUtils.getMemoryUsage();
    const cpuUsage = await SystemUtils.getCpuUsage();

    console.log(chalk.cyan('\n系统信息:'));
    console.log(`  主机名: ${systemInfo.hostname}`);
    console.log(`  平台: ${systemInfo.platform}`);
    console.log(`  架构: ${systemInfo.arch}`);
    console.log(`  运行时间: ${SystemUtils.formatUptime(systemInfo.uptime)}`);

    console.log(chalk.cyan('\n内存使用情况:'));
    console.log(`  总内存: ${SystemUtils.formatBytes(memoryUsage.total)}`);
    console.log(`  已使用: ${SystemUtils.formatBytes(memoryUsage.used)}`);
    console.log(`  空闲内存: ${SystemUtils.formatBytes(memoryUsage.free)}`);
    console.log(`  使用率: ${memoryUsage.percentage}%`);

    console.log(chalk.cyan('\nCPU使用率:'));
    console.log(`  当前使用率: ${cpuUsage}%`);

    Logger.info('系统监控完成');
  }

  /**
   * 进程监控
   */
  async handleProcesses(options: MonitorOptions): Promise<void> {
    console.log(chalk.blue('🔄 进程监控'));
    console.log(chalk.gray(`排序字段: ${options.sort}`));

    const processes = await SystemUtils.getProcessList();

    // 排序进程
    const sortedProcesses = processes.sort((a, b) => {
      switch (options.sort) {
        case 'memory':
          return b.memory - a.memory;
        case 'name':
          return a.command.localeCompare(b.command);
        case 'cpu':
        default:
          return b.cpu - a.cpu;
      }
    });

    // 限制数量
    const limit = parseInt(options.limit?.toString() || '20');
    const limitedProcesses = sortedProcesses.slice(0, limit);

    console.log(chalk.cyan('\n进程列表:'));
    console.log('PID\tCPU%\tMEM%\t用户\t命令');
    console.log('---\t----\t----\t----\t---');

    limitedProcesses.forEach(process => {
      console.log(
        `${process.pid}\t${process.cpu.toFixed(1)}\t${process.memory.toFixed(1)}\t${process.user}\t${process.command.substring(0, 50)}`
      );
    });

    Logger.info(`显示 ${limitedProcesses.length} 个进程`);
  }

  /**
   * 网络监控
   */
  async handleNetwork(_options: MonitorOptions): Promise<void> {
    console.log(chalk.blue('🌐 网络监控'));
    console.log(chalk.yellow('⚠️  网络监控功能开发中...'));
  }

  /**
   * 磁盘监控
   */
  async handleDisk(_options: MonitorOptions): Promise<void> {
    console.log(chalk.blue('💾 磁盘使用监控'));
    console.log(chalk.yellow('⚠️  磁盘监控功能开发中...'));
  }
}

/**
 * 监控命令定义
 */
export const MonitorCommand: CommandDefinition = {
  name: 'monitor',
  description: '系统监控命令',
  alias: 'mon',
  options: [
    {
      flags: '-r, --refresh <seconds>',
      description: '刷新间隔（秒）',
      defaultValue: '5',
    },
    {
      flags: '-v, --verbose',
      description: '显示详细信息',
      defaultValue: false,
    },
    {
      flags: '-o, --output <format>',
      description: '输出格式（table|json）',
      defaultValue: 'table',
    },
  ],
  subcommands: [
    {
      name: 'system',
      description: '显示系统资源使用情况',
      action: async (options: MonitorOptions) => {
        const handler = new MonitorHandler();
        await handler.handleSystem(options);
      },
    },
    {
      name: 'processes',
      description: '显示运行中的进程',
      options: [
        {
          flags: '-s, --sort <field>',
          description: '排序字段（cpu|memory|name）',
          defaultValue: 'cpu',
        },
        {
          flags: '-l, --limit <number>',
          description: '进程数量限制',
          defaultValue: '20',
        },
        {
          flags: '-u, --user <user>',
          description: '按用户过滤',
        },
      ],
      action: async (options: MonitorOptions) => {
        const handler = new MonitorHandler();
        await handler.handleProcesses(options);
      },
    },
    {
      name: 'network',
      description: '显示网络统计信息',
      options: [
        {
          flags: '-i, --interface <iface>',
          description: '指定网络接口',
        },
        {
          flags: '-r, --realtime',
          description: '实时网络监控',
          defaultValue: false,
        },
      ],
      action: async (_options: MonitorOptions) => {
        const handler = new MonitorHandler();
        await handler.handleNetwork(_options);
      },
    },
    {
      name: 'disk',
      description: '显示磁盘使用情况',
      options: [
        {
          flags: '-a, --all',
          description: '显示所有文件系统',
          defaultValue: false,
        },
        {
          flags: '-h, --human',
          description: '人类可读格式',
          defaultValue: true,
        },
      ],
      action: async (_options: MonitorOptions) => {
        const handler = new MonitorHandler();
        await handler.handleDisk(_options);
      },
    },
  ],
  action: async (options: MonitorOptions) => {
    // 默认执行系统监控
    const handler = new MonitorHandler();
    await handler.handleSystem(options);
  },
};

// 默认导出命令定义
export default MonitorCommand;
