# Ops Toolkit 开发指南

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- Bun >= 1.0.0
- TypeScript >= 5.3.0

### 开发设置

```bash
# 克隆项目
git clone <repository-url>
cd ops-toolkit

# 安装依赖
bun install

# 启动开发模式
bun run dev

# 构建项目
bun run build
```

## 项目结构

```
ops-toolkit/
├── bin/                    # 可执行文件
│   └── ops-toolkit.ts     # CLI入口点
├── src/                    # 源代码
│   ├── cli/               # CLI核心模块
│   │   ├── app.ts         # CLI应用程序主类
│   │   ├── command-registry.ts # 命令注册系统
│   │   └── command-discovery.ts # 命令发现器
│   ├── commands/          # 命令实现
│   │   ├── monitor/       # 监控命令
│   │   ├── logs/          # 日志命令
│   │   ├── deploy/        # 部署命令
│   │   └── system/        # 系统命令
│   ├── utils/             # 工具类
│   │   ├── logger.ts      # 日志系统
│   │   ├── config.ts      # 配置管理
│   │   ├── error-handlers.ts # 错误处理
│   │   ├── error-reporter.ts # 错误报告
│   │   └── system.ts      # 系统工具
│   ├── types/             # 类型定义
│   │   ├── commands.ts    # 命令类型
│   │   ├── ui.ts          # UI类型
│   │   └── system.ts      # 系统类型
│   └── index.ts           # 开发入口点
├── docs/                  # 文档
├── tests/                 # 测试文件
└── dist/                  # 构建输出
```

## 开发规范

### 代码风格

项目使用严格的TypeScript配置和ESLint规则：

```bash
# 类型检查
bun run typecheck

# 代码检查
bun run lint

# 自动修复
bun run lint:fix

# 代码格式化
bun run format
```

### 命名约定

- **文件名**：kebab-case（如：command-discovery.ts）
- **类名**：PascalCase（如：CommandRegistry）
- **方法名**：camelCase（如：registerCommand）
- **常量**：SCREAMING_SNAKE_CASE（如：LogLevel.ERROR）
- **接口**：PascalCase（如：CommandDefinition）

### 注释规范

所有公共API必须包含JSDoc注释：

````typescript
/**
 * 注册命令到系统中
 * @param command 命令定义对象
 * @throws {ConfigError} 当命令验证失败时
 * @example
 * ```typescript
 * registry.register({
 *   name: 'test',
 *   description: '测试命令',
 *   action: async () => console.log('Hello')
 * });
 * ```
 */
public register(command: CommandDefinition): void {
  // 实现
}
````

## 组件开发

### 创建新命令

1. **创建命令目录**

```bash
mkdir -p src/commands/my-command
```

2. **实现命令文件**

```typescript
// src/commands/my-command/index.ts
import { type CommandDefinition } from '@/cli/command-registry';
import { Logger } from '@/utils/logger';

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
  ],
  subcommands: [
    {
      name: 'sub1',
      description: '子命令1',
      action: async options => {
        Logger.info('执行子命令1', options);
      },
    },
  ],
  action: async options => {
    Logger.info('执行我的命令', options);
  },
};

export default MyCommand;
```

3. **命令自动注册**
   命令发现器会自动扫描并注册新命令，无需手动注册。

### 扩展工具类

```typescript
// src/utils/my-util.ts
import { Logger } from './logger';

export class MyUtil {
  /**
   * 我的工具方法
   */
  static doSomething(input: string): string {
    Logger.debug('MyUtil.doSomething', { input });
    return input.toUpperCase();
  }
}
```

### 添加新类型

```typescript
// src/types/my-types.ts
export interface MyInterface {
  id: string;
  name: string;
  metadata?: Record<string, unknown>;
}

export enum MyEnum {
  FIRST = 'first',
  SECOND = 'second',
}
```

## 配置管理

### 配置结构

```typescript
// 扩展配置接口
export interface OpsConfig {
  // 现有配置...
  myModule: {
    enabled: boolean;
    apiKey: string;
    timeout: number;
  };
}
```

### 配置验证器

```typescript
import { ConfigValidator } from '@/utils/config';

class MyConfigValidator implements ConfigValidator {
  validate(config: OpsConfig): boolean {
    return !!(config.myModule?.apiKey?.length > 10);
  }

  getErrors(): string[] {
    return this.errors || [];
  }

  private errors: string[] = [];
}

// 注册验证器
ConfigManager.registerValidator('myModule', new MyConfigValidator());
```

## 错误处理

### 自定义错误类

```typescript
import { CLIError } from '@/utils/error-handlers';

export class MyError extends CLIError {
  constructor(message: string, details?: string) {
    super(message, 'MY_ERROR_CODE');
    this.name = 'MyError';
    this.details = details;
  }

  details?: string;
}
```

### 错误处理模式

```typescript
import { errorHandler, ErrorSeverity } from '@/utils/error-handlers';
import { withAsyncErrorHandling } from '@/utils/error-handlers';

// 模式1：直接处理
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

// 模式2：包装函数
const safeExecute = withAsyncErrorHandling(
  async (input: string) => {
    // 业务逻辑
  },
  { command: 'my-command', action: 'execute' },
  ErrorSeverity.LOW
);
```

## 日志系统

### 日志级别

- **DEBUG**: 调试信息
- **INFO**: 一般信息
- **WARN**: 警告信息
- **ERROR**: 错误信息
- **CRITICAL**: 严重错误

### 日志使用

```typescript
import { Logger } from '@/utils/logger';

// 基本日志
Logger.info('操作开始');
Logger.success('操作完成');
Logger.warning('注意：配置缺失');
Logger.error('操作失败', error, { userId: 123 });
Logger.critical('系统崩溃', error);

// 带上下文
Logger.info('用户操作', { userId, action }, 'auth');
Logger.debug('详细调试信息', { request, response }, 'api');

// 结构化日志
Logger.configure({
  level: LogLevel.DEBUG,
  enableFileLogging: true,
  logDirectory: './logs',
});
```

## 测试

### 单元测试

```typescript
// tests/utils/my-util.test.ts
import { describe, it, expect } from 'bun:test';
import { MyUtil } from '@/utils/my-util';

describe('MyUtil', () => {
  it('should uppercase input', () => {
    expect(MyUtil.doSomething('hello')).toBe('HELLO');
  });

  it('should handle empty input', () => {
    expect(MyUtil.doSomething('')).toBe('');
  });
});
```

### 集成测试

```typescript
// tests/commands/my-command.test.ts
import { CLIApp } from '@/cli/app';

describe('MyCommand', () => {
  it('should execute command successfully', async () => {
    const app = new CLIApp();
    await app.initialize();

    // 测试命令执行
    // 注意：需要模拟process.argv或直接调用命令
  });
});
```

## 性能优化

### 异步操作

```typescript
// ✅ 正确：使用异步操作
export async function processLargeFile(filePath: string): Promise<void> {
  const stream = fs.createReadStream(filePath);
  for await (const chunk of stream) {
    // 处理数据块
  }
}

// ❌ 错误：阻塞操作
export function processLargeFile(filePath: string): void {
  const data = fs.readFileSync(filePath);
  // 处理整个文件 - 可能阻塞
}
```

### 内存管理

```typescript
// 使用对象池
class ObjectPool<T> {
  private pool: T[] = [];

  acquire(): T {
    return this.pool.pop() || this.createNew();
  }

  release(obj: T): void {
    this.pool.push(obj);
  }

  private createNew(): T {
    // 创建新实例
    return {} as T;
  }
}
```

## 调试

### VS Code调试

使用 `.vscode/launch.json` 中的配置进行调试：

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Ops Toolkit",
  "program": "${workspaceFolder}/src/index.ts",
  "runtimeArgs": ["--inspect"],
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "true"
  }
}
```

### 日志调试

```typescript
// 启用详细日志
Logger.configure({
  level: LogLevel.DEBUG,
  enableFileLogging: true,
  enableStructuredOutput: true,
});

// 使用调试日志
Logger.debug('进入函数', { functionName: 'myFunc', args });
Logger.debug('中间状态', { variable, step: 1 });
Logger.debug('函数结果', { result, duration: Date.now() - start });
```

## 部署

### 构建流程

```bash
# 开发构建
bun run build:dev

# 生产构建
bun run build:prod

# 版本发布
bun run release
```

### 发布检查清单

- [ ] 所有测试通过
- [ ] 类型检查无错误
- [ ] 代码检查无警告
- [ ] 文档已更新
- [ ] 版本号已更新
- [ ] CHANGELOG已更新

## 最佳实践

### 1. 错误优先处理

```typescript
// ✅ 优先处理错误情况
async function processData(input: string): Promise<Result> {
  if (!input) {
    throw new ValidationError('输入不能为空');
  }

  if (input.length > MAX_LENGTH) {
    throw new ValidationError('输入过长');
  }

  // 正常处理逻辑
}
```

### 2. 配置验证

```typescript
// ✅ 启动时验证配置
async function initialize(): Promise<void> {
  const config = ConfigManager.get();

  if (!config.database.url) {
    throw new ConfigError('数据库URL未配置');
  }

  await testDatabaseConnection(config.database);
}
```

### 3. 资源清理

```typescript
// ✅ 使用 try-finally 确保资源清理
async function withConnection<T>(operation: (conn: Connection) => Promise<T>): Promise<T> {
  const conn = await createConnection();
  try {
    return await operation(conn);
  } finally {
    await conn.close();
  }
}
```

### 4. 类型安全

```typescript
// ✅ 使用类型守卫
function isCommand(obj: unknown): obj is CommandDefinition {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    'description' in obj &&
    'action' in obj
  );
}

// ✅ 使用 discriminated unions
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };
```

## 常见问题

### Q: 如何添加新的配置项？

A: 扩展 `OpsConfig` 接口，更新默认配置，可选添加验证器。

### Q: 命令如何访问配置？

A: 使用 `ConfigManager.get(key)` 获取特定配置项。

### Q: 如何处理长时间运行的任务？

A: 使用 `Logger.spinner()` 显示进度，并确保支持中断信号。

### Q: 如何编写可测试的代码？

A: 依赖注入、避免全局状态、使用工厂函数。

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 编写代码和测试
4. 确保所有检查通过
5. 提交Pull Request

提交信息格式遵循Conventional Commits规范：

- `feat:` 新功能
- `fix:` 修复bug
- `refactor:` 重构
- `docs:` 文档更新
- `style:` 代码格式
- `test:` 测试相关
- `chore:` 构建/工具相关

## 许可证

MIT License - 详见 LICENSE 文件。
