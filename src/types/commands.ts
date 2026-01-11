// 命令相关的类型定义
export interface CommandOptions {
  [key: string]: string | boolean | number | undefined;
}

export interface BaseCommand {
  name: string;
  description: string;
  options?: CommandOptions;
  action?: (options?: CommandOptions) => Promise<void> | void;
}

// 监控命令选项
export interface MonitorOptions extends CommandOptions {
  refresh?: number;
  verbose?: boolean;
  output?: 'table' | 'json';
}

// 日志命令选项
export interface LogsOptions extends CommandOptions {
  follow?: boolean;
  lines?: number;
  pattern?: string;
  level?: 'debug' | 'info' | 'warn' | 'error';
}

// 部署命令选项
export interface DeployOptions extends CommandOptions {
  env?: string;
  backup?: boolean;
  force?: boolean;
  config?: string;
}

// 系统命令选项
export interface SystemOptions extends CommandOptions {
  user?: string;
  service?: string;
  action?: 'start' | 'stop' | 'restart' | 'status';
}
