# 后端技术方案

## 1. 背景与目标

### 当前状态

- 博客内容通过本地 MDX 文件管理
- 使用 `LocalMarkdownProvider` 从文件系统读取数据
- 所有数据在构建时或运行时从本地文件系统获取

### 后端需求

当前 Provider 层已经为后端集成做好准备，以下功能需要真实后端支持：

#### 核心需求

1. **动态内容管理**
    - 文章的 CRUD 操作（Create, Read, Update, Delete）
    - 支持在线编辑和发布文章
    - 草稿管理和版本控制

2. **用户系统**
    - 用户注册、登录、认证
    - 权限管理（管理员、编辑、访客）
    - 个人资料管理

3. **交互功能**
    - 评论系统（文章评论、回复）
    - 点赞/收藏功能
    - 浏览量统计

4. **搜索服务**
    - 全文搜索
    - 标签/分类筛选
    - 搜索历史和推荐

#### 扩展需求

- 文章定时发布
- RSS 订阅
- 邮件通知
- 数据分析和统计
- 图片/文件上传管理

---

## 2. 技术栈选型

### 方案 A：Next.js API Routes + Serverless

**技术栈**：

- **后端框架**：Next.js API Routes
- **数据库**：PostgreSQL (Vercel Postgres / Supabase)
- **ORM**：Prisma
- **认证**：NextAuth.js
- **文件存储**：Vercel Blob / AWS S3
- **部署**：Vercel

**优势**：

- 前后端统一技术栈，开发效率高
- Serverless 架构，按需付费，成本低
- Vercel 生态完善，部署简单
- TypeScript 全栈类型安全

**劣势**：

- Serverless 冷启动延迟
- 复杂业务逻辑可能受限
- 数据库连接池管理需要注意

---

### 方案 B：独立 Node.js 后端

**技术栈**：

- **后端框架**：Nest.js / Express.js
- **数据库**：PostgreSQL / MongoDB
- **ORM**：Prisma / TypeORM
- **认证**：Passport.js / JWT
- **文件存储**：MinIO / AWS S3
- **部署**：Docker + VPS / Railway / Render

**优势**：

- 完全控制后端逻辑和性能
- 适合复杂业务场景
- 可独立扩展和优化
- 更灵活的部署选项

**劣势**：

- 需要维护独立服务器
- 开发和运维成本较高
- 前后端分离，需要处理 CORS

---

### 方案 C：Headless CMS

**技术栈**：

- **CMS**：Strapi / Sanity / Contentful
- **数据库**：CMS 自带或外部数据库
- **认证**：CMS 内置
- **部署**：CMS 托管服务或自托管

**优势**：

- 开箱即用的内容管理界面
- 快速开发，无需从零搭建后端
- 内置权限管理和 API
- 适合内容驱动的应用

**劣势**：

- 定制化能力有限
- 可能需要付费（托管服务）
- 迁移成本较高

---

## 3. 推荐方案

### **方案 A：Next.js API Routes + Serverless**

**理由**：

1. 与现有 Next.js 前端无缝集成
2. 开发效率高，学习成本低
3. Vercel 部署简单，适合个人博客
4. 成本可控（Vercel 免费额度足够小型项目）

---

## 4. 技术架构设计

### 4.1 数据库设计

#### 核心表结构

##### users（用户表）

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user', -- admin, editor, user
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

##### posts（文章表）

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

##### tags（标签表）

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

##### post_tags（文章-标签关联表）

```sql
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

##### comments（评论表）

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  parent_id UUID REFERENCES comments(id), -- 支持嵌套回复
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

##### post_stats（文章统计表）

```sql
CREATE TABLE post_stats (
  post_id UUID PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 4.2 API 设计

#### RESTful API 端点

##### 文章相关

```text
GET    /api/posts              # 获取文章列表（支持分页、筛选）
GET    /api/posts/:slug        # 获取单篇文章
POST   /api/posts              # 创建文章（需认证）
PUT    /api/posts/:slug        # 更新文章（需认证）
DELETE /api/posts/:slug        # 删除文章（需认证）
```

##### 标签相关

```text
GET    /api/tags               # 获取所有标签
GET    /api/tags/:slug/posts   # 获取标签下的文章
```

##### 评论相关

```text
GET    /api/posts/:slug/comments  # 获取文章评论
POST   /api/posts/:slug/comments  # 发表评论（需认证）
DELETE /api/comments/:id          # 删除评论（需认证）
```

##### 用户相关

```text
POST   /api/auth/register      # 用户注册
POST   /api/auth/login         # 用户登录
POST   /api/auth/logout        # 用户登出
GET    /api/auth/me            # 获取当前用户信息
```

##### 统计相关

```text
POST   /api/posts/:slug/view   # 记录浏览
POST   /api/posts/:slug/like   # 点赞/取消点赞
```

---

### 4.3 Provider 层集成

#### ApiContentProvider 实现

```typescript
export class ApiContentProvider implements ContentProvider {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

    async getPosts(): Promise<Post[]> {
        const res = await fetch(`${this.baseUrl}/posts`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
    }

    async getPostBySlug(slug: string): Promise<Post | null> {
        const res = await fetch(`${this.baseUrl}/posts/${slug}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch post");
        return res.json();
    }

    async getTags(): Promise<Tag[]> {
        const res = await fetch(`${this.baseUrl}/tags`);
        if (!res.ok) throw new Error("Failed to fetch tags");
        return res.json();
    }

    async getPostsByTag(tag: string): Promise<Post[]> {
        const res = await fetch(`${this.baseUrl}/tags/${tag}/posts`);
        if (!res.ok) throw new Error("Failed to fetch posts by tag");
        return res.json();
    }
}
```

#### Provider 切换

在 `lib/content/index.ts` 中根据环境变量切换 Provider：

```typescript
import { ApiContentProvider } from "./ApiContentProvider";
import { ContentProvider } from "./ContentProvider";
import { LocalMarkdownProvider } from "./LocalMarkdownProvider";

export function getContentProvider(): ContentProvider {
    const useApi = process.env.NEXT_PUBLIC_USE_API === "true";
    return useApi ? new ApiContentProvider() : new LocalMarkdownProvider();
}
```

---

### 4.4 认证与授权

#### NextAuth.js 配置

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password_hash);

                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.username,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 5. 实施路线图

### Phase 1: 基础设施搭建（1-2周）

- [ ] 初始化数据库（Prisma Schema）
- [ ] 配置 NextAuth.js
- [ ] 实现基础 API Routes（posts, tags）
- [ ] 实现 `ApiContentProvider`

### Phase 2: 核心功能开发（2-3周）

- [ ] 用户注册/登录功能
- [ ] 文章 CRUD API
- [ ] 评论系统 API
- [ ] 文章统计（浏览、点赞）

### Phase 3: 前端集成（1-2周）

- [ ] 切换到 `ApiContentProvider`
- [ ] 实现管理后台（文章编辑、发布）
- [ ] 集成评论组件
- [ ] 用户个人中心

### Phase 4: 优化与部署（1周）

- [ ] 性能优化（缓存、CDN）
- [ ] 安全加固（CSRF、XSS 防护）
- [ ] 部署到 Vercel
- [ ] 数据迁移（本地 MDX → 数据库）

---

## 6. 成本估算

### Vercel 免费额度

- **Serverless Functions**：100GB-Hours/月
- **Bandwidth**：100GB/月
- **Build Time**：100小时/月

### Vercel Postgres（Hobby）

- **存储**：256MB
- **行数**：10,000行
- **费用**：免费

### 升级方案（Pro）

- **费用**：$20/月
- **Serverless Functions**：1000GB-Hours/月
- **Bandwidth**：1TB/月
- **Postgres**：更大存储和行数限制

---

## 7. 风险与挑战

### 技术风险

- **Serverless 冷启动**：可能影响首次请求性能
    - 缓解：使用 Vercel Edge Functions 或预热策略
- **数据库连接池**：Serverless 环境下连接数限制
    - 缓解：使用 Prisma Data Proxy 或连接池管理

### 业务风险

- **数据迁移**：从本地 MDX 迁移到数据库
    - 缓解：编写迁移脚本，保留 MDX 作为备份

- **SEO 影响**：从 SSG 切换到 API 可能影响 SEO
    - 缓解：保持 ISR/SSG 渲染策略，仅数据源切换

---

## 8. 总结

推荐采用 **Next.js API Routes + Serverless** 方案，理由如下：

1. 与现有架构无缝集成
2. 开发效率高，学习成本低
3. 部署简单，成本可控
4. 适合个人博客规模

后续可根据实际需求逐步扩展功能，或在必要时迁移到独立后端服务。
