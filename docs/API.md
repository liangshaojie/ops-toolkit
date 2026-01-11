# Ops Toolkit API 文档

## 核心 API

### CLIApp

CLI应用程序主类，负责整个系统的初始化和运行。

```typescript
import { CLIApp } from '@/cli/app';

const app = new CLIApp(version);
await app.initialize();
await app.start();
```

#### 构造函数

```typescript
constructor(version?: string)
```

**参数：**

- `version` (可选): 应用程序版本号

#### 方法

##### `initialize()`

初始化应用程序。

```typescript
public async initialize(): Promise<void>
```

**抛出异常：**

- `ConfigError`: 配置初始化失败
- `CLIError`: 系统初始化失败

##### `start()`

启动CLI应用程序。

```typescript
public async start(): Promise<void>
```

### CommandRegistry

命令注册系统，管理所有命令的注册和执行。

```typescript
import { CommandRegistry, type CommandDefinition } from '@/cli/command-registry';

const registry = new CommandRegistry(program);
registry.register(commandDefinition);
```

#### 接口定义

```typescript
interface CommandDefinition {
  name: string;
  description: string;
  alias?: string;
  options?: CommandOption[];
  subcommands?: CommandDefinition[];
  action: (options: CommandOptions) => Promise<void> | void;
}

interface CommandOption {
  flags: string;
  description: string;
  defaultValue?: string | boolean | string[];
}
```

#### 方法

##### `register()`

注册单个命令。

```typescript
public register(commandDef: CommandDefinition): void
```

**参数：**

- `commandDef`: 命令定义对象

**抛出异常：**

- `Error`: 命令验证失败

##### `registerMultiple()`

批量注册命令。

```typescript
public registerMultiple(commandDefs: CommandDefinition[]): void
```

**参数：**

- `commandDefs`: 命令定义数组

##### `getCommands()`

获取所有已注册的命令。

```typescript
public getCommands(): CommandDefinition[]
```

**返回值：** 命令定义数组

##### `getCommand()`

根据名称获取命令。

```typescript
public getCommand(name: string): CommandDefinition | undefined
```

**参数：**

- `name`: 命令名称

**返回值：** 命令定义或undefined

### CommandDiscovery

命令发现器，自动扫描和加载命令模块。

```typescript
import { CommandDiscovery } from '@/cli/command-discovery';

const discovery = new CommandDiscovery(registry);
await discovery.discoverAndRegister();
```

#### 构造函数

```typescript
constructor(commandRegistry: CommandRegistry, commandsDir?: string)
```

**参数：**

- `commandRegistry`: 命令注册器实例
- `commandsDir` (可选): 命令目录路径

#### 方法

##### `discoverAndRegister()`

发现并注册所有命令。

```typescript
public async discoverAndRegister(): Promise<void>
```

## 配置 API

### ConfigManager

配置管理系统，提供配置的加载、保存、验证等功能。

```typescript
import { ConfigManager, type OpsConfig } from '@/utils/config';

await ConfigManager.initialize();
const config = ConfigManager.get();
await ConfigManager.set('monitor.refreshInterval', 3000);
```

#### 接口定义

```typescript
interface OpsConfig {
  version?: string;
  environment?: 'development' | 'production' | 'test';
  monitor: {
    refreshInterval: number;
    showProcesses: boolean;
    maxProcesses: number;
    enableRealTime: boolean;
  };
  logs: {
    defaultPath: string;
    maxLines: number;
    follow: boolean;
    level: LogLevel;
    enableFileLogging: boolean;
    logDirectory: string;
  };
  deploy: {
    defaultEnv: string;
    backupEnabled: boolean;
    confirmBeforeDeploy: boolean;
    rollbackEnabled: boolean;
    maxRetries: number;
  };
  system: {
    showHiddenServices: boolean;
    cacheTimeout: number;
    enableNotifications: boolean;
  };
  ui: {
    theme: string;
    animations: boolean;
    sound: boolean;
    language: string;
  };
}
```

#### 静态方法

##### `initialize()`

初始化配置系统。

```typescript
static async initialize(): Promise<void>
```

**抛出异常：**

- `ConfigError`: 配置初始化失败

##### `get()`

获取配置值。

```typescript
static get(): OpsConfig
static get<T>(key: string): T
```

**参数：**

- `key` (可选): 配置键名，支持点分隔符

**返回值：** 配置对象或指定键的值

**示例：**

```typescript
const fullConfig = ConfigManager.get();
const refreshInterval = ConfigManager.get<number>('monitor.refreshInterval');
```

##### `set()`

设置配置值。

```typescript
static async set<T>(key: string, value: T): Promise<void>
```

**参数：**

- `key`: 配置键名，支持点分隔符
- `value`: 配置值

**抛出异常：**

- `ConfigError`: 配置设置失败

**示例：**

```typescript
await ConfigManager.set('monitor.refreshInterval', 5000);
await ConfigManager.set('logs.level', LogLevel.DEBUG);
```

##### `reset()`

重置配置为默认值。

```typescript
static async reset(): Promise<void>
```

##### `reload()`

重新加载配置文件。

```typescript
static async reload(): Promise<void>
```

##### `registerValidator()`

注册配置验证器。

```typescript
static registerValidator(name: string, validator: ConfigValidator): void
```

**参数：**

- `name`: 验证器名称
- `validator`: 验证器实例

##### `cleanOldBackups()`

清理旧的配置备份。

```typescript
static async cleanOldBackups(maxBackups?: number): Promise<void>
```

**参数：**

- `maxBackups` (可选): 最大备份数量，默认10

## 日志 API

### Logger

增强的日志系统，支持多种日志级别和输出格式。

```typescript
import { Logger, LogLevel } from '@/utils/logger';

// 基本使用
Logger.info('应用启动');
Logger.error('操作失败', error);
Logger.success('操作完成');

// 配置日志系统
Logger.configure({
  level: LogLevel.DEBUG,
  enableFileLogging: true,
  logDirectory: './logs',
});
```

#### 日志级别

```typescript
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}
```

#### 静态方法

##### `configure()`

配置日志系统。

```typescript
static configure(config: Partial<LogConfig>): void
```

**参数：**

- `config`: 日志配置对象

**配置接口：**

```typescript
interface LogConfig {
  level: LogLevel;
  enableFileLogging: boolean;
  logDirectory: string;
  maxFileSize: number;
  maxFiles: number;
  enableConsoleColors: boolean;
  enableStructuredOutput: boolean;
}
```

##### `debug()`

记录调试日志。

```typescript
static debug(message: string, context?: Record<string, unknown>, module?: string): void
```

##### `info()`

记录信息日志。

```typescript
static info(message: string, context?: Record<string, unknown>, module?: string): void
```

##### `warn()`

记录警告日志。

```typescript
static warn(message: string, context?: Record<string, unknown>, module?: string): void
```

##### `warning()`

记录警告日志（别名）。

```typescript
static warning(message: string, context?: Record<string, unknown>, module?: string): void
```

##### `error()`

记录错误日志。

```typescript
static error(message: string, error?: Error | unknown, context?: Record<string, unknown>, module?: string): void
```

##### `critical()`

记录严重错误日志。

```typescript
static critical(message: string, error?: Error | unknown, context?: Record<string, unknown>, module?: string): void
```

##### `success()`

记录成功日志（带绿色标记）。

```typescript
static success(message: string, context?: Record<string, unknown>, module?: string): void
```

##### `showTitle()`

显示标题。

```typescript
static showTitle(text: string, font?: string): void
```

##### `showBox()`

显示带边框的文本。

```typescript
static showBox(content: string, options?: Record<string, unknown>): void
```

##### `spinner()`

创建加载动画。

```typescript
static spinner(message: string): Spinner
```

**返回值：** Spinner对象，包含start、stop、succeed等方法

##### `getLogBuffer()`

获取日志缓冲区。

```typescript
static getLogBuffer(): LogEntry[]
```

##### `setLevel()`

设置日志级别。

```typescript
static setLevel(level: LogLevel): void
```

##### `enableFileLogging()`

启用文件日志。

```typescript
static enableFileLogging(directory?: string): void
```

## 错误处理 API

### 自定义错误类

```typescript
import { CLIError, CommandError, ConfigError, SystemError } from '@/utils/error-handlers';

// 创建自定义错误
const error = new CLIError('CLI操作失败', 'CUSTOM_ERROR', 2);
const cmdError = new CommandError('命令执行失败', 'my-command');
const cfgError = new ConfigError('配置项无效');
const sysError = new SystemError('系统资源不足');
```

#### CLIError

基础CLI错误类。

```typescript
class CLIError extends Error {
  public readonly code: string;
  public readonly exitCode: number;

  constructor(message: string, code?: string, exitCode?: number);
}
```

#### CommandError

命令执行错误。

```typescript
class CommandError extends CLIError {
  constructor(message: string, command?: string);
}
```

#### ConfigError

配置相关错误。

```typescript
class ConfigError extends CLIError {
  constructor(message: string);
}
```

#### SystemError

系统级错误。

```typescript
class SystemError extends CLIError {
  constructor(message: string);
}
```

### 错误处理函数

```typescript
import { errorHandler, withAsyncErrorHandling, setupErrorHandlers } from '@/utils/error-handlers';

// 设置全局错误处理
setupErrorHandlers();

// 直接处理错误
try {
  // 业务逻辑
} catch (error) {
  errorHandler(
    error,
    {
      command: 'my-command',
      action: 'execute',
    },
    ErrorSeverity.MEDIUM
  );
}

// 包装异步函数
const safeExecute = withAsyncErrorHandling(
  async (input: string) => {
    // 业务逻辑
  },
  { command: 'my-command' },
  ErrorSeverity.LOW
);
```

### ErrorReporter

错误报告系统。

```typescript
import { ErrorReporter, ErrorSeverity } from '@/utils/error-reporter';

// 创建错误报告
const report = ErrorReporter.createReport(
  'ERROR_CODE',
  '错误描述',
  ErrorSeverity.HIGH,
  { command: 'my-command' },
  originalError
);

// 报告错误
ErrorReporter.report(report);

// 获取错误报告
const reports = ErrorReporter.getAllReports();
const specificReport = ErrorReporter.getReport(reportId);

// 解决错误
ErrorReporter.resolveReport(reportId);
```

## 系统工具 API

### SystemUtils

系统相关工具函数。

```typescript
import { SystemUtils } from '@/utils/system';

// 获取系统信息
const systemInfo = await SystemUtils.getSystemInfo();

// 获取内存使用情况
const memoryUsage = SystemUtils.getMemoryUsage();

// 获取CPU使用率
const cpuUsage = await SystemUtils.getCpuUsage();

// 获取进程列表
const processes = await SystemUtils.getProcessList();

// 执行系统命令
const output = await SystemUtils.execCommand('ls -la');

// 格式化字节大小
const formatted = SystemUtils.formatBytes(1024 * 1024);

// 格式化运行时间
const uptime = SystemUtils.formatUptime(3600);
```

#### 方法

##### `getSystemInfo()`

获取系统信息。

```typescript
static async getSystemInfo(): Promise<{
  hostname: string;
  platform: string;
  arch: string;
  uptime: number;
  loadAverage: number[];
  totalMemory: number;
  freeMemory: number;
  cpus: os.CpuInfo[];
}>
```

##### `getMemoryUsage()`

获取内存使用情况。

```typescript
static getMemoryUsage(): {
  total: number;
  free: number;
  used: number;
  percentage: number;
}
```

##### `getCpuUsage()`

获取CPU使用率。

```typescript
static getCpuUsage(): Promise<number>
```

##### `getProcessList()`

获取进程列表。

```typescript
static async getProcessList(): Promise<Array<{
  pid: number;
  user: string;
  cpu: number;
  memory: number;
  command: string;
}>>
```

##### `execCommand()`

执行系统命令。

```typescript
static async execCommand(command: string): Promise<string>
```

##### `formatBytes()`

格式化字节大小。

```typescript
static formatBytes(bytes: number): string
```

##### `formatUptime()`

格式化运行时间。

```typescript
static formatUptime(seconds: number): string
```

## 类型定义

### CommandOptions

命令选项类型。

```typescript
interface CommandOptions {
  [key: string]: string | boolean | number | undefined;
}
```

### LogLevel

日志级别枚举。

```typescript
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}
```

### ErrorSeverity

错误严重程度。

```typescript
enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}
```

## 使用示例

### 完整的命令实现

```typescript
import { type CommandDefinition } from '@/cli/command-registry';
import { Logger } from '@/utils/logger';
import { ConfigManager } from '@/utils/config';
import { CommandError, errorHandler } from '@/utils/error-handlers';

export const MyCommand: CommandDefinition = {
  name: 'my-command',
  description: '我的自定义命令',
  alias: 'mc',
  options: [
    {
      flags: '-f, --force',
      description: '强制执行',
      defaultValue: false,
    },
    {
      flags: '-t, --timeout <number>',
      description: '超时时间（秒）',
      defaultValue: '30',
    },
  ],
  subcommands: [
    {
      name: 'sub1',
      description: '子命令1',
      action: async options => {
        const config = ConfigManager.get();
        Logger.info('执行子命令1', { options, config });

        if (options.force) {
          Logger.warning('强制执行模式');
        }

        try {
          // 业务逻辑
          await doSomething();
          Logger.success('操作完成');
        } catch (error) {
          errorHandler(
            error,
            {
              command: 'my-command',
              action: 'sub1',
            },
            ErrorSeverity.MEDIUM
          );
        }
      },
    },
  ],
  action: async options => {
    const timeout = parseInt(options.timeout?.toString() || '30');
    Logger.info('执行主命令', { timeout, force: options.force });

    try {
      await withTimeout(doMainOperation(), timeout * 1000);
      Logger.success('主命令执行完成');
    } catch (error) {
      if (error instanceof CommandError) {
        throw error;
      }
      errorHandler(
        error,
        {
          command: 'my-command',
          action: 'main',
        },
        ErrorSeverity.HIGH
      );
    }
  },
};

async function doSomething(): Promise<void> {
  // 实现业务逻辑
}

async function doMainOperation(): Promise<void> {
  // 实现主要操作
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('操作超时')), timeoutMs)),
  ]);
}

export default MyCommand;
```

这个API文档提供了完整的接口说明和使用示例，帮助开发者快速理解和使用Ops Toolkit的各种功能。
