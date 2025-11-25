# API Routes

本目录包含 Next.js API Routes，用于后端 API 实现。

## 当前状态

目前项目使用本地文件系统作为数据源（`LocalMarkdownProvider`），API Routes 尚未实现。

## 未来规划

根据 [backend-plan.md](../../backend-plan.md)，将实现以下 API 端点：

### 文章相关

- `GET /api/posts` - 获取文章列表
- `GET /api/posts/:slug` - 获取单篇文章
- `POST /api/posts` - 创建文章（需认证）
- `PUT /api/posts/:slug` - 更新文章（需认证）
- `DELETE /api/posts/:slug` - 删除文章（需认证）

### 标签相关

- `GET /api/tags` - 获取所有标签
- `GET /api/tags/:slug/posts` - 获取标签下的文章

### 评论相关

- `GET /api/posts/:slug/comments` - 获取文章评论
- `POST /api/posts/:slug/comments` - 发表评论（需认证）
- `DELETE /api/comments/:id` - 删除评论（需认证）

### 用户认证

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 统计相关

- `POST /api/posts/:slug/view` - 记录浏览
- `POST /api/posts/:slug/like` - 点赞/取消点赞

## 技术栈

- **框架**: Next.js API Routes
- **数据库**: PostgreSQL (Vercel Postgres / Supabase)
- **ORM**: Prisma
- **认证**: NextAuth.js

## 使用方式

通过环境变量 `NEXT_PUBLIC_USE_API=true` 切换到 API 数据源。
