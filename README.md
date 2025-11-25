# Arcadia

> Next.js 全栈博客工程化项目

## 项目架构

### 核心理念

- **强抽象、弱耦合**：数据通过 Provider 获取，UI 与数据源解耦
- **架构优先于代码**：模块 → 子模块 → 接口 → 实现
- **工程化、可扩展**：所有模块可独立替换

### 目录结构

```text
app/                 # 页面级组件和路由
  blog/              # 博客列表和详情页
  calendar/          # 日历页面
  archives/          # 时间线归档页
  tags/              # 标签页
components/          # UI 组件（纯视图）
  blog/              # 博客相关组件
  calendar/          # 日历组件
  layout/            # 布局组件
  ui/                # 基础 UI 组件
lib/
  content/           # Content Provider 抽象层
  calendar/          # 日历算法与 Provider
  markdown/          # Markdown 渲染管线
  theme.ts           # 主题系统
  types/             # TypeScript 类型定义
  utils.ts           # 工具函数
content/             # 本地内容（Markdown/JSON）
  posts/             # 博客文章（支持多级目录）
public/              # 静态资源
```

### 渲染模型

项目根据不同页面特性采用不同的渲染策略：

| 页面              | 渲染模型 | 说明                                                     |
| ----------------- | -------- | -------------------------------------------------------- |
| `/blog`           | **ISR**  | 增量静态再生成，`revalidate: 600`（10分钟）              |
| `/blog/[...slug]` | **SSG**  | 静态站点生成，通过 `generateStaticParams` 预生成所有文章 |
| `/archives`       | **SSG**  | 静态站点生成，时间线归档                                 |
| `/tags`           | **SSG**  | 静态站点生成，标签索引                                   |
| `/tags/[tag]`     | **SSG**  | 静态站点生成，按标签筛选文章                             |
| `/calendar`       | **CSR**  | 客户端渲染，交互式日历                                   |
| `/`               | **SSR**  | 服务端渲染，首页                                         |

### Provider 层架构

#### ContentProvider 接口

所有内容数据通过统一的 `ContentProvider` 接口获取：

```typescript
interface ContentProvider {
    getPosts(): Promise<Post[]>;
    getPostBySlug(slug: string): Promise<Post | null>;
    getTags(): Promise<Tag[]>;
    getPostsByTag(tag: string): Promise<Post[]>;
}
```

#### 实现

- **LocalMarkdownProvider**：从本地 `content/posts` 读取 MDX 文件，支持多级目录
- **ApiContentProvider**：预留的 API 实现（待开发）

#### Markdown 渲染管线

```text
FS → raw markdown → frontmatter → remark → rehype → MDX → React → SSR HTML → Hydration
```

## 快速开始

### 安装依赖

```bash
yarn install
```

### 运行开发服务器

```bash
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看项目。

### 构建生产版本

```bash
yarn build
```

## 工程化

### 代码规范

- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Commitlint**：提交信息规范（Conventional Commits）
- **Husky**：Git hooks 自动化

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```text
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

## 技术栈

- **框架**：Next.js 15 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **内容**：MDX (Markdown + JSX)
- **包管理**：Yarn

## 后端规划

当前项目使用本地文件系统作为数据源。未来可能需要后端支持的功能：

- 评论系统
- 文章点赞/浏览统计
- 用户认证与管理
- 动态内容管理（CMS）
- 搜索服务

详见 [backend-plan.md](./backend-plan.md)

## License

MIT
