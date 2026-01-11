# ops-toolkit 开发技巧指南

本指南提供开发 ops-toolkit 项目时的高效技巧和最佳实践。

## 🤖 使用 OpenCode AI 助手

### 项目感知能力

OpenCode AI 助手已经通过 `AGENTS.md` 配置，了解项目的：

- **技术栈**: Bun + TypeScript + Commander + Chalk + OpenTUI
- **项目结构**: 命令模式，`src/index.ts` 为入口点
- **代码规范**: ESLint + Prettier，遵循 conventional commits
- **开发流程**: watch 模式开发，tsx 调试

### 常见任务示例

#### 添加新 CLI 命令

```
帮我添加一个名为 backup 的命令，用于备份数据
```

OpenCode 会自动：

1. 在 `src/commands/` 创建命令文件
2. 在 `src/index.ts` 注册命令
3. 添加类型定义（如果需要）

#### 修复 Bug

```
帮我修复 monitor 命令中的错误
```

OpenCode 会：

1. 搜索相关代码
2. 分析问题原因
3. 提供修复方案
4. 运行类型检查和 lint

#### 重构代码

```
重构 src/utils/logger.ts，提高性能
```

OpenCode 会：

1. 分析现有代码结构
2. 识别性能瓶颈
3. 提供优化建议
4. 保持功能不变

### 高效提问技巧

#### ✅ 好的提问

```
帮我在 monitor 命令中添加 CPU 使用率显示功能，
要求：
1. 实时刷新（每秒）
2. 使用 chalk 显示不同颜色（<50% 绿色，50-80% 黄色，>80% 红色）
3. 显示百分比和具体数值
```

#### ❌ 不好的提问

```
帮我优化代码
```

## 🎯 VS Code 开发技巧

### 快捷键组合

| 快捷键                            | 功能           | 使用场景            |
| --------------------------------- | -------------- | ------------------- |
| `F5`                              | 启动调试       | 调试代码            |
| `Cmd+Shift+B`                     | 运行任务       | 执行 dev/build/test |
| `Cmd+Shift+F`                     | 格式化文档     | 保存后自动格式化    |
| `Cmd+Shift+P` → "ESLint: Fix all" | 修复 lint 问题 | 提交前检查          |
| `Cmd+P`                           | 快速打开文件   | 导航到特定文件      |
| `Cmd+Shift+O`                     | 符号导航       | 跳转到函数/类       |
| `Cmd+Click`                       | 跳转到定义     | 查看代码实现        |
| `Opt+Click`                       | Peek 定义      | 在侧边预览定义      |
| `F12`                             | 转到定义       | 查看代码定义        |
| `Shift+F12`                       | 查找所有引用   | 了解代码使用情况    |

### 工作区任务

通过 `Cmd+Shift+B` 或任务面板可以快速访问：

```bash
# 开发模式（推荐日常使用）
Dev: Watch (默认)

# 构建和测试
Build
Test
Lint / Lint: Fix
Typecheck
Format

# 快速运行
Start (运行一次)
```

### 分屏开发

```bash
# 垂直分屏
Cmd+K 然后 Cmd+V

# 水平分屏
Cmd+K 然后 Cmd+H

# 在新窗口打开
Cmd+K 然后 Cmd+O

# 在编辑器组间移动
Cmd+Opt+左右箭头
```

### 多光标编辑

```bash
# 添加光标
Opt+Click

# 选择所有相同单词
Cmd+D

# 选择所有匹配项
Cmd+Shift+L

# 在行尾添加光标
Cmd+Opt+I
```

## 🧩 代码片段使用

项目配置了常用代码片段，输入前缀后按 `Tab` 即可展开。

### CLI 命令片段

```typescript
// 输入: cli-cmd + Tab
// 生成:
program
  .command('commandName')
  .description('Description')
  .action(async options => {
    // 光标在这里
  });
```

### 异步函数片段

```typescript
// 输入: async-fn + Tab
// 生成:
async function functionName(args): Promise<returnType> {
  // 光标在这里
}
```

### 错误处理片段

```typescript
// 输入: try-catch + Tab
// 生成:
try {
  // 光标在这里
} catch (error) {
  console.error(chalk.red('❌ Error:'), error);
  process.exit(1);
}
```

### 彩色日志片段

```typescript
// 输入: log + Tab
// 生成:
console.log(chalk.red('message'));
// 使用 Tab 切换颜色: red, green, yellow, blue, magenta, cyan, gray, white
```

### 测试片段

```typescript
// 输入: test-desc + Tab
// 生成:
describe('test suite', () => {
  it('test case', () => {
    // 光标在这里
  });
});
```

## 🐛 调试技巧

### 设置断点

#### 方法 1: 行号断点（推荐）

在行号左侧点击设置断点

#### 方法 2: 条件断点

右键行号 → "Add Conditional Breakpoint" → 输入条件

```typescript
// 只在特定条件下断点
process.env.DEBUG === 'true';
```

#### 方法 3: 日志断点

右键行号 → "Add Logpoint" → 输入表达式

```typescript
// 不中断，只记录日志
{
  variableName;
}
```

### 调试变量检查

#### 调试面板功能

- **Variables**: 查看作用域内所有变量
- **Watch**: 监视特定表达式
- **Call Stack**: 查看调用堆栈
- **Breakpoints**: 管理所有断点

#### 控制台调试

在调试控制台中可以：

```javascript
// 查看变量值
variableName;

// 修改变量值
variableName = newValue;

// 执行表达式
someFunction();
```

### 常见调试场景

#### 调试 CLI 参数解析

在 `src/index.ts` 中找到：

```typescript
const options = program.opts();
// 在这里设置断点查看解析的参数
```

#### 调试异步操作

在 `await` 前后都设置断点：

```typescript
const result = await someAsyncCall();
// 设置断点查看 result
```

#### 调试错误处理

在 catch 块设置断点：

```typescript
try {
  // 可能出错的代码
} catch (error) {
  debugger; // 或在这里设置断点
  // 查看 error 对象
}
```

## 🚀 高效开发工作流

### 日常开发流程

```bash
# 1. 启动开发服务器（watch 模式）
bun run dev

# 2. 在 VS Code 中开发
# - 使用代码片段快速编码
# - 保存时自动格式化和 lint
# - F5 调试问题

# 3. 完成功能后
# 运行类型检查
bun run typecheck

# 运行测试
bun test

# 提交代码
git add .
git commit -m "feat: 添加新功能"
```

### 添加新功能流程

```bash
# 1. 使用 OpenCode 询问
"帮我添加一个 backup 命令，包含备份和恢复子命令"

# 2. 测试功能
bun run dev
# 在另一个终端测试命令

# 3. 运行质量检查
bun run typecheck
bun run lint:fix
bun test

# 4. 提交代码
git add .
git commit -m "feat: add backup command"
```

### Bug 修复流程

```bash
# 1. 复现 Bug
bun run dev
# 运行出问题的命令

# 2. 使用 F5 调试
# 设置断点，检查变量

# 3. 修复代码
# 或让 OpenCode 帮助修复
"帮我修复 monitor 命令中的错误"

# 4. 验证修复
bun run dev
# 重新测试

# 5. 提交修复
git add .
git commit -m "fix: 修复 monitor 命令的错误"
```

## 📋 Git 工作流

### 提交信息格式

项目使用 conventional commits，必须遵循：

```bash
feat: 新功能
fix: Bug 修复
refactor: 代码重构
docs: 文档更新
style: 代码格式调整
test: 测试相关
chore: 构建/工具配置
perf: 性能优化
```

### 提交前检查

```bash
# 运行所有检查
bun run typecheck
bun run lint:fix
bun test

# 提交（husky 会自动运行 lint-staged）
git add .
git commit -m "feat: 添加功能"
```

### 分支管理

```bash
# 创建功能分支
git checkout -b feature/your-feature

# 开发完成后
git checkout master
git merge feature/your-feature
git branch -d feature/your-feature
```

## 🎨 代码风格快速修复

### 批量格式化

```bash
# 格式化所有文件
bun run format

# 或使用 VS Code
Cmd+Shift+P → "Format Document"
# 或
Cmd+Shift+P → "Format All Documents"
```

### 批量 lint 修复

```bash
# 自动修复所有可修复的 lint 问题
bun run lint:fix

# 或使用 VS Code
Cmd+Shift+P → "ESLint: Fix all auto-fixable Problems"
```

### 保存时自动操作

VS Code 已配置保存时：

- 自动格式化文档
- 自动修复 ESLint 问题
- 自动组织导入

## 🔍 搜索和导航

### 文件内搜索

```bash
Cmd+F    # 查找
Cmd+G    # 查找下一个
Cmd+Shift+G    # 查找上一个
Cmd+Opt+F  # 查找和替换
```

### 项目范围搜索

```bash
Cmd+Shift+F    # 在文件中搜索
Cmd+Shift+H    # 在文件中替换
```

### 符号导航

```bash
Cmd+Shift+O    # 跳转到文件中的符号
Cmd+T          # 跳转到任何文件
Cmd+P          # 快速打开文件
```

### Git 导航

```bash
Cmd+Shift+G    # 打开 Git 视图
Cmd+Click      # 查看上一提交
```

## 💡 高级技巧

### 自定义代码片段

在 `.vscode/typescript.code-snippets` 中添加：

```json
{
  "Custom Snippet": {
    "prefix": "custom-prefix",
    "body": ["your code here", "$0"],
    "description": "Description"
  }
}
```

### 多项目工作区

```bash
# 创建工作区文件
File → Save Workspace As...

# 在工作区中打开多个项目
```

### 远程开发

```bash
# 使用 VS Code Remote
Cmd+Shift+P → "Remote-SSH: Connect to Host"

# 或使用 GitHub Codespaces
```

### 集成终端快捷键

```bash
Cmd+`          # 切换终端
Cmd+Shift+`    # 新建终端
Cmd+K          # 清空终端
Ctrl+C         # 中断当前命令
```

## 📚 资源链接

- [OpenCode 文档](https://opencode.ai/docs)
- [Bun 文档](https://bun.sh/docs)
- [Commander.js](https://github.com/tj/commander.js)
- [Chalk](https://github.com/chalk/chalk)
- [VS Code 快捷键](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)

## 🆘 获取帮助

### 在 OpenCode 中

```
/show-config    # 显示项目配置
/help          # 显示帮助信息
/status         # 显示当前状态
```

### 在项目中

```bash
# 查看可用命令
bun run dev --help

# 查看文档
cat README.md
cat AGENTS.md
cat docs/DEVELOPMENT_GUIDE.md
```

---

**提示**: 熟练掌握这些技巧可以显著提高开发效率！建议保存本文档作为参考。
