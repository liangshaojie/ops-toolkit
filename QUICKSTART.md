# ops-toolkit - DevOps CLI Toolkit

一个使用Bun、TypeScript和OpenTUI构建的综合DevOps CLI工具集。

## 🚀 快速开始

### 安装依赖

```bash
bun install
```

### 基本使用

```bash
# 运行默认命令
bun bin/ops-toolkit.ts

# 或者使用bun直接运行
bun run start

# 显示帮助
bun bin/ops-toolkit.ts --help
```

## 📋 可用命令

### 基础命令

- `ops ui` - 启动交互式终端UI（默认）
- `ops monitor` - 系统监控
- `ops logs` - 日志管理
- `ops deploy` - 部署工具
- `ops system` - 系统管理

### 监控命令

- `ops monitor system` - 系统资源监控
- `ops monitor processes` - 进程监控
- `ops monitor network` - 网络监控
- `ops monitor disk` - 磁盘使用监控

### 日志命令

- `ops logs view <file>` - 查看日志文件
- `ops logs search <pattern>` - 搜索日志
- `ops logs analyze <file>` - 日志分析
- `ops logs export <file> <output>` - 导出日志

### 部署命令

- `ops deploy app <app>` - 部署应用
- `ops deploy rollback <app>` - 回滚部署
- `ops deploy status` - 部署状态
- `ops deploy history` - 部署历史

### 系统管理命令

- `ops system users` - 用户管理
- `ops system services` - 服务管理
- `ops system config` - 配置管理
- `ops system info` - 系统信息

## 🛠️ 开发

### 脚本命令

```bash
# 开发模式
bun run dev

# 构建项目
bun run build

# 类型检查
bun run typecheck

# 代码检查
bun run lint

# 自动修复代码格式
bun run lint:fix

# 代码格式化
bun run format
```

### 项目结构

```
ops-toolkit/
├── bin/                    # CLI入口文件
│   └── ops-toolkit.ts
├── src/
│   ├── commands/           # 命令模块
│   │   ├── monitor/       # 监控命令
│   │   ├── logs/          # 日志命令
│   │   ├── deploy/        # 部署命令
│   │   └── system/        # 系统命令
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   └── index.ts           # 主入口
├── scripts/               # 构建脚本
├── docs/                  # 文档
└── 配置文件...
```

## 🎯 特性

- ✅ TypeScript支持
- ✅ Bun包管理和运行时
- ✅ ESLint + Prettier代码规范
- ✅ Husky + lint-staged + commitlint Git工作流
- ✅ Commander.js命令行解析
- ✅ 彩色终端输出（chalk）
- ✅ 模块化架构设计
- 🚧 OpenTUI终端UI集成（开发中）

## 📝 开发计划

- [ ] 完整的OpenTUI界面实现
- [ ] 系统监控功能
- [ ] 日志管理功能
- [ ] 部署工具功能
- [ ] 系统管理功能
- [ ] 配置文件管理
- [ ] 插件系统
- [ ] 单元测试

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！
