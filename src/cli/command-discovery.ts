import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { CommandRegistry, type CommandDefinition } from './command-registry';
import { Logger } from '@/utils/logger';

/**
 * 命令发现器
 * 自动发现并加载命令模块
 */
export class CommandDiscovery {
  private commandRegistry: CommandRegistry;
  private commandsDir: string;

  constructor(
    commandRegistry: CommandRegistry,
    commandsDir: string = join(__dirname, '../commands')
  ) {
    this.commandRegistry = commandRegistry;
    this.commandsDir = commandsDir;
  }

  /**
   * 发现并注册所有命令
   */
  public async discoverAndRegister(): Promise<void> {
    try {
      const commandModules = await this.discoverCommandModules();

      for (const modulePath of commandModules) {
        try {
          const commandModule = await import(modulePath);
          await this.registerCommandFromModule(commandModule, modulePath);
        } catch (error) {
          Logger.error(`加载命令模块失败: ${modulePath}`, error);
        }
      }
    } catch (error) {
      Logger.error('命令发现过程失败', error);
    }
  }

  /**
   * 发现命令模块
   */
  private async discoverCommandModules(): Promise<string[]> {
    const modules: string[] = [];

    if (!this.directoryExists(this.commandsDir)) {
      Logger.warning(`命令目录不存在: ${this.commandsDir}`);
      return modules;
    }

    const entries = readdirSync(this.commandsDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(this.commandsDir, entry.name);

      if (entry.isDirectory()) {
        // 查找目录中的 index.ts 或 index.js 文件
        const indexFile = this.findIndexFile(fullPath);
        if (indexFile) {
          modules.push(indexFile);
        }
      } else if (this.isCommandFile(entry.name)) {
        // 直接的命令文件
        modules.push(fullPath);
      }
    }

    return modules;
  }

  /**
   * 查找目录中的索引文件
   */
  private findIndexFile(dirPath: string): string | null {
    const possibleFiles = ['index.ts', 'index.js'];

    for (const file of possibleFiles) {
      const filePath = join(dirPath, file);
      if (this.fileExists(filePath)) {
        return filePath;
      }
    }

    return null;
  }

  /**
   * 检查是否为命令文件
   */
  private isCommandFile(filename: string): boolean {
    return (
      /\.(ts|js)$/.test(filename) &&
      !filename.startsWith('.') &&
      !filename.includes('.test.') &&
      !filename.includes('.spec.')
    );
  }

  /**
   * 从模块注册命令
   */
  private async registerCommandFromModule(
    commandModule: unknown,
    modulePath: string
  ): Promise<void> {
    try {
      const moduleObj = commandModule as Record<string, unknown>;
      // 支持多种导出方式
      let commandDef: CommandDefinition | undefined;

      if (moduleObj.default && typeof moduleObj.default === 'object') {
        // 默认导出对象
        commandDef = moduleObj.default as CommandDefinition;
      } else if (moduleObj.Command && typeof moduleObj.Command === 'object') {
        // 命名导出 Command
        commandDef = moduleObj.Command as CommandDefinition;
      } else if (typeof commandModule === 'function') {
        // 函数导出，转换为命令定义
        commandDef = this.createCommandFromFunction(
          commandModule as (...args: unknown[]) => void,
          modulePath
        );
      }

      if (commandDef && this.validateCommandDefinition(commandDef)) {
        this.commandRegistry.register(commandDef);
        Logger.info(`已注册命令: ${commandDef.name}`);
      } else {
        Logger.warning(`跳过无效的命令模块: ${modulePath}`);
      }
    } catch (error) {
      Logger.error(`注册命令失败: ${modulePath}`, error);
    }
  }

  /**
   * 从函数创建命令定义
   */
  private createCommandFromFunction(
    commandFn: (...args: unknown[]) => void,
    modulePath: string
  ): CommandDefinition | undefined {
    const commandName = this.extractCommandNameFromPath(modulePath);

    if (!commandName) {
      return undefined;
    }

    return {
      name: commandName,
      description: `${commandName} 命令`,
      action: async () => {
        await commandFn();
      },
    };
  }

  /**
   * 从文件路径提取命令名称
   */
  private extractCommandNameFromPath(modulePath: string): string | null {
    const parts = modulePath.split('/');
    const lastPart = parts[parts.length - 1];

    if (!lastPart) {
      return null;
    }

    if (lastPart === 'index.ts' || lastPart === 'index.js') {
      // 从父目录名称提取
      const parentDir = parts[parts.length - 2];
      return parentDir || null;
    }

    // 从文件名提取
    const nameWithoutExt = lastPart.replace(/\.(ts|js)$/, '');
    return nameWithoutExt || null;
  }

  /**
   * 验证命令定义
   */
  private validateCommandDefinition(commandDef: CommandDefinition): boolean {
    return !!(commandDef.name && commandDef.description && typeof commandDef.action === 'function');
  }

  /**
   * 检查目录是否存在
   */
  private directoryExists(path: string): boolean {
    try {
      const stats = statSync(path);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * 检查文件是否存在
   */
  private fileExists(path: string): boolean {
    try {
      const stats = statSync(path);
      return stats.isFile();
    } catch {
      return false;
    }
  }
}
