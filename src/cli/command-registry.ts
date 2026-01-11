import { Command } from 'commander';
import type { CommandOptions } from '@/types/commands';

/**
 * 命令接口定义
 */
export interface CommandDefinition {
  name: string;
  description: string;
  alias?: string;
  options?: CommandOption[];
  subcommands?: CommandDefinition[];
  action: (options: CommandOptions) => Promise<void> | void;
}

/**
 * 命令选项定义
 */
export interface CommandOption {
  flags: string;
  description: string;
  defaultValue?: string | boolean | string[];
}

/**
 * 命令注册器
 */
export class CommandRegistry {
  private commands: Map<string, CommandDefinition> = new Map();
  private program: Command;

  constructor(program: Command) {
    this.program = program;
  }

  /**
   * 注册单个命令
   */
  public register(commandDef: CommandDefinition): void {
    this.commands.set(commandDef.name, commandDef);
    this.setupCommand(commandDef);
  }

  /**
   * 批量注册命令
   */
  public registerMultiple(commandDefs: CommandDefinition[]): void {
    commandDefs.forEach(commandDef => this.register(commandDef));
  }

  /**
   * 设置命令到Commander程序
   */
  private setupCommand(commandDef: CommandDefinition): void {
    const cmd = this.program.command(commandDef.name).description(commandDef.description);

    // 设置别名
    if (commandDef.alias) {
      cmd.alias(commandDef.alias);
    }

    // 设置选项
    if (commandDef.options) {
      commandDef.options.forEach(option => {
        cmd.option(option.flags, option.description, option.defaultValue);
      });
    }

    // 设置子命令
    if (commandDef.subcommands) {
      commandDef.subcommands.forEach(subcommandDef => {
        this.setupSubcommand(cmd, subcommandDef);
      });
    }

    // 设置动作
    cmd.action(async options => {
      try {
        await commandDef.action(options);
      } catch (error) {
        console.error(`命令 "${commandDef.name}" 执行失败:`, error);
        process.exit(1);
      }
    });
  }

  /**
   * 设置子命令
   */
  private setupSubcommand(parentCmd: Command, subcommandDef: CommandDefinition): void {
    const subcmd = parentCmd.command(subcommandDef.name).description(subcommandDef.description);

    // 设置别名
    if (subcommandDef.alias) {
      subcmd.alias(subcommandDef.alias);
    }

    // 设置选项
    if (subcommandDef.options) {
      subcommandDef.options.forEach(option => {
        subcmd.option(option.flags, option.description, option.defaultValue);
      });
    }

    // 设置动作
    subcmd.action(async options => {
      try {
        await subcommandDef.action(options);
      } catch (error) {
        console.error(`子命令 "${subcommandDef.name}" 执行失败:`, error);
        process.exit(1);
      }
    });
  }

  /**
   * 获取所有注册的命令
   */
  public getCommands(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  /**
   * 根据名称获取命令
   */
  public getCommand(name: string): CommandDefinition | undefined {
    return this.commands.get(name);
  }

  /**
   * 检查命令是否存在
   */
  public hasCommand(name: string): boolean {
    return this.commands.has(name);
  }
}
