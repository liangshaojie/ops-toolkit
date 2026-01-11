import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import fs from 'fs';
import chalk from 'chalk';

const execAsync = promisify(exec);

// 系统工具函数
export class SystemUtils {
  // 获取系统信息
  static async getSystemInfo(): Promise<{
    hostname: string;
    platform: string;
    arch: string;
    uptime: number;
    loadAverage: number[];
    totalMemory: number;
    freeMemory: number;
    cpus: os.CpuInfo[];
  }> {
    const info = {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      uptime: os.uptime(),
      loadAverage: os.loadavg(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus(),
    };

    return info;
  }

  // 获取内存使用情况
  static getMemoryUsage() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const percentage = (used / total) * 100;

    return {
      total,
      free,
      used,
      percentage: Math.round(percentage * 100) / 100,
    };
  }

  // 获取CPU使用率
  static getCpuUsage(): Promise<number> {
    return new Promise(resolve => {
      const startMeasure = this.cpuAverage();

      setTimeout(() => {
        const endMeasure = this.cpuAverage();
        const idleDifference = endMeasure.idle - startMeasure.idle;
        const totalDifference = endMeasure.total - startMeasure.total;
        const percentageCPU = 100 - ~~((100 * idleDifference) / totalDifference);

        resolve(percentageCPU);
      }, 1000);
    });
  }

  private static cpuAverage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    }

    return {
      idle: totalIdle / cpus.length,
      total: totalTick / cpus.length,
    };
  }

  // 执行系统命令
  static async execCommand(command: string): Promise<string> {
    try {
      const { stdout } = await execAsync(command);
      return stdout.trim();
    } catch (error) {
      throw new Error(`Command execution failed: ${command}`);
    }
  }

  // 检查文件是否存在
  static fileExists(path: string): boolean {
    try {
      return fs.existsSync(path);
    } catch {
      return false;
    }
  }

  // 读取文件内容
  static readFile(path: string): string {
    try {
      return fs.readFileSync(path, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read file: ${path}`);
    }
  }

  // 写入文件内容
  static writeFile(path: string, content: string): void {
    try {
      fs.writeFileSync(path, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write file: ${path}`);
    }
  }

  // 格式化字节大小
  static formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }

  // 格式化运行时间
  static formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);

    return parts.join(' ') || '0s';
  }

  // 获取进程列表
  static async getProcessList(): Promise<
    Array<{
      pid: number;
      user: string;
      cpu: number;
      memory: number;
      command: string;
    }>
  > {
    try {
      const platform = os.platform();
      let command = '';

      if (platform === 'darwin') {
        command = 'ps aux';
      } else if (platform === 'linux') {
        command = 'ps aux';
      } else if (platform === 'win32') {
        command = 'tasklist';
      } else {
        command = 'ps aux';
      }

      const output = await this.execCommand(command);
      return this.parseProcessList(output);
    } catch (error) {
      console.error(chalk.red('Failed to get process list:'), error);
      return [];
    }
  }

  private static parseProcessList(output: string): Array<{
    pid: number;
    user: string;
    cpu: number;
    memory: number;
    command: string;
  }> {
    const lines = output.split('\n').slice(1); // 跳过标题行
    const processes = [];

    for (const line of lines) {
      if (line.trim()) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 11) {
          processes.push({
            pid: parseInt(parts[1] || '0'),
            user: parts[0] || '',
            cpu: parseFloat(parts[2] || '0'),
            memory: parseFloat(parts[3] || '0'),
            command: parts.slice(10).join(' ') || '',
          });
        }
      }
    }

    return processes;
  }
}
