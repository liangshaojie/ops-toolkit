# ops-toolkit 发布指南

## 概述

本文档说明如何将 ops-toolkit 发布到 npm registry。

## 重要变更（2025年12月）

npm 已永久撤销 classic tokens，现在使用以下认证方式：

- **Granular Access Tokens**：最多90天有效期，需要2FA
- **Session Tokens**：2小时有效期，通过 `npm login` 获取
- **OIDC Trusted Publishing**：推荐用于CI/CD，无需管理token

## 发布流程

### 1. 准备工作

确保代码已提交并通过检查：

```bash
# 检查工作目录是否干净
git status

# 运行代码检查
bun run lint
bun run typecheck

# 构建项目
bun run build
```

### 2. 登录 npm（可选）

如果使用 session token（2小时有效期）：

```bash
npm login
```

这会创建一个2小时的 session token，期间可以发布无需 OTP。

### 3. 发布到 npm

使用以下命令发布不同版本：

```bash
# Patch 版本（bug fixes）：1.2.1 → 1.2.2
bun run publish:patch

# Minor 版本（新功能）：1.2.1 → 1.3.0
bun run publish:minor

# Major 版本（破坏性变更）：1.2.1 → 2.0.0
bun run publish:major
```

## 自动化发布流程

`publish:*` 命令自动执行以下步骤：

1. **质量检查**
   - 运行 ESLint
   - 运行 TypeScript 类型检查

2. **版本升级**
   - 升级 package.json 中的版本号
   - 创建 git tag（如 v1.2.2）
   - 生成 changelog

3. **构建**
   - 编译 TypeScript 代码
   - 生成 dist/ 目录
   - 设置可执行权限

4. **发布**
   - 发布到 npm registry
   - 创建 GitHub release（需要 GITHUB_TOKEN）

5. **推送**
   - 推送 git commits 和 tags 到远程仓库

## 版本选择指南

### Patch 版本

```bash
bun run publish:patch
```

使用场景：

- Bug 修复
- 小改进
- 非破坏性更改
- 文档更新

### Minor 版本

```bash
bun run publish:minor
```

使用场景：

- 新功能
- 向后兼容的更改
- 添加功能

### Major 版本

```bash
bun run publish:major
```

使用场景：

- 破坏性更改
- API 更改
- 移除功能

## 配置说明

### .npmrc 项目配置

项目根目录包含 `.npmrc` 文件，配置：

- registry 地址
- 公开访问权限

**重要**：认证 tokens 不应提交到 `.npmrc`，应通过以下方式设置：

1. 全局 `~/.npmrc`（推荐用于开发）
2. 环境变量 `NPM_TOKEN`（推荐用于 CI/CD）
3. 通过 `npm login` 创建 session token

### .release-it.json 配置

发布自动化配置包含：

- Git 操作（commit, tag, push）
- GitHub releases
- npm 发布设置
- 预发布和后发布 hooks

## 故障排除

### 错误：403 Forbidden

**原因**：版本已存在或权限问题

**解决方案**：

- 检查版本是否已发布：`npm view ops-toolkit versions`
- 确保有发布权限
- 检查 token 是否有效

### 错误：EOTP / 需要一次性密码

**原因**：启用了 2FA

**解决方案**：

```bash
# 方法1：使用 npm login 创建 session token（推荐）
npm login
bun run publish:patch

# 方法2：手动提供 OTP
NPM_OTP=123456 bun run publish:patch
```

### 错误：Access token expired or revoked

**原因**：token 已过期或被撤销

**解决方案**：

1. 创建新的 granular token：https://www.npmjs.com/settings/~/tokens
2. 选择 "Granular Access Token"
3. 勾选 "Publish" 权限
4. 勾选 "Bypass 2FA"（用于自动化）
5. 设置过期时间（最长90天）
6. 更新 token 配置

### 错误：Git push 被阻止（包含密钥）

**原因**：GitHub 检测到 commit 中的敏感信息

**解决方案**：

```bash
# 1. 回退到包含密钥之前的 commit
git log --oneline
git reset --hard <commit-hash>

# 2. 清理历史（如有必要）
# 注意：这会重写历史，谨慎使用
git filter-branch --force --tree-filter 'sed -i "" "s/<TOKEN>//g" .release-it.json'

# 3. 强制推送
git push origin master --force
```

### 错误：Working dir must be clean

**原因**：有未提交的更改

**解决方案**：

```bash
git add .
git commit -m "your commit message"
```

## 手动发布

如果自动化脚本失败，可以手动发布：

```bash
# 1. 构建项目
bun run build

# 2. 升级版本
npm version patch  # 或 minor, major

# 3. 发布
npm publish --access public

# 4. 推送 git tags
git push origin master --tags
```

## 环境变量

### NPM_TOKEN

用于 CI/CD 环境的 granular token：

```bash
export NPM_TOKEN=npm_xxxxxxxxxxxxxxxxx
```

### NPM_OTP

用于提供一次性密码：

```bash
export NPM_OTP=123456
```

### GITHUB_TOKEN

用于自动创建 GitHub releases：

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxx
```

获取方式：

- 访问 https://github.com/settings/tokens
- 生成新的 personal access token
- 勾选 `repo` 权限

## CI/CD 集成

### GitHub Actions 示例

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci

      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 安全最佳实践

1. **永远不要**将 tokens 提交到 git
2. 使用 `.gitignore` 排除 `.npmrc`（如果包含 tokens）
3. 定期轮换 tokens（granular tokens 最多90天）
4. 使用最小权限原则
5. 考虑使用 OIDC trusted publishing（推荐用于 CI/CD）

## 相关链接

- npm 发布文档：https://docs.npmjs.com/cli/v9/commands/npm-publish
- Granular tokens：https://docs.npmjs.com/creating-and-viewing-access-tokens
- OIDC trusted publishing：https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow
- release-it 文档：https://github.com/release-it/release-it

## 快速参考

| 命令                            | 用途               |
| ------------------------------- | ------------------ |
| `bun run publish:patch`         | 发布 patch 版本    |
| `bun run publish:minor`         | 发布 minor 版本    |
| `bun run publish:major`         | 发布 major 版本    |
| `npm login`                     | 创建 session token |
| `npm view ops-toolkit versions` | 查看已发布版本     |
| `npm pack --dry-run`            | 预览将要发布的内容 |
