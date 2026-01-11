# Ops Toolkit 架构文档

## 概述

Ops Toolkit 是一个现代化的 DevOps CLI 工具包，采用模块化架构设计，提供系统监控、日志管理、部署工具等功能。

## 系统架构

### 整体架构图

```plantuml
@startuml
!theme plain
skinparam backgroundColor #F8F9FA
skinparam rectangle {
    BorderColor #2C3E50
    BackgroundColor #ECF0F1
}
skinparam package {
    BorderColor #3498DB
    BackgroundColor #EBF5FB
}

package "CLI 入口层" {
    [bin/ops-toolkit.ts] as bin
    [src/index.ts] as index
}

package "CLI 核心层" {
    [src/cli/app.ts] as cli_app
    [src/cli/command-registry.ts] as registry
    [src/cli/command-discovery.ts] as discovery
}

package "命令层" {
    [src/commands/monitor/] as monitor_cmd
    [src/commands/logs/] as logs_cmd
    [src/commands/deploy/] as deploy_cmd
    [src/commands/system/] as system_cmd
}

package "工具层" {
    [src/utils/logger.ts] as logger
    [src/utils/config.ts] as config
    [src/utils/error-handlers.ts] as error_handler
    [src/utils/error-reporter.ts] as error_reporter
    [src/utils/system.ts] as system_utils
}

package "类型定义" {
    [src/types/commands.ts] as types_commands
    [src/types/ui.ts] as types_ui
    [src/types/system.ts] as types_system
}

bin --> cli_app
index --> cli_app
cli_app --> registry
cli_app --> discovery
discovery --> monitor_cmd
discovery --> logs_cmd
discovery --> deploy_cmd
discovery --> system_cmd
registry --> logger
registry --> config
registry --> error_handler
monitor_cmd --> system_utils
logs_cmd --> logger
deploy_cmd --> config
system_cmd --> system_utils
error_handler --> error_reporter
logger --> types_ui
config --> types_commands
system_utils --> types_system
@enduml
```

### 核心组件

#### CLI 应用程序 (CLIApp)

CLI应用程序是整个系统的核心，负责：

- 初始化配置和错误处理
- 注册和管理命令
- 提供统一的启动入口

#### 命令注册系统 (CommandRegistry)

提供灵活的命令注册机制：

- 支持命令和子命令注册
- 统一的选项处理
- 命令验证和管理

#### 命令发现器 (CommandDiscovery)

自动发现和加载命令：

- 扫描命令目录
- 支持多种导出格式
- 热加载命令模块

## 数据流架构

### 命令执行流程

```plantuml
@startuml
!theme plain
skinparam participant {
    BackgroundColor #E8F4FD
    BorderColor #3498DB
}

participant User
participant CLI as "CLI App"
participant Registry as "CommandRegistry"
 Discovery as "CommandDiscovery"
 Command as "Command"
 Logger as "Logger"
 ErrorHandler as "ErrorHandler"

User -> CLI: 执行命令
CLI -> Registry: 查找命令
Registry -> Discovery: 发现命令
Discovery -> Command: 加载命令模块
Command --> Discovery: 返回命令定义
Discovery --> Registry: 注册命令
Registry --> CLI: 返回命令实例
CLI -> Command: 执行命令
Command -> Logger: 记录日志
Command -> ErrorHandler: 处理错误
CLI -> User: 返回结果

@enduml
```

### 错误处理流程

```plantuml
@startuml
!theme plain
skinparam participant {
    BackgroundColor #FFF5F5
    BorderColor #E74C3C
}

participant Process
participant ErrorHandler
participant ErrorReporter
participant Logger
participant File as "Log File"

Process -> ErrorHandler: 发生错误
ErrorHandler -> ErrorReporter: 创建错误报告
ErrorReporter -> Logger: 记录错误详情
Logger -> File: 写入文件
ErrorReporter --> Process: 返回错误报告
ErrorHandler -> Process: 根据严重程度处理
Process -> Process: 继续执行或退出

@enduml
```

## 配置系统

### 配置管理架构

```plantuml
@startuml
!theme plain
skinparam rectangle {
    BackgroundColor #FFF9E6
    BorderColor #F39C12
}

state "配置管理" as Config {
    state "初始化" as Init
    state "加载" as Load
    state "验证" as Validate
    state "使用" as Use
    state "保存" as Save
    state "备份" as Backup

    Init --> Load
    Load --> Validate
    Validate --> Use
    Use --> Save: 配置更新
    Save --> Backup
    Backup --> Load: 回滚
}

note right of Config
  - 支持配置验证
  - 自动备份机制
  - 环境特定配置
  - 配置热重载
end note

@enduml
```

### 配置层次结构

```plantuml
@startuml
!theme plain
skinparam note {
    BackgroundColor #E8F5E8
    BorderColor #27AE60
}

rectangle "全局配置" as Global {
    rectangle "环境配置" as Env
    rectangle "用户配置" as User
    rectangle "系统配置" as System
}

rectangle "模块配置" as Module {
    rectangle "监控配置" as Monitor
    rectangle "日志配置" as Logs
    rectangle "部署配置" as Deploy
    rectangle "UI配置" as UI
}

Global --> Module
Env --> Module
User --> Module
System --> Module

note right of Global
  - 环境变量覆盖
  - 用户自定义设置
  - 系统默认值
end note

note right of Module
  - 模块特定配置
  - 继承全局设置
  - 支持验证规则
end note

@enduml
```

## 日志系统

### 日志级别和流向

```plantuml
@startuml
!theme plain
skinparam participant {
    BackgroundColor #F0F8FF
    BorderColor #5DADE2
}

participant Application
participant Logger
participant FileHandler
participant ConsoleHandler
participant Rotator as "LogRotator"

Application -> Logger: 写入日志
Logger -> Logger: 检查日志级别
alt 超过级别限制
    Logger --> Application: 忽略日志
else 符合级别要求
    Logger -> ConsoleHandler: 输出到控制台
    Logger -> FileHandler: 写入文件
    FileHandler -> Rotator: 检查文件大小
    alt 文件过大
        Rotator -> Rotator: 轮转日志文件
    end
    FileHandler --> Application: 写入完成
end
@enduml
```

## 开发指南

### 添加新命令

1. **创建命令目录**

```bash
mkdir src/commands/my-command
```

2. **实现命令类**

```typescript
export const MyCommand: CommandDefinition = {
  name: 'my-command',
  description: '我的自定义命令',
  action: async options => {
    // 命令逻辑
  },
};
```

3. **自动发现**
   命令发现器会自动扫描并注册新命令。

### 扩展配置

```typescript
// 注册配置验证器
ConfigManager.registerValidator('myValidator', {
  validate: config => {
    /* 验证逻辑 */
  },
  getErrors: () => {
    /* 返回错误信息 */
  },
});
```

### 错误处理

```typescript
try {
  // 业务逻辑
} catch (error) {
  errorHandler(
    error,
    {
      command: 'my-command',
      action: 'execute',
    },
    ErrorSeverity.HIGH
  );
}
```

## 部署和构建

### 构建流程

```plantuml
@startuml
!theme plain
skinparam rectangle {
    BackgroundColor #F8F9FA
    BorderColor #6C757D
}

rectangle "源代码" as Source {
    rectangle "TypeScript" as TS
    rectangle "类型定义" as Types
}

rectangle "构建过程" as Build {
    rectangle "类型检查" as TypeCheck
    rectangle "代码检查" as Lint
    rectangle "编译" as Compile
}

rectangle "输出" as Output {
    rectangle "JavaScript" as JS
    rectangle "类型声明" as DTS
}

TS --> TypeCheck
Types --> TypeCheck
TypeCheck --> Lint
Lint --> Compile
Compile --> JS
Compile --> DTS

@enduml
```

### 质量保证

- **类型检查**：`bun run typecheck`
- **代码规范**：`bun run lint`
- **自动修复**：`bun run lint:fix`
- **格式化**：`bun run format`

## 性能优化

### 内存管理

- 日志缓冲区限制（1000条）
- 配置缓存机制
- 命令延迟加载

### 异步处理

- 所有I/O操作使用异步模式
- 错误处理不阻塞主流程
- 并发命令执行支持

## 安全考虑

- 配置文件权限控制
- 敏感信息不记录日志
- 输入验证和清理
- 错误信息脱敏

## 扩展性

### 插件系统

系统支持通过命令发现机制扩展插件：

```typescript
// 插件示例
export class MyPlugin {
  static commands = [MyCommand1, MyCommand2];
  static config = {
    /* 插件配置 */
  };
}
```

### API接口

统一的命令接口确保兼容性和可测试性。

## 总结

Ops Toolkit 采用现代化的架构设计，具备以下特点：

- **模块化**：清晰的层次结构
- **可扩展**：灵活的插件机制
- **健壮性**：完善的错误处理
- **可维护**：类型安全和文档完善
- **高性能**：异步和优化机制

这个架构为未来的功能扩展和性能优化提供了坚实的基础。
