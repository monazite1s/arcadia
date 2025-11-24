# Commit 规范说明

本项目使用 **Conventional Commits** 规范来管理 Git 提交信息。

## 使用交互式提交（推荐）

使用 Commitizen 工具进行交互式提交，它会引导你填写符合规范的 commit message：

```bash
yarn commit
```

或者

```bash
git add .
yarn commit
```

这个命令会启动一个交互式界面，引导你：

1. 选择提交类型（feat, fix, docs 等）
2. 填写影响范围（可选）
3. 填写简短描述
4. 填写详细描述（可选）
5. 是否有破坏性变更
6. 关联的 issue（可选）

## 手动提交

如果你熟悉规范，也可以直接使用 git commit：

```bash
git commit -m "feat: 添加用户登录功能"
```

## Commit 类型说明

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响代码运行）
- **refactor**: 重构代码
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动
- **revert**: 回滚之前的提交
- **build**: 构建系统或外部依赖项的更改
- **ci**: CI 配置文件和脚本的更改

## Commit 格式

```txt
<type>(<scope>): <subject>

<body>

<footer>
```

### 示例

```bash
# 简单提交
feat: 添加日历组件

# 带范围的提交
fix(calendar): 修复日期选择器的边界问题

# 带详细描述的提交
feat(blog): 添加文章搜索功能

实现了基于标题和标签的全文搜索功能，
支持实时搜索和结果高亮显示。

Closes #123
```

## 验证机制

项目配置了以下验证机制：

1. **commitlint**: 在 commit 时自动验证 commit message 格式
2. **husky**: Git hooks 管理工具
3. **lint-staged**: 在提交前自动运行 prettier 和 eslint

如果 commit message 不符合规范，提交会被拒绝。
